// Keyboard. One window keydown listener (mounted by the shell through useHotkeys()) dispatches, in order:
//   1. Escape layers (menus, popovers, flags-with-menus): Esc closes the topmost; while an exclusive layer
//      is open, no other key reaches sections or the global map.
//   2. A pending G-chord (§3): the next letter picks a section by its `chord`; any key ends the chord.
//   3. Section keys registered with useSectionKeys() (most recently mounted first).
//   4. The global map (§10.4, plus the §5.3/§6.9 keys that are constant across sections).
// Keys are ignored while a text input has focus, except Esc and ⌘K (§10.4).
// A handler that calls e.preventDefault() upstream (e.g. an input's own Esc) stops the global handling.
import { useEffect, useRef } from 'react'
import { CHORD_WINDOW_MS } from '../lib/motion'
import { computeLayout } from '../lib/layout'
import { getStage } from '../lib/stage'
import { sections } from '../shell/sections'
import { SECTION_IDS } from '../lib/boot'
import { useStore, type Store } from './store'

/** Return false to decline (the key falls through to the next layer); anything else means handled. */
export type KeyHandler = (e: KeyboardEvent) => void | boolean
/** Keys are combos like 'j', 'shift+j', 'mod+s', 'alt+1', 'enter', 'space', 'escape', 'arrowdown', '/', '.', '?'. */
export type KeyMap = Record<string, KeyHandler>

/**
 * Normalize a keydown to a combo string. Modifier order: mod (⌘ or Ctrl), alt, shift.
 * Letters and digits come from e.code (so ⌥1 is 'alt+1', not '¡'); other printable characters come from e.key
 * and never carry 'shift+' ('?' not 'shift+/').
 */
export function comboOf(e: KeyboardEvent): string {
  const code = e.code || ''
  let base: string
  let shiftable = true
  if (/^Key[A-Z]$/.test(code)) base = code.slice(3).toLowerCase()
  else if (/^Digit[0-9]$/.test(code)) base = code.slice(5)
  else if (e.key === ' ' || code === 'Space') base = 'space'
  else if (e.key.length === 1) {
    base = e.key.toLowerCase()
    shiftable = false
  } else base = e.key.toLowerCase()
  let combo = ''
  if (e.metaKey || e.ctrlKey) combo += 'mod+'
  if (e.altKey) combo += 'alt+'
  if (e.shiftKey && shiftable) combo += 'shift+'
  return combo + base
}

export function isTextInput(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  if (el.isContentEditable) return true
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return true
  if (el instanceof HTMLInputElement) {
    return !['checkbox', 'radio', 'button', 'submit', 'reset', 'range', 'color', 'file'].includes(el.type)
  }
  return false
}

// ---- layers --------------------------------------------------------------------------------------

interface SectionLayer { map: { current: KeyMap }; enabled: { current: boolean } }
interface EscapeLayer { close: { current: () => void }; exclusive: boolean }

const sectionLayers: SectionLayer[] = []
const escapeLayers: EscapeLayer[] = []

/**
 * Register section-local keys while the calling component is mounted (and `enabled`).
 * The latest map is always used, so inline handlers are fine.
 *
 *   useSectionKeys({ x: () => dispatch({ type: 'toggleCheck', id }), 'mod+s': (e) => { saveSegment() } })
 */
export function useSectionKeys(map: KeyMap, enabled = true): void {
  const mapRef = useRef(map)
  const enabledRef = useRef(enabled)
  mapRef.current = map
  enabledRef.current = enabled
  useEffect(() => {
    const layer: SectionLayer = { map: mapRef, enabled: enabledRef }
    sectionLayers.unshift(layer)
    return () => {
      const i = sectionLayers.indexOf(layer)
      if (i >= 0) sectionLayers.splice(i, 1)
    }
  }, [])
}

/**
 * While `open`, Esc calls `onEscape` for the topmost layer instead of the global Esc ladder.
 * `exclusive` (default true) also stops every other global and section key while the layer is open,
 * so a menu can own the arrow keys and letters.
 */
export function useEscapeLayer(open: boolean, onEscape: () => void, opts: { exclusive?: boolean } = {}): void {
  const closeRef = useRef(onEscape)
  closeRef.current = onEscape
  const exclusive = opts.exclusive ?? true
  useEffect(() => {
    if (!open) return
    const layer: EscapeLayer = { close: closeRef, exclusive }
    escapeLayers.push(layer)
    return () => {
      const i = escapeLayers.indexOf(layer)
      if (i >= 0) escapeLayers.splice(i, 1)
    }
  }, [open, exclusive])
}

