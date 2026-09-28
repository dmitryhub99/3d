import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { Icon } from '../icons/Icon'
import { IconButton } from '../primitives/IconButton'
import { MenuTrigger, type MenuItem } from '../primitives/Menu'
import { Notch } from '../primitives/Notch'
import s from './SegmentStrip.module.css'

/** Structurally compatible with data `Segment` ({ id, label, count, delta? }). */
export interface StripSegment {
  id: string
  label: string
  /** Mono 11 text-3 count after the label (6px). Numbers get thousands separators (1,284). */
  count?: number | string
  /** "Subscribe to changes": a mono `+n` in text-2 after the count. */
  delta?: number
  /** Whether the viewer is subscribed (flips the ⋯ item to "Unsubscribe from changes"). */
  subscribed?: boolean
}

export type SegmentAction = 'rename' | 'duplicate' | 'share' | 'subscribe' | 'delete'

export interface SegmentStripProps {
  segments: readonly StripSegment[]
  /** Selected segment id. */
  value: string
  onChange: (id: string) => void
  /** Right-hand slot (view switcher, Display…), right-aligned to the strip's content edge with 8px gaps. */
  right?: ReactNode
  /** The `+` button after the tabs. Omit to hide it. */
  onAdd?: () => void
  addLabel?: string
  addKeys?: readonly string[] | string
  /**
   * Selected tab ⋯ menu: Rename, Duplicate, Share with team, Subscribe to changes, Delete.
   * Rename is edited inline in the strip and reported as ('rename', id, newLabel). Omit to hide the ⋯.
   */
  onSegmentAction?: (action: SegmentAction, id: string, value?: string) => void
  /** Text after the tabs (the "no segment yet" hint). */
  hint?: ReactNode
  /** Shared layout id for the notch (default "segment-notch"). */
  notchLayoutId?: string
  /** Accessible name of the tab list. */
  label?: string
  className?: string
}

const TAB_GAP = 20
const ADD_W = 16
const MORE_W = 72

const fmtCount = (c: number | string) => (typeof c === 'number' ? c.toLocaleString('en-US') : c)

/**
 * Saved-segment strip (§6.2): 36px band with a line-1 hairline on its bottom edge. Tabs from the content edge,
 * 20px apart: label 13/18 500 (text-3, hover text-2, selected text-1) and a mono 11/16 text-3 count 6px later.
 * The 2px accent notch spans the selected label + count and sits on the hairline (layoutId "segment-notch").
 */
