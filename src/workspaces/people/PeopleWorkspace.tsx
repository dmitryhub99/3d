import { useCallback, useMemo, useState, useSyncExternalStore, type MouseEvent } from 'react'
import { LayoutGroup } from 'motion/react'
import { SegmentStrip } from '../../components/workspace/SegmentStrip'
import { QueryLine } from '../../components/workspace/QueryLine'
import { ColumnHeader } from '../../components/workspace/ColumnHeader'
import { Segmented } from '../../components/primitives/Segmented'
import { MenuTrigger, Menu, type OverlayAnchor } from '../../components/primitives/Menu'
import { TextButton } from '../../components/primitives/TextButton'
import type { Clause, Person, Query } from '../../data/types'
import { clauseText, peopleForSegment, peopleGroupBy, groupLabel, peopleQuery, peopleSegments, personContextMenu } from '../../data/peopleQuery'
import { useApp, useDispatch } from '../../state/store'
import { useLayout } from '../../state/useLayout'
import { useRegisterScrollContainer } from '../../shell/scroll'
import { peopleColumns } from './columns'
import { PersonRow } from './PersonRow'
import { toggleFollow, toggleSaved } from './relations'
import s from './PeopleWorkspace.module.css'

// Clause key → position in each person's precomputed fit vector (§6.3 clauses 1–5).
const FIT_INDEX: Partial<Record<Clause['key'], number>> = { role: 0, seniority: 1, region: 2, skill: 3, availability: 4 }

export interface Evaluated {
  person: Person
  fit: boolean[]
}

/** Soft clauses: a person is a result when they meet at least 3 clauses (or all, when fewer than 3 exist). */
export function evaluate(list: Person[], query: Query): Evaluated[] {
  const need = Math.min(3, query.clauses.length)
  const rows = list.map((person) => ({
    person,
    fit: query.clauses.map((c) => {
      const i = FIT_INDEX[c.key]
      return i === undefined ? false : person.fit[i]
    }),
  }))
  return rows
    .filter((r) => r.fit.filter(Boolean).length >= need)
    .map((r, order) => ({ ...r, order }))
    .sort((a, b) => b.fit.filter(Boolean).length - a.fit.filter(Boolean).length || a.order - b.order)
}

const VIEWS = [
  { id: 'table', icon: 'view-table', label: 'Table', key: '1' },
  { id: 'compact', icon: 'view-compact', label: 'Compact', key: '2' },
  { id: 'gallery', icon: 'view-gallery', label: 'Gallery', key: '3' },
] as const

type GroupBy = (typeof peopleGroupBy)[number]['id']

export function usePeopleResults() {
  const segment = useApp((st) => st.segment.people)
  const query = usePeopleQuery()
  return useMemo(() => evaluate(peopleForSegment(segment), query), [segment, query])
}

// The query lives outside React state so the foot, the inspector and the rows share it.
let currentQuery: Query = peopleQuery
const queryListeners = new Set<() => void>()
export const getPeopleQuery = () => currentQuery
export function setPeopleQuery(q: Query) {
  currentQuery = q
  queryListeners.forEach((l) => l())
}
const subscribeQuery = (l: () => void) => {
  queryListeners.add(l)
  return () => {
    queryListeners.delete(l)
  }
}
export function usePeopleQuery(): Query {
  return useSyncExternalStore(subscribeQuery, () => currentQuery)
}

