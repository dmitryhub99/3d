// Pure reducer for AppState (§12.3). `now` is passed in by the store so the reducer stays deterministic.
import { INSPECTOR_MAX, INSPECTOR_MIN, clamp, inspectorDefault } from '../lib/geometry'
import { SECTION_IDS } from '../lib/boot'
import type { SectionRegistry } from '../shell/types'
import { entryOf, record, restore } from './history'
import type { Action, AppState, BootParams, SectionId } from './types'

const CLOSED_PALETTE: AppState['palette'] = { open: false, query: '', highlight: 0 }

function bySection<T>(fn: (id: SectionId) => T): Record<SectionId, T> {
  const out = {} as Record<SectionId, T>
  for (const id of SECTION_IDS) out[id] = fn(id)
  return out
}

const set = <T,>(rec: Record<SectionId, T>, id: SectionId, value: T): Record<SectionId, T> =>
  rec[id] === value ? rec : { ...rec, [id]: value }

/** Initial state: the registry's boot values, then the URL's boot parameters (§12.3, §12.4). */
export function createInitialState(boot: BootParams, sections: SectionRegistry, now = 0): AppState {
  const selection = bySection((id) => sections[id].boot.selection)
  const inspectorOpen = bySection((id) => sections[id].inspector !== 'none' && sections[id].boot.inspectorOpen)
  if (boot.person) selection.people = boot.person
  const b = boot.section
  if (boot.inspectorOpen === false) inspectorOpen[b] = false
  if (boot.inspectorOpen === true && sections[b].inspector !== 'none' && selection[b]) inspectorOpen[b] = true

  const state: AppState = {
    section: b,
    segment: bySection((id) => sections[id].boot.segment),
    selection,
    checked: bySection(() => []),
    inspectorOpen,
    inspectorWidth: bySection((id) => inspectorDefault(sections[id].inspector)),
    channelOpen: bySection((id) => sections[id].localNav === 'channel' && sections[id].boot.channelOpen),
    view: bySection((id) => sections[id].boot.view),
    palette: boot.palette ? { open: true, query: '', highlight: 0 } : CLOSED_PALETTE,
    drop: null,
    keyboardSheet: false,
    resize: null,
    history: { stack: [], index: -1 },
    lastSelectAt: 0,
    channelForced: bySection(() => false),
    chord: null,
  }
  return { ...state, history: { stack: [entryOf(state, 'section', now)], index: 0 } }
}

