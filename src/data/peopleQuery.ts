// §13.3 / §6.2 / §6.3 The People segments and the saved query "Design leads · EMEA", exactly.

import type { Clause, ClauseKey, Person, Query, Segment } from './types'
import { people, extraPeople, sortByFit } from './people'
import { fitCount } from './helpers'

export const peopleSegments: Segment[] = [
  { id: 'all-people', label: 'All people', count: 1284 },
  { id: 'design-leads-emea', label: 'Design leads · EMEA', count: 22 },
  { id: 'following', label: 'Following', count: 212 },
  { id: 'warm-intros', label: 'Warm intros', count: 17 },
  { id: 'open-to-contract', label: 'Open to contract', count: 96 },
]

export const peopleQuery: Query = {
  clauses: [
    { index: 1, key: 'role', value: 'Product designers' },
    { index: 2, key: 'seniority', value: 'senior or above' },
    { index: 3, key: 'region', lead: 'in', value: 'EMEA, UTC−1 to +3' },
    { index: 4, key: 'skill', lead: 'with', value: 'design systems' },
    { index: 5, key: 'availability', lead: 'available within', value: '3 months' },
  ],
  sort: { lead: '— by', value: 'fit' },
}

/** The boot segment. It is saved and not dirty (§13.3). */
export const peopleBootSegment = 'design-leads-emea'
export const peopleQueryDirty = false

/** The segment name the inspector Fit heading uses: "Fit · Design leads · EMEA". */
export const fitSegmentLabel = 'Design leads · EMEA'

/**
 * Clause text in the inspector Fit block (§7.1), sentence case, index 1–5.
 * The row tick flag uses `clauseText(clause)` instead ("5 available within 3 months").
 */
export const peopleFitClauses = [
  'Product designer',
  'Senior or above',
  'EMEA, UTC−1 to +3',
  'Design systems',
  'Available within 3 months',
] as const

/** Lead + value: 'available within 3 months', 'Product designers'. */
export const clauseText = (c: Clause) => (c.lead ? `${c.lead} ${c.value}` : c.value)

/** Foot readout parts (§10): `22 results · 3 match all 5 · 1 selected · by fit, then years in skill · updated 2m ago`. */
export const peopleResultStats = {
  total: 22,
  matchAll: people.filter((p) => fitCount(p.fit) === 5).length, // 3
  clauses: 5,
  sortNote: 'by fit, then years in skill',
  updated: '2m ago',
  /** Loading foot (§6.11). */
  loading: 'Querying 1,284 profiles…',
} as const

/** Sort facet menu (§6.3). */
export const peopleSortOptions = [
  { id: 'fit', label: 'Fit' },
  { id: 'recently-active', label: 'Recently active' },
  { id: 'degree', label: 'Degree' },
  { id: 'tenure', label: 'Tenure in matched skill' },
] as const

/** Clause types listed by the composer (§6.3), in order. */
export const clauseTypes: { key: ClauseKey; label: string; lead?: string }[] = [
  { key: 'role', label: 'Role' },
  { key: 'seniority', label: 'Seniority' },
  { key: 'region', label: 'Region', lead: 'in' },
  { key: 'skill', label: 'Skill', lead: 'with' },
  { key: 'availability', label: 'Availability', lead: 'available within' },
  { key: 'company', label: 'Company', lead: 'at' },
  { key: 'degree', label: 'Degree', lead: 'within' },
  { key: 'keyword', label: 'Keyword', lead: 'mentioning' },
]