export function PeopleWorkspace() {
  const dispatch = useDispatch()
  const segment = useApp((st) => st.segment.people)
  const view = useApp((st) => st.view.people)
  const selection = useApp((st) => st.selection.people)
  const inspectorOpen = useApp((st) => st.inspectorOpen.people)
  const checked = useApp((st) => st.checked.people)
  const layout = useLayout('people')
  const registerRows = useRegisterScrollContainer()
  const query = usePeopleQuery()
  const results = usePeopleResults()
  const [scrolled, setScrolled] = useState(false)
  const [groupBy, setGroupBy] = useState<GroupBy>('none')
  const [menu, setMenu] = useState<{ id: string; anchor: OverlayAnchor } | null>(null)

  const cols = useMemo(() => peopleColumns(layout.workspaceW), [layout.workspaceW])
  const clauseLabels = useMemo(() => query.clauses.map(clauseText), [query])
  const dirty = query !== peopleQuery

  const onSelect = useCallback((id: string) => dispatch({ type: 'select', section: 'people', id, via: 'click' }), [dispatch])
  const onCheck = useCallback((id: string) => dispatch({ type: 'toggleCheck', id }), [dispatch])
  const onContextMenu = useCallback((id: string, e: MouseEvent) => setMenu({ id, anchor: { x: e.clientX, y: e.clientY } }), [])

  const groups = useMemo(() => {
    if (groupBy === 'none') return [{ label: null as string | null, rows: results }]
    const map = new Map<string, Evaluated[]>()
    for (const r of results) {
      const key = groupLabel(groupBy, r.person)
      map.set(key, [...(map.get(key) ?? []), r])
    }
    return [...map].map(([label, rows]) => ({ label, rows }))
  }, [results, groupBy])

  let index = 0

  return (
    <div className={s.workspace}>
      <SegmentStrip
        segments={peopleSegments}
        value={segment}
        onChange={(id) => dispatch({ type: 'setSegment', section: 'people', segmentId: id })}
        onAdd={() => {}}
        onSegmentAction={() => {}}
        right={
          <>
            <Segmented
              options={VIEWS as unknown as { id: string; icon: 'view-table'; label: string; key: string }[]}
              value={view}
              onChange={(v) => dispatch({ type: 'setView', view: v as 'table' })}
            />
            <MenuTrigger
              width={240}
              align="end"
              items={[
                { kind: 'group', label: 'Group by' },
                ...peopleGroupBy.map((g) => ({
                  id: `group-${g.id}`,
                  label: g.label,
                  selected: groupBy === g.id,
                  onSelect: () => setGroupBy(g.id),
                })),
                { kind: 'separator' },
                { kind: 'group', label: 'Columns' },
                ...['Company', 'Skills', 'Availability', 'Relation'].map((c) => ({ id: `col-${c}`, label: c, checked: true })),
              ]}
            >
              <TextButton icon="display">Display</TextButton>
            </MenuTrigger>
          </>
        }
      />

      <QueryLine query={query} onChange={setPeopleQuery} dirty={dirty} onRevert={() => setPeopleQuery(peopleQuery)} onSave={() => setPeopleQuery(peopleQuery)} />

      <ColumnHeader columns={cols.header} sort="fit" scrolled={scrolled} />

      <div
        ref={registerRows}
        className={s.rows}
        role="grid"
        aria-label="People"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
      >
        {results.length === 0 ? (
          <div className={s.empty}>
            <p className={s.emptyTitle}>No one meets 3 of the {query.clauses.length} clauses.</p>
            <button className={s.relax} onClick={() => setPeopleQuery(peopleQuery)}>
              Revert to the saved query
            </button>
          </div>
        ) : (
          <LayoutGroup id="people-rows">
            {groups.map((g, gi) => (
              <div key={g.label ?? 'all'} role="rowgroup">
                {g.label && (
                  <div className={s.groupHeader} data-first={gi === 0 || undefined}>
                    <span>{g.label}</span>
                    <span className={s.groupCount}>{g.rows.length}</span>
                  </div>
                )}
                {g.rows.map((r) => {
                  const i = index++
                  return (
                    <PersonRow
                      key={r.person.id}
                      person={r.person}
                      index={i}
                      fit={r.fit}
                      clauseLabels={clauseLabels}
                      selected={selection === r.person.id}
                      seam={inspectorOpen}
                      checked={checked.includes(r.person.id)}
                      showCheckbox={checked.length > 0}
                      cols={cols}
                      onSelect={onSelect}
                      onCheck={onCheck}
                      onContextMenu={onContextMenu}
                    />
                  )
                })}
              </div>
            ))}
          </LayoutGroup>
        )}
      </div>

      <Menu
        open={!!menu}
        anchor={menu?.anchor ?? null}
        onClose={() => setMenu(null)}
        items={personContextMenu.map((it) => ({
          id: it.id,
          label: it.label,
          keys: it.keys.map((k) => (k === 'mod' ? '⌘' : k === 'enter' ? '↵' : k === 'backspace' ? '⌫' : k)),
          onSelect: () => {
            if (!menu) return
            if (it.id === 'follow') toggleFollow(menu.id)
            if (it.id === 'save') toggleSaved(menu.id)
            if (it.id === 'open-inspector') dispatch({ type: 'select', section: 'people', id: menu.id, via: 'peek' })
          },
        }))}
      />
    </div>
  )
}
