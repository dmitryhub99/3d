import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { cx } from '../../lib/cx'
import { getStage } from '../../lib/stage'
import { IconButton } from '../primitives/IconButton'
import { MenuTrigger, type MenuItem } from '../primitives/Menu'
import s from './ColumnHeader.module.css'

export interface ColumnDef {
  id: string
  /** Sentence case ("Person", "Fit", "Availability"). */
  label: string
  /** Left edge in px from the header's left edge (People: Person 16, Company 264, Fit 408 …). */
  x: number
  width: number
  /** Label alignment inside the column (default 'start'). */
  align?: 'start' | 'end'
  /** Clicking the label sorts by this column (needs onSort). Default true when onSort is given. */
  sortable?: boolean
  /** Hidden columns are skipped. */
  hidden?: boolean
  /** Minimum width while resizing (default 48). */
  minWidth?: number
}

export interface ColumnSort {
  id: string
  dir?: 'asc' | 'desc'
}

export interface ColumnHeaderProps {
  columns: readonly ColumnDef[]
  /** The sorted column: its label turns text-2 and gains a mono ↓ (↑ when dir is 'asc'). */
  sort?: ColumnSort | string | null
  onSort?: (id: string) => void
  onHide?: (id: string) => void
  /** Move a column one slot left (-1) or right (+1). */
  onMove?: (id: string, dir: -1 | 1) => void
  /** Drag the right-edge hairline to resize. Omit to show the edges without a resize cursor. */
  onResize?: (id: string, width: number) => void
  /** Rows scrolled: the bottom hairline switches from line-1 to line-2 (§2.3). */
  scrolled?: boolean
  /** Show the hover ⋯ menu (Sort, Hide, Move). Default true. */
  menu?: boolean
  className?: string
}

/**
 * Column header band (§6.4): 28px, labels 11/16 500 text-3 in sentence case, baseline 18px below the top,
 * hairline on the bottom edge. Hover shows line-2 edge hairlines and a 16px ⋯ at the column's right edge.
 */
export function ColumnHeader({
  columns,
  sort,
  onSort,
  onHide,
  onMove,
  onResize,
  scrolled = false,
  menu = true,
  className,
}: ColumnHeaderProps) {
  const sortId = typeof sort === 'string' ? sort : (sort?.id ?? null)
  const sortDir = typeof sort === 'string' ? 'desc' : (sort?.dir ?? 'desc')
  const visible = columns.filter((c) => !c.hidden)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [resizing, setResizing] = useState<string | null>(null)
  const drag = useRef<{ id: string; startX: number; startW: number; min: number } | null>(null)

  const beginResize = (e: ReactPointerEvent<HTMLSpanElement>, col: ColumnDef) => {
    if (!onResize || e.button !== 0) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { id: col.id, startX: e.clientX, startW: col.width, min: col.minWidth ?? 48 }
    setResizing(col.id)
  }
  const moveResize = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const d = drag.current
    if (!d || !onResize) return
    const k = getStage().scale || 1
    onResize(d.id, Math.max(d.min, Math.round(d.startW + (e.clientX - d.startX) / k)))
  }
  const endResize = () => {
    drag.current = null
    setResizing(null)
  }

  const items = (col: ColumnDef, i: number): MenuItem[] => {
    const out: MenuItem[] = []
    if (onSort && col.sortable !== false)
      out.push({ id: 'sort', label: `Sort by ${col.label.toLocaleLowerCase()}`, selected: sortId === col.id, onSelect: () => onSort(col.id) })
    if (onHide) out.push({ id: 'hide', label: 'Hide', onSelect: () => onHide(col.id) })
    if (onMove) {
      if (out.length) out.push({ kind: 'separator' })
      out.push({ id: 'left', label: 'Move left', disabled: i === 0, onSelect: () => onMove(col.id, -1) })
      out.push({ id: 'right', label: 'Move right', disabled: i === visible.length - 1, onSelect: () => onMove(col.id, 1) })
    }
    return out
  }

  return (
    <div role="row" className={cx(s.header, scrolled && s.scrolled, className)}>
      {visible.map((col, i) => {
        const sorted = sortId === col.id
        const canSort = !!onSort && col.sortable !== false
        const colItems = menu ? items(col, i) : []
        const labelNode = (
          <>
            <span className={s.text}>{col.label}</span>
            {sorted ? <span className={s.arrow}>{sortDir === 'asc' ? '↑' : '↓'}</span> : null}
          </>
        )
        return (
          <div
            key={col.id}
            role="columnheader"
            aria-sort={sorted ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
            className={cx(
              s.cell,
              col.align === 'end' && s.end,
              sorted && s.sorted,
              (menuOpen === col.id || resizing === col.id) && s.engaged,
            )}
            style={{ left: col.x, width: col.width }}
          >
            {canSort ? (
              <button type="button" className={s.label} onClick={() => onSort?.(col.id)}>
                {labelNode}
              </button>
            ) : (
              <span className={s.label}>{labelNode}</span>
            )}
            <span className={cx(s.edge, s.edgeLeft)} aria-hidden />
            <span
              className={cx(s.edge, s.edgeRight, onResize && s.resizable)}
              aria-hidden
              onPointerDown={(e) => beginResize(e, col)}
              onPointerMove={moveResize}
              onPointerUp={endResize}
              onPointerCancel={endResize}
            />
            {colItems.length ? (
              <span className={s.more}>
                <MenuTrigger
                  items={colItems}
                  label={`${col.label} column`}
                  width={200}
                  align="end"
                  open={menuOpen === col.id}
                  onOpenChange={(o) => setMenuOpen(o ? col.id : null)}
                >
                  <IconButton icon="more" size={16} label={`${col.label} column options`} flag={false} />
                </MenuTrigger>
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
