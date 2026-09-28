import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { panel, snap } from '../../lib/motion'
import { cx } from '../../lib/cx'
import { Icon } from '../icons/Icon'
import { MenuTrigger, type MenuItem } from '../primitives/Menu'
import { TextButton } from '../primitives/TextButton'
import { isOverlayOpen, isTypingTarget } from '../primitives/overlayKit'
import { ClausePopover } from './ClausePopover'
import { useQueryHover } from './queryHover'
import { PEOPLE_CLAUSE_TYPES, type ClauseKey, type ClauseOption, type ClauseType, type QueryClause, type QueryShape } from './queryTypes'
import s from './QueryLine.module.css'

export { QueryHoverContext, QueryHoverProvider, useQueryHover } from './queryHover'
export type { QueryHoverSource, QueryHoverValue } from './queryHover'
export type { ClauseKey, ClauseOption, ClauseType, QueryClause, QueryShape } from './queryTypes'

/** §6.3 People sort facet options. */
export const PEOPLE_SORT_OPTIONS = ['Fit', 'Recently active', 'Degree', 'Tenure in matched skill'] as const

export interface QueryLineProps {
  query: QueryShape
  onChange: (query: QueryShape) => void
  /** Shows `Revert` and `Save segment ⌘S` right-aligned (§6.3 dirty state). */
  dirty?: boolean
  onRevert?: () => void
  onSave?: () => void
  /** Sort facet menu, sentence case (default People: Fit, Recently active, Degree, Tenure in matched skill). */
  sortOptions?: readonly string[]
  /** Composer list (default People types). */
  clauseTypes?: readonly ClauseType[]
  /** Option rows per clause key (default DEFAULT_CLAUSE_OPTIONS). */
  getOptions?: (key: ClauseKey, clause?: QueryClause) => readonly ClauseOption[]
  /** Listen for `/` (composer) and `⌘S` (save while dirty) on the window. Default true. */
  hotkeys?: boolean
  className?: string
}

const LINE = 24 // 18px line + 6px row gap
const BASE_H = 40

const reindex = (clauses: QueryClause[]) => clauses.map((c, i) => (c.index === i + 1 ? c : { ...c, index: i + 1 }))

/**
 * The query sentence (§6.3): search glyph at the content edge, numbered clauses 16px apart (mono index raised 4px,
 * lead text-3, value 500 text-1), the unnumbered "— by fit" sort facet, and "+ Clause". Hovering a clause draws a
 * dotted underline 3px under its value and publishes its position through QueryHoverContext. Wraps to 64 with `panel`.
 */