/** True while any escape layer is open (e.g. to suppress hover flags). */
export const hasOpenLayer = () => escapeLayers.length > 0

// ---- global map ----------------------------------------------------------------------------------

function isChannelFolded(store: Store): boolean {
  const s = store.getState()
  const def = sections[s.section]
  return computeLayout(getStage().width, def, s).channelFolded
}

function hasOrder(store: Store): boolean {
  const s = store.getState()
  return sections[s.section].objectOrder(s).length > 0
}

function globalMap(store: Store, startChord: () => void): KeyMap {
  const d = store.dispatch
  const step = (delta: 1 | -1): KeyHandler => () => {
    if (!hasOrder(store)) return false
    d({ type: 'step', delta })
  }
  const extend = (delta: 1 | -1): KeyHandler => () => {
    if (!hasOrder(store)) return false
    d({ type: 'extendCheck', delta })
  }
  return {
    'mod+k': () => d(store.getState().palette.open ? { type: 'closePalette' } : { type: 'openPalette' }),
    'mod+[': () => d({ type: 'back' }),
    'mod+]': () => d({ type: 'forward' }),
    g: startChord,
    '[': () => {
      const s = store.getState()
      if (sections[s.section].localNav !== 'channel') return false
      d({ type: 'toggleChannel', folded: isChannelFolded(store) })
    },
    ']': () => {
      const s = store.getState()
      if (sections[s.section].inspector === 'none') return false
      d({ type: 'toggleInspector' })
    },
    '?': () => d({ type: 'toggleKeyboardSheet' }),
    escape: () => {
      const before = store.getState()
      d({ type: 'escape' })
      return store.getState() !== before
    },
    j: step(1),
    k: step(-1),
    arrowdown: step(1),
    arrowup: step(-1),
    'shift+j': extend(1),
    'shift+k': extend(-1),
    'shift+arrowdown': extend(1),
    'shift+arrowup': extend(-1),
    space: () => {
      const s = store.getState()
      if (sections[s.section].inspector === 'none') return false
      d({ type: 'toggleInspector', via: 'peek' })
    },
    x: () => {
      const s = store.getState()
      const id = s.selection[s.section]
      if (!id) return false
      d({ type: 'toggleCheck', id })
    },
  }
}

// Built lazily: section modules may import this file while the registry is still initializing.
let chords: Record<string, (typeof SECTION_IDS)[number]> | null = null
const chordTarget = (key: string) => {
  chords ??= Object.fromEntries(
    SECTION_IDS.map((id) => [sections[id].chord.toLowerCase(), id] as const).filter(([k]) => k.length === 1),
  )
  return chords[key]
}

/** Mount once, in the shell. */
export function useHotkeys(): void {
  const store = useStore()
  useEffect(() => {
    let chordTimer: number | undefined
    const endChord = () => {
      window.clearTimeout(chordTimer)
      chordTimer = undefined
      if (store.getState().chord) store.dispatch({ type: 'chord', value: null })
    }
    const startChord = () => {
      window.clearTimeout(chordTimer)
      store.dispatch({ type: 'chord', value: 'g' })
      chordTimer = window.setTimeout(endChord, CHORD_WINDOW_MS)
    }
    const map = globalMap(store, startChord)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.isComposing) return
      if (e.key === 'Shift' || e.key === 'Meta' || e.key === 'Control' || e.key === 'Alt') return
      const combo = comboOf(e)
      const typing = isTextInput(e.target)
      if (typing && combo !== 'escape' && combo !== 'mod+k') return

      // 1. escape layers
      const top = escapeLayers[escapeLayers.length - 1]
      if (top) {
        if (combo === 'escape') {
          e.preventDefault()
          top.close.current()
          return
        }
        if (escapeLayers.some((l) => l.exclusive)) return
      }

      // 2. G-chord
      if (store.getState().chord === 'g') {
        endChord()
        const target = !e.metaKey && !e.ctrlKey && !e.altKey ? chordTarget(combo) : undefined
        e.preventDefault()
        if (target) store.dispatch({ type: 'navigate', section: target })
        return
      }

      // 3. section keys
      for (const layer of sectionLayers) {
        if (!layer.enabled.current) continue
        const h = layer.map.current[combo]
        if (h && h(e) !== false) {
          e.preventDefault()
          return
        }
      }

      // 4. global
      const h = map[combo]
      if (h && h(e) !== false) e.preventDefault()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(chordTimer)
    }
  }, [store])
}
