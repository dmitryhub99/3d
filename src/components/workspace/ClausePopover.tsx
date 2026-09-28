import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { cx } from '../../lib/cx'
import { Icon } from '../icons/Icon'
import { Checkbox } from '../primitives/Checkbox'
import { Kbd } from '../primitives/Kbd'
import { Popover, type OverlayAnchor } from '../primitives/Menu'
import {
  DEFAULT_CLAUSE_OPTIONS,
  PEOPLE_CLAUSE_TYPES,
  clauseTypeFor,
  type ClauseKey,
  type ClauseOption,
  type ClauseType,
  type QueryClause,
} from './queryTypes'
import s from './ClausePopover.module.css'

export interface ClausePopoverProps {
  open: boolean
  /** The clause button (edit) or the "+ Clause" button (composer). The popover opens 8px below it. */
  anchor: OverlayAnchor | null
  /** The clause being edited. Omit to open the composer. */
  clause?: QueryClause
  /** Index a composed clause receives (clauses.length + 1). */
  nextIndex: number
  /** Option rows for a clause key. Default: DEFAULT_CLAUSE_OPTIONS. */
  getOptions?: (key: ClauseKey, clause?: QueryClause) => readonly ClauseOption[]
  /** Composer list (default PEOPLE_CLAUSE_TYPES; Keyword should be last). */
  clauseTypes?: readonly ClauseType[]
  /** Live commit: an edited clause (same index) or a new one (index = nextIndex, append it). */
  onCommit: (clause: QueryClause) => void
  /** Remove the edited clause ("Remove clause ⌫", ⌫ in an empty input, or closing with nothing checked). */
  onRemove: (clause: QueryClause) => void
  /** ⌫ in an empty composer removes the last clause. */
  onRemoveLast?: () => void
  onClose: () => void
  /** Elements whose press is not "outside" (the anchor). */
  ignore?: readonly (Element | null | undefined)[]
}

type Mode = { kind: 'compose' } | { kind: 'edit'; type: ClauseType; clause: QueryClause; isNew: boolean }

type Row =
  | { kind: 'option'; option: ClauseOption; checked: boolean }
  | { kind: 'type'; type: ClauseType }
  | { kind: 'keyword'; text: string }
  | { kind: 'remove' }

const fmt = (c: number | string) => (typeof c === 'number' ? c.toLocaleString('en-US') : c)
const norm = (v: string) => v.toLocaleLowerCase()

/** Which options a stored value selects: every option whose value appears in it (longest first). */
function selectedFrom(value: string, options: readonly ClauseOption[]): string[] {
  const v = norm(value)
  const exact = options.find((o) => norm(o.value) === v)
  if (exact) return [exact.value]
  const hits: string[] = []
  let rest = v
  for (const o of [...options].sort((a, b) => b.value.length - a.value.length)) {
    const ov = norm(o.value)
    if (rest.includes(ov)) {
      hits.push(o.value)
      rest = rest.replace(ov, '')
    }
  }
  return hits
}

/** "a", "a or b", "a, b or c". */
function joinValues(values: string[]): string {
  if (values.length <= 1) return values[0] ?? ''
  return `${values.slice(0, -1).join(', ')} or ${values[values.length - 1]}`
}

/**
 * Clause editor / composer (§6.3): 280 wide, `overlay`, 1px line-2, radius 6, 8px below its anchor.
 * A sunken 28h typeahead, 28px option rows with checkboxes and mono counts, then "Remove clause ⌫".
 * The composer lists clause types; the last row is always `Keyword: "…"`. Typed text is never parsed.
 */