export function QueryLine({
  query,
  onChange,
  dirty = false,
  onRevert,
  onSave,
  sortOptions = PEOPLE_SORT_OPTIONS,
  clauseTypes = PEOPLE_CLAUSE_TYPES,
  getOptions,
  hotkeys = true,
  className,
}: QueryLineProps) {
  const hover = useQueryHover()
  const sentenceRef = useRef<HTMLDivElement>(null)
  const addRef = useRef<HTMLButtonElement>(null)
  const clauseRefs = useRef(new Map<number, HTMLButtonElement>())
  const [lines, setLines] = useState(1)
  const [editing, setEditing] = useState<number | 'compose' | null>(null)
  const queryRef = useRef(query)
  queryRef.current = query

  // Band height follows the number of wrapped lines: 40, 64, …
  useLayoutEffect(() => {
    const el = sentenceRef.current
    if (!el) return
    const measure = () => setLines(Math.max(1, Math.round((el.offsetHeight + 6) / LINE)))
    measure()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(el)
    return () => ro?.disconnect()
  }, [])

  // `/` opens the composer; ⌘S saves the segment while dirty.
  useEffect(() => {
    if (!hotkeys) return
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 's') {
        if (dirty && onSave) {
          e.preventDefault()
          onSave()
        }
        return
      }
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
      if (isTypingTarget(e.target) || isOverlayOpen()) return
      e.preventDefault()
      setEditing('compose')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hotkeys, dirty, onSave])

  const commit = (c: QueryClause) => {
    const q = queryRef.current
    const exists = q.clauses.some((x) => x.index === c.index)
    const clauses = exists ? q.clauses.map((x) => (x.index === c.index ? c : x)) : [...q.clauses, c]
    onChange({ ...q, clauses: reindex(clauses) })
  }

  const remove = (c: QueryClause) => {
    const q = queryRef.current
    onChange({ ...q, clauses: reindex(q.clauses.filter((x) => x.index !== c.index)) })
    hover.setHovered(null)
  }

  const removeLast = () => {
    const q = queryRef.current
    if (!q.clauses.length) return
    onChange({ ...q, clauses: q.clauses.slice(0, -1) })
  }

  const sortItems: MenuItem[] = sortOptions.map((label) => ({
    id: label,
    label,
    selected: label.toLocaleLowerCase() === query.sort.value.toLocaleLowerCase(),
    onSelect: () => onChange({ ...queryRef.current, sort: { ...queryRef.current.sort, value: label.toLocaleLowerCase() } }),
  }))

  const editingClause = typeof editing === 'number' ? query.clauses.find((c) => c.index === editing) : undefined
  const anchor =
    editing === 'compose' ? addRef.current : editing != null ? (clauseRefs.current.get(editing) ?? null) : null

  return (
    <>
      <motion.div
        className={cx(s.band, className)}
        initial={false}
        animate={{ height: BASE_H + (lines - 1) * LINE }}
        transition={panel}
      >
        <Icon name="search" size={14} className={s.search} />
        <div ref={sentenceRef} className={s.sentence} role="group" aria-label="Query">
          {query.clauses.map((c, i) => {
            const lit = hover.hovered === i || editing === c.index
            return (
              <motion.button
                key={`${c.key}:${c.value}:${i}`}
                ref={(el: HTMLButtonElement | null) => {
                  if (el) clauseRefs.current.set(c.index, el)
                  else clauseRefs.current.delete(c.index)
                }}
                layout="position"
                initial={false}
                transition={snap}
                type="button"
                className={cx(s.clause, lit && s.lit)}
                aria-haspopup="dialog"
                aria-expanded={editing === c.index}
                aria-label={`Clause ${c.index}: ${c.lead ? `${c.lead} ` : ''}${c.value}`}
                onMouseEnter={() => hover.setHovered(i, 'clause')}
                onMouseLeave={() => hover.setHovered(null)}
                onFocus={() => hover.setHovered(i, 'clause')}
                onBlur={() => hover.setHovered(null)}
                onClick={() => setEditing(editing === c.index ? null : c.index)}
              >
                <span className={s.index} aria-hidden>
                  {c.index}
                </span>
                {c.lead ? <span className={s.lead}>{c.lead}</span> : null}
                <span className={s.value}>{c.value}</span>
              </motion.button>
            )
          })}
          <MenuTrigger items={sortItems} label="Sort by" width={220}>
            <motion.button layout="position" initial={false} transition={snap} type="button" className={s.sort}>
              <span className={s.lead}>{query.sort.lead}</span>
              <span className={s.value}>{query.sort.value}</span>
            </motion.button>
          </MenuTrigger>
          <motion.button
            ref={addRef}
            layout="position"
            initial={false}
            transition={snap}
            type="button"
            className={cx(s.add, editing === 'compose' && s.addOpen)}
            aria-haspopup="dialog"
            aria-expanded={editing === 'compose'}
            aria-keyshortcuts="/"
            onClick={() => setEditing(editing === 'compose' ? null : 'compose')}
          >
            <Icon name="plus" size={12} />
            <span>Clause</span>
          </motion.button>
        </div>
        {dirty ? (
          <div className={s.dirty}>
            <TextButton variant="quiet" onClick={onRevert}>
              Revert
            </TextButton>
            <TextButton variant="strong" keys={['⌘', 'S']} onClick={onSave}>
              Save segment
            </TextButton>
          </div>
        ) : null}
      </motion.div>
      <ClausePopover
        open={editing !== null && (editing === 'compose' || !!editingClause)}
        anchor={anchor}
        clause={editingClause}
        nextIndex={query.clauses.length + 1}
        getOptions={getOptions}
        clauseTypes={clauseTypes}
        onCommit={commit}
        onRemove={remove}
        onRemoveLast={removeLast}
        onClose={() => setEditing(null)}
        ignore={[anchor instanceof Element ? anchor : null]}
      />
    </>
  )
}