export function SegmentStrip({
  segments,
  value,
  onChange,
  right,
  onAdd,
  addLabel = 'New segment',
  addKeys = ['⌘', 'S'],
  onSegmentAction,
  hint,
  notchLayoutId = 'segment-notch',
  label = 'Segments',
  className,
}: SegmentStripProps) {
  const areaRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef(new Map<string, HTMLButtonElement>())
  const widths = useRef(new Map<string, number>())
  const [visible, setVisible] = useState<string[] | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const idsKey = segments.map((sg) => `${sg.id}:${sg.label}:${sg.count ?? ''}:${sg.delta ?? ''}`).join('|')

  // Any change to the segment list re-measures from a full render.
  useLayoutEffect(() => {
    setVisible(null)
  }, [idsKey])

  // Measure every tab once, then decide how many fit; the rest collapse into "⋯ n more".
  useLayoutEffect(() => {
    const area = areaRef.current
    if (!area) return
    const fit = () => {
      area.querySelectorAll<HTMLElement>('[data-seg-id]').forEach((el) => {
        widths.current.set(el.dataset.segId!, el.offsetWidth)
      })
      if (segments.some((sg) => !widths.current.has(sg.id))) return
      const avail = area.clientWidth - (onAdd ? ADD_W + TAB_GAP : 0)
      const total = segments.reduce((sum, sg, i) => sum + widths.current.get(sg.id)! + (i ? TAB_GAP : 0), 0)
      let next: string[]
      if (total <= avail) next = segments.map((sg) => sg.id)
      else {
        next = []
        let used = MORE_W + TAB_GAP
        const sel = segments.find((sg) => sg.id === value)
        if (sel) used += widths.current.get(sel.id)! + TAB_GAP
        for (const sg of segments) {
          if (sg.id === value) continue
          const w = widths.current.get(sg.id)! + TAB_GAP
          if (used + w > avail) break
          used += w
          next.push(sg.id)
        }
        if (sel) next.push(sel.id)
        next = segments.filter((sg) => next.includes(sg.id)).map((sg) => sg.id)
      }
      setVisible((prev) => (prev && prev.join('|') === next.join('|') ? prev : next))
    }
    fit()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null
    ro?.observe(area)
    return () => ro?.disconnect()
  }, [idsKey, value, onAdd, segments, visible])

  const shown = visible ? segments.filter((sg) => visible.includes(sg.id)) : segments
  const hidden = visible ? segments.filter((sg) => !visible.includes(sg.id)) : []

  const focusTab = (i: number) => {
    const sg = shown[(i + shown.length) % shown.length]
    if (sg) tabRefs.current.get(sg.id)?.focus()
  }

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusTab(i + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusTab(i - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusTab(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      focusTab(shown.length - 1)
    }
  }

  const startRename = (sg: StripSegment) => {
    setDraft(sg.label)
    setRenaming(sg.id)
  }

  const commitRename = () => {
    const id = renaming
    if (!id) return
    const next = draft.trim()
    const cur = segments.find((sg) => sg.id === id)
    setRenaming(null)
    if (next && cur && next !== cur.label) onSegmentAction?.('rename', id, next)
    requestAnimationFrame(() => tabRefs.current.get(id)?.focus())
  }

  const actionItems = (sg: StripSegment): MenuItem[] => [
    { id: 'rename', label: 'Rename', onSelect: () => startRename(sg) },
    { id: 'duplicate', label: 'Duplicate', onSelect: () => onSegmentAction?.('duplicate', sg.id) },
    { id: 'share', label: 'Share with team', onSelect: () => onSegmentAction?.('share', sg.id) },
    {
      id: 'subscribe',
      label: sg.subscribed ? 'Unsubscribe from changes' : 'Subscribe to changes',
      onSelect: () => onSegmentAction?.('subscribe', sg.id),
    },
    { kind: 'separator' },
    { id: 'delete', label: 'Delete', onSelect: () => onSegmentAction?.('delete', sg.id) },
  ]

  const moreItems: MenuItem[] = hidden.map((sg) => ({
    id: sg.id,
    label: sg.label,
    hint: sg.count != null ? fmtCount(sg.count) : undefined,
    onSelect: () => onChange(sg.id),
  }))

  return (
    <div className={cx(s.strip, className)}>
      <div ref={areaRef} className={s.area}>
        <div role="tablist" aria-label={label} className={s.tabs}>
          {shown.map((sg, i) => {
            const selected = sg.id === value
            const editing = renaming === sg.id
            return (
              <div key={sg.id} className={cx(s.tabWrap, selected && s.selectedWrap)} data-seg-id={sg.id}>
                <button
                  ref={(el) => {
                    if (el) tabRefs.current.set(sg.id, el)
                    else tabRefs.current.delete(sg.id)
                  }}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  className={cx(s.tab, selected && s.selected)}
                  onClick={() => !editing && onChange(sg.id)}
                  onDoubleClick={() => selected && onSegmentAction && startRename(sg)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  <span className={s.span}>
                    {editing ? (
                      <input
                        className={s.rename}
                        value={draft}
                        aria-label="Segment name"
                        autoFocus
                        onFocus={(e) => e.currentTarget.select()}
                        onChange={(e) => setDraft(e.currentTarget.value)}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={commitRename}
                        onKeyDown={(e) => {
                          e.stopPropagation()
                          if (e.key === 'Enter') commitRename()
                          if (e.key === 'Escape') {
                            e.preventDefault()
                            setRenaming(null)
                            requestAnimationFrame(() => tabRefs.current.get(sg.id)?.focus())
                          }
                        }}
                      />
                    ) : (
                      <span className={s.label}>{sg.label}</span>
                    )}
                    {sg.count != null ? <span className={s.count}>{fmtCount(sg.count)}</span> : null}
                    {selected ? <Notch orientation="h" length="100%" layoutId={notchLayoutId} className={s.notch} /> : null}
                  </span>
                  {sg.delta ? <span className={s.delta}>+{sg.delta}</span> : null}
                </button>
                {selected && onSegmentAction && !editing ? (
                  <span className={s.more}>
                    <MenuTrigger items={actionItems(sg)} label={`${sg.label} actions`} width={200}>
                      <IconButton icon="more" size={16} label="Segment actions" flag={false} />
                    </MenuTrigger>
                  </span>
                ) : null}
              </div>
            )
          })}
          {hidden.length > 0 ? (
            <MenuTrigger items={moreItems} label="More segments" width={240}>
              <button type="button" className={s.overflow}>
                <Icon name="more" size={12} />
                <span>
                  <span className={s.overflowNum}>{hidden.length}</span> more
                </span>
              </button>
            </MenuTrigger>
          ) : null}
          {onAdd ? (
            <span className={s.add}>
              <IconButton icon="plus" size={16} label={addLabel} keys={addKeys} onClick={onAdd} />
            </span>
          ) : null}
          {hint ? <span className={s.hint}>{hint}</span> : null}
        </div>
      </div>
      {right ? <div className={s.right}>{right}</div> : null}
    </div>
  )
}

/**
 * Optional ⌥1–⌥9 → segment n (§6.9). Use it only if the global hotkey layer does not already handle ⌥n.
 */
export function useSegmentHotkeys(segments: readonly StripSegment[], onChange: (id: string) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (!e.altKey || e.metaKey || e.ctrlKey) return
      const m = /^Digit([1-9])$/.exec(e.code)
      if (!m) return
      const sg = segments[Number(m[1]) - 1]
      if (!sg) return
      e.preventDefault()
      onChange(sg.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [segments, onChange, enabled])
}