export function createReducer(sections: SectionRegistry) {
  const hasInspector = (id: SectionId) => sections[id].inspector !== 'none'

  function select(state: AppState, section: SectionId, id: string, via: 'click' | 'key' | 'peek', now: number): AppState {
    const same = state.selection[section] === id
    const open = state.inspectorOpen[section]

    // A click on the already-selected row closes the inspector (§7.3).
    if (via === 'click' && same && open && hasInspector(section)) {
      const next = { ...state, inspectorOpen: set(state.inspectorOpen, section, false) }
      return section === state.section ? record(state, next, 'inspector', now) : next
    }

    const nextOpen = via === 'key' ? open : hasInspector(section) ? true : open
    if (same && nextOpen === open) return state

    const next: AppState = {
      ...state,
      selection: set(state.selection, section, id),
      inspectorOpen: set(state.inspectorOpen, section, nextOpen),
      lastSelectAt: via === 'peek' ? state.lastSelectAt : now,
    }
    if (via === 'peek' || section !== state.section) return next
    return record(state, next, same ? 'inspector' : 'object', now)
  }

  function step(state: AppState, delta: 1 | -1, now: number): AppState {
    const section = state.section
    const order = sections[section].objectOrder(state)
    if (!order.length) return state
    const cur = state.selection[section]
    const i = cur ? order.indexOf(cur) : -1
    const j = i < 0 ? (delta > 0 ? 0 : order.length - 1) : clamp(i + delta, 0, order.length - 1)
    const id = order[j]
    if (id === undefined || id === cur) return state
    return select(state, section, id, 'key', now)
  }

  function check(state: AppState, id: string, mode: 'toggle' | 'add'): AppState {
    const section = state.section
    const list = state.checked[section]
    const has = list.includes(id)
    if (mode === 'add' && has) return state
    const nextList = has ? list.filter((x) => x !== id) : [...list, id]
    return { ...state, checked: set(state.checked, section, nextList) }
  }

  function setInspector(state: AppState, open: boolean, peek: boolean, now: number): AppState {
    const section = state.section
    if (!hasInspector(section) || state.inspectorOpen[section] === open) return state
    let next = state
    if (open && !state.selection[section]) {
      const first = sections[section].objectOrder(state)[0]
      if (!first) return state
      next = { ...next, selection: set(next.selection, section, first) }
    }
    next = { ...next, inspectorOpen: set(next.inspectorOpen, section, open) }
    return peek ? next : record(state, next, 'inspector', now)
  }

  return function reducer(state: AppState, action: Action, now: number = Date.now()): AppState {
    switch (action.type) {
      case 'navigate': {
        if (action.section === state.section) {
          if (!state.palette.open && !state.drop && !state.keyboardSheet) return state
          return { ...state, palette: CLOSED_PALETTE, drop: null, keyboardSheet: false }
        }
        const next: AppState = {
          ...state,
          section: action.section,
          palette: CLOSED_PALETTE,
          drop: null,
          keyboardSheet: false,
          chord: null,
          resize: null,
        }
        return record(state, next, 'section', now)
      }

      case 'setSegment': {
        const { section, segmentId } = action
        if (state.segment[section] === segmentId) return state
        const next: AppState = {
          ...state,
          segment: set(state.segment, section, segmentId),
          checked: state.checked[section].length ? set(state.checked, section, []) : state.checked,
        }
        if (action.record === false || section !== state.section) return next
        return record(state, next, 'segment', now)
      }

      case 'select':
        return select(state, action.section, action.id, action.via, now)

      case 'openObject': {
        const { section, id } = action
        const base: AppState = {
          ...state,
          section,
          palette: CLOSED_PALETTE,
          drop: null,
          keyboardSheet: false,
          chord: null,
          selection: set(state.selection, section, id),
          inspectorOpen: hasInspector(section) ? set(state.inspectorOpen, section, true) : state.inspectorOpen,
          lastSelectAt: now,
        }
        // never merge an explicit open with a J/K run
        return record({ ...state, lastSelectAt: 0 }, base, 'object', now)
      }

      case 'step':
        return step(state, action.delta, now)

      case 'toggleInspector': {
        const cur = state.inspectorOpen[state.section]
        return setInspector(state, action.open ?? !cur, action.via === 'peek', now)
      }

      case 'setInspectorWidth': {
        const w = Math.round(clamp(action.width, INSPECTOR_MIN, INSPECTOR_MAX))
        if (state.inspectorWidth[action.section] === w) return state
        return { ...state, inspectorWidth: set(state.inspectorWidth, action.section, w) }
      }

      case 'toggleChannel': {
        const section = state.section
        if (sections[section].localNav !== 'channel') return state
        const folded = !!action.folded
        const visible = state.channelOpen[section] && (!folded || state.channelForced[section])
        if (visible) {
          return {
            ...state,
            channelOpen: set(state.channelOpen, section, false),
            channelForced: set(state.channelForced, section, false),
          }
        }
        return {
          ...state,
          channelOpen: set(state.channelOpen, section, true),
          channelForced: set(state.channelForced, section, folded),
        }
      }

      case 'toggleCheck':
        return check(state, action.id, action.extend ? 'add' : 'toggle')

      case 'extendCheck': {
        const cur = state.selection[state.section]
        let next = cur ? check(state, cur, 'add') : state
        next = step(next, action.delta, now)
        const after = next.selection[next.section]
        return after ? check(next, after, 'add') : next
      }

      case 'setChecks': {
        const section = state.section
        return { ...state, checked: set(state.checked, section, [...new Set(action.ids)]) }
      }

      case 'clearChecks': {
        const section = state.section
        if (!state.checked[section].length) return state
        return { ...state, checked: set(state.checked, section, []) }
      }

      case 'setView': {
        const section = state.section
        if (state.view[section] === action.view) return state
        return { ...state, view: set(state.view, section, action.view) }
      }

      case 'openPalette':
        return { ...state, palette: { open: true, query: '', highlight: 0 }, drop: null, chord: null }

      case 'closePalette':
        return state.palette.open ? { ...state, palette: CLOSED_PALETTE } : state

      case 'paletteQuery':
        return { ...state, palette: { ...state.palette, query: action.query, highlight: 0 } }

      case 'paletteMove': {
        const h = state.palette.highlight + action.delta
        const n = action.count
        const highlight = n && n > 0 ? ((h % n) + n) % n : Math.max(0, h)
        return { ...state, palette: { ...state.palette, highlight } }
      }

      case 'paletteHighlight':
        if (state.palette.highlight === action.index) return state
        return { ...state, palette: { ...state.palette, highlight: Math.max(0, action.index) } }

      case 'openDrop':
        return { ...state, drop: action.drop, palette: action.drop ? CLOSED_PALETTE : state.palette }

      case 'closeDrop':
        return state.drop ? { ...state, drop: null } : state

      case 'back':
        return restore(state, state.history.index - 1)

      case 'forward':
        return restore(state, state.history.index + 1)

      case 'goto':
        return restore(state, action.index)

      case 'resize':
        return { ...state, resize: action.value }

      case 'toggleKeyboardSheet': {
        const open = action.open ?? !state.keyboardSheet
        if (open === state.keyboardSheet) return state
        return { ...state, keyboardSheet: open, palette: open ? CLOSED_PALETTE : state.palette, drop: open ? null : state.drop }
      }

      case 'escape': {
        // innermost overlay first, then the inspector, then the checks (§10.4, §6.9)
        if (state.palette.open) return { ...state, palette: CLOSED_PALETTE }
        if (state.drop) return { ...state, drop: null }
        if (state.keyboardSheet) return { ...state, keyboardSheet: false }
        if (state.chord) return { ...state, chord: null }
        const section = state.section
        if (hasInspector(section) && state.inspectorOpen[section]) return setInspector(state, false, false, now)
        if (state.checked[section].length) return { ...state, checked: set(state.checked, section, []) }
        return state
      }

      case 'chord':
        return state.chord === action.value ? state : { ...state, chord: action.value }

      default: {
        const never: never = action
        return never
      }
    }
  }
}

export type Reducer = ReturnType<typeof createReducer>