/** Options in each clause popover: 28px rows with checkboxes and mono counts (§6.3). */
export const clauseOptions: Partial<Record<ClauseKey, { value: string; count: number; selected: boolean }[]>> = {
  role: [
    { value: 'Product designers', count: 612, selected: true },
    { value: 'UX engineers', count: 88, selected: false },
    { value: 'Design technologists', count: 41, selected: false },
    { value: 'UX researchers', count: 97, selected: false },
    { value: 'Design managers', count: 64, selected: false },
    { value: 'Interaction designers', count: 73, selected: false },
  ],
  seniority: [
    { value: 'mid-level', count: 402, selected: false },
    { value: 'senior or above', count: 518, selected: true },
    { value: 'staff or above', count: 146, selected: false },
    { value: 'principal', count: 39, selected: false },
  ],
  region: [
    { value: 'EMEA, UTC−1 to +3', count: 431, selected: true },
    { value: 'EMEA, UTC−3 to +4', count: 502, selected: false },
    { value: 'Europe, UTC+0 to +2', count: 318, selected: false },
    { value: 'Nordics', count: 77, selected: false },
    { value: 'DACH', count: 96, selected: false },
  ],
  skill: [
    { value: 'design systems', count: 188, selected: true },
    { value: 'design tokens', count: 74, selected: false },
    { value: 'prototyping (code)', count: 121, selected: false },
    { value: 'editor / canvas UX', count: 33, selected: false },
    { value: 'accessibility', count: 142, selected: false },
    { value: 'data-dense UI', count: 58, selected: false },
  ],
  availability: [
    { value: 'now', count: 61, selected: false },
    { value: '3 months', count: 164, selected: true },
    { value: '6 months', count: 239, selected: false },
    { value: 'any time', count: 1284, selected: false },
  ],
  company: [
    { value: 'Plinth', count: 6, selected: false },
    { value: 'Oriel', count: 3, selected: false },
    { value: 'Halden', count: 4, selected: false },
    { value: 'Ledgerline', count: 7, selected: false },
    { value: 'Quanta Labs', count: 3, selected: false },
  ],
  degree: [
    { value: '1°', count: 212, selected: false },
    { value: '2° or closer', count: 684, selected: false },
    { value: 'your team', count: 9, selected: false },
  ],
}

/** "No results" relaxations (§6.11). The arrow before the count is drawn as the `arrow-right` icon. */
export const peopleRelaxations = [
  { verb: 'Drop', clauseIndex: 5, text: 'available within 3 months', count: 61 },
  { verb: 'Widen', clauseIndex: 3, text: 'to UTC−3 to +4', count: 52 },
] as const

/** Empty-state copy (§6.11). */
export const peopleEmptyCopy = {
  noResults: 'No one meets 3 of the 5 clauses.',
  /** 'Refine the query and press [mod S] to keep it.' — the key caps are a Kbd between the two runs. */
  noSegment: { before: 'Refine the query and press', keys: ['mod', 'S'], after: 'to keep it.' },
} as const

/** Row context menu (§6.9). Keys are Kbd tokens (see palette.ts `kbd`). */
export const personContextMenu = [
  { id: 'open-profile', label: 'Open full profile', keys: ['enter'] },
  { id: 'open-inspector', label: 'Open in inspector', keys: ['Space'] },
  { id: 'primary', label: 'Request intro via Jonas', keys: ['M'] },
  { id: 'attach', label: 'Attach to Staff Designer, Canvas', keys: ['P'] },
  { id: 'follow', label: 'Follow', keys: ['F'] },
  { id: 'save', label: 'Save', keys: ['S'] },
  { id: 'copy-link', label: 'Copy link', keys: ['mod', 'C'] },
  { id: 'hide', label: 'Hide from results', keys: ['backspace'] },
] as const

/** Group-by options in the Display menu (§6.2). */
export const peopleGroupBy = [
  { id: 'none', label: 'None' },
  { id: 'fit', label: 'Fit' },
  { id: 'availability', label: 'Availability' },
  { id: 'degree', label: 'Degree' },
] as const

/** Group label for a person under a Display group-by (§6.2: '5 of 5 clauses', 'Open', '2°'). */
export function groupLabel(groupBy: 'fit' | 'availability' | 'degree', p: Person): string {
  if (groupBy === 'fit') return `${fitCount(p.fit)} of 5 clauses`
  if (groupBy === 'availability') return p.availability.label
  return p.degree === 'team' ? 'Team' : `${p.degree}°`
}

/**
 * Rows loaded for each People segment. The strip counts are totals across the network; these are the rows
 * the mock has. Design leads · EMEA is exactly the 22 results in §13.4 order.
 */
export function peopleForSegment(segmentId: string): Person[] {
  const everyone = [...people, ...extraPeople]
  switch (segmentId) {
    case 'all-people':
      return sortByFit(everyone)
    case 'following':
      return sortByFit(everyone.filter((p) => p.following || p.degree === 1 || p.degree === 'team'))
    case 'warm-intros':
      return sortByFit(everyone.filter((p) => p.degree === 2 && !!p.introVia))
    case 'open-to-contract':
      return sortByFit(
        everyone.filter((p) => p.availability.status === 'freelance' || ['maren-aaltonen', 'aurelien-duclos', 'kristjan-tamm', 'giulia-romano', 'samir-benali', 'lucia-ferrer'].includes(p.id)),
      )
    case 'design-leads-emea':
    default:
      return people
  }
}