export function ClausePopover({
  open,
  anchor,
  clause,
  nextIndex,
  getOptions,
  clauseTypes = PEOPLE_CLAUSE_TYPES,
  onCommit,
  onRemove,
  onRemoveLast,
  onClose,
  ignore,
}: ClausePopoverProps) {
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<Mode>({ kind: 'compose' })
  const [text, setText] = useState('')
  const [hl, setHl] = useState(0)
  const [extra, setExtra] = useState<ClauseOption | null>(null)
  const [checked, setChecked] = useState<string[]>([])

  const optionsFor = (key: ClauseKey, c?: QueryClause): readonly ClauseOption[] =>
    (getOptions ? getOptions(key, c) : DEFAULT_CLAUSE_OPTIONS[key]) ?? []

  const beginEdit = (type: ClauseType, c: QueryClause, isNew: boolean) => {
    const opts = type.key === 'keyword' ? [] : optionsFor(type.key, c)
    const sel = isNew ? [] : selectedFrom(c.value, opts)
    const ext = !isNew && type.key !== 'keyword' && sel.length === 0 && c.value ? { value: c.value } : null
    setExtra(ext)
    setChecked(ext ? [ext.value] : sel)
    setMode({ kind: 'edit', type, clause: c, isNew })
    setText(type.key === 'keyword' && !isNew ? c.value : '')
    setHl(0)
  }

  // Reset every time the popover opens (or switches target).
  useLayoutEffect(() => {
    if (!open) return
    if (clause) beginEdit(clauseTypeFor(clause.key, clauseTypes), clause, false)
    else {
      setMode({ kind: 'compose' })
      setText('')
      setHl(0)
      setExtra(null)
      setChecked([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, clause?.index, clause?.key])

  const options = useMemo<ClauseOption[]>(() => {
    if (mode.kind !== 'edit' || mode.type.key === 'keyword') return []
    const base = optionsFor(mode.type.key, mode.isNew ? undefined : mode.clause)
    return extra ? [extra, ...base] : [...base]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, extra, getOptions])

  const rows = useMemo<Row[]>(() => {
    const q = norm(text.trim())
    if (mode.kind === 'compose') {
      const types = clauseTypes.filter((t) => t.key !== 'keyword' && (!q || norm(t.label).includes(q)))
      return [...types.map((t): Row => ({ kind: 'type', type: t })), { kind: 'keyword', text: text.trim() }]
    }
    if (mode.type.key === 'keyword') {
      const r: Row[] = [{ kind: 'keyword', text: text.trim() }]
      if (!mode.isNew) r.push({ kind: 'remove' })
      return r
    }
    const r: Row[] = options
      .filter((o) => !q || norm(o.value).includes(q))
      .map((o) => ({ kind: 'option', option: o, checked: checked.includes(o.value) }))
    if (!mode.isNew) r.push({ kind: 'remove' })
    return r
  }, [mode, text, options, checked, clauseTypes])

  useEffect(() => {
    setHl((h) => Math.min(Math.max(h, 0), Math.max(rows.length - 1, 0)))
  }, [rows.length])

  const current = mode.kind === 'edit' ? mode.clause : null

  const close = () => {
    if (mode.kind === 'edit' && !mode.isNew && mode.type.key !== 'keyword' && checked.length === 0) {
      onRemove(mode.clause)
    }
    onClose()
  }

  const toggle = (value: string) => {
    if (mode.kind !== 'edit') return
    let next: string[]
    if (checked.includes(value)) next = checked.filter((v) => v !== value)
    else next = mode.type.single ? [value] : [...checked, value]
    // keep option order
    next = options.map((o) => o.value).filter((v) => next.includes(v))
    setChecked(next)
    if (next.length === 0) return
    const updated: QueryClause = { ...mode.clause, value: joinValues(next) }
    setMode({ ...mode, clause: updated, isNew: false })
    onCommit(updated)
  }

  const commitKeyword = (kw: string) => {
    if (!kw) return
    if (mode.kind === 'edit' && mode.type.key === 'keyword') {
      onCommit({ ...mode.clause, value: kw })
    } else {
      onCommit({ index: nextIndex, key: 'keyword', lead: 'mentioning', value: kw })
    }
    onClose()
  }

  const choose = (i: number) => {
    const row = rows[i]
    if (!row) return
    switch (row.kind) {
      case 'type': {
        const c: QueryClause = { index: nextIndex, key: row.type.key, value: '' }
        if (row.type.lead) c.lead = row.type.lead
        beginEdit(row.type, c, true)
        inputRef.current?.focus()
        return
      }
      case 'keyword':
        commitKeyword(row.text)
        return
      case 'option':
        toggle(row.option.value)
        return
      case 'remove':
        if (current) onRemove(current)
        onClose()
        return
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHl((h) => (h + 1) % Math.max(rows.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHl((h) => (h - 1 + rows.length) % Math.max(rows.length, 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(hl)
    } else if (e.key === 'Backspace' && text === '') {
      e.preventDefault()
      if (mode.kind === 'compose') onRemoveLast?.()
      else if (!mode.isNew) {
        onRemove(mode.clause)
        onClose()
      } else {
        setMode({ kind: 'compose' })
        setHl(0)
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      close()
    }
  }

  const placeholder =
    mode.kind === 'compose'
      ? 'Add a clause…'
      : mode.type.key === 'keyword'
        ? 'Keyword…'
        : `Find ${mode.type.noun ?? norm(mode.type.label)}…`

  const optId = (i: number) => `${listId}-${i}`
  const firstRemove = rows.findIndex((r) => r.kind === 'remove')

  return (
    <Popover
      open={open}
      anchor={anchor}
      onClose={() => close()}
      side="bottom"
      align="start"
      offset={8}
      width={280}
      role="dialog"
      ariaLabel={mode.kind === 'compose' ? 'Add clause' : `Edit clause ${mode.clause.index}`}
      initialFocus="auto"
      ignore={ignore}
    >
      <div className={s.field}>
        <Icon name="search" size={12} className={s.fieldIcon} />
        <input
          ref={inputRef}
          data-autofocus
          className={s.input}
          value={text}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          role="combobox"
          aria-expanded
          aria-controls={listId}
          aria-activedescendant={rows.length ? optId(hl) : undefined}
          onChange={(e) => {
            setText(e.currentTarget.value)
            setHl(0)
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      <div id={listId} role="listbox" aria-label={mode.kind === 'compose' ? 'Clause types' : 'Options'} className={s.list}>
        {rows.map((row, i) => {
          const common = {
            id: optId(i),
            'data-highlighted': hl === i || undefined,
            onMouseMove: () => hl !== i && setHl(i),
            onMouseDown: (e: React.MouseEvent) => e.preventDefault(),
            onClick: () => choose(i),
          }
          if (row.kind === 'remove') {
            return (
              <div key="remove" className={s.removeWrap}>
                {i === firstRemove ? <div className={s.separator} role="separator" /> : null}
                <div role="option" aria-selected={hl === i} className={cx(s.row, s.remove)} {...common}>
                  <span className={s.rowLabel}>Remove clause</span>
                  <Kbd keys={['⌫']} />
                </div>
              </div>
            )
          }
          if (row.kind === 'option') {
            return (
              <div key={row.option.value} role="option" aria-selected={row.checked} className={s.row} {...common}>
                <Checkbox presentational checked={row.checked} />
                <span className={s.rowLabel}>{row.option.value}</span>
                {row.option.count != null ? <span className={s.count}>{fmt(row.option.count)}</span> : null}
              </div>
            )
          }
          if (row.kind === 'type') {
            return (
              <div key={row.type.key} role="option" aria-selected={hl === i} className={s.row} {...common}>
                <span className={s.rowLabel}>{row.type.label}</span>
              </div>
            )
          }
          return (
            <div
              key="keyword"
              role="option"
              aria-selected={hl === i}
              aria-disabled={!row.text || undefined}
              className={cx(s.row, !row.text && s.pending)}
              {...common}
            >
              <span className={s.rowLabel}>
                Keyword: <span className={s.quote}>"{row.text || '…'}"</span>
              </span>
              {row.text ? <Kbd keys={['↵']} /> : null}
            </div>
          )
        })}
        {mode.kind === 'edit' && mode.type.key !== 'keyword' && rows.every((r) => r.kind === 'remove') ? (
          <div className={s.empty}>No options match "{text}"</div>
        ) : null}
      </div>
    </Popover>
  )
}
