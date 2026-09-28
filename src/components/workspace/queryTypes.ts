// Query shapes used by QueryLine / ClausePopover. They are structurally identical to `Clause` and `Query`
// in src/data/types.ts (§13.1), so data values pass straight in and edited values come straight back.

export type ClauseKey =
  | 'role' | 'seniority' | 'region' | 'skill' | 'availability' | 'company' | 'degree' | 'keyword'
  | 'level' | 'discipline' | 'remote' | 'comp' | 'budget' | 'duration' | 'size' | 'hiring'

export interface QueryClause {
  /** 1-based clause number shown as the mono index (and the tick position + 1). */
  index: number
  key: ClauseKey
  lead?: string
  value: string
}

export interface QueryShape {
  clauses: QueryClause[]
  sort: { lead: '— by'; value: string }
}

/** One option row in the clause popover: a value with an optional mono count. */
export interface ClauseOption {
  value: string
  count?: number | string
}

/** A clause type listed by the composer. */
export interface ClauseType {
  key: ClauseKey
  /** Sentence-case name in the composer list ("Region"). */
  label: string
  /** Lead written before the value in the sentence ("in"). */
  lead?: string
  /** Plural noun for the typeahead placeholder ("regions" → "Find regions…"). */
  noun?: string
  /** Only one option can be checked at a time (a threshold such as "senior or above"). */
  single?: boolean
}

/** §6.3 composer list for People, in order. Keyword is always last and adds a "mentioning" clause. */
export const PEOPLE_CLAUSE_TYPES: readonly ClauseType[] = [
  { key: 'role', label: 'Role', noun: 'roles' },
  { key: 'seniority', label: 'Seniority', noun: 'levels', single: true },
  { key: 'region', label: 'Region', lead: 'in', noun: 'regions' },
  { key: 'skill', label: 'Skill', lead: 'with', noun: 'skills' },
  { key: 'availability', label: 'Availability', lead: 'available within', noun: 'timeframes', single: true },
  { key: 'company', label: 'Company', lead: 'at', noun: 'companies' },
  { key: 'degree', label: 'Degree', noun: 'degrees', single: true },
  { key: 'keyword', label: 'Keyword', lead: 'mentioning' },
]

/** Type metadata for keys used by other sections' queries (Jobs, Projects, Companies). */
export const EXTRA_CLAUSE_TYPES: readonly ClauseType[] = [
  { key: 'level', label: 'Level', noun: 'levels', single: true },
  { key: 'discipline', label: 'Discipline', noun: 'disciplines' },
  { key: 'remote', label: 'Location', noun: 'locations' },
  { key: 'comp', label: 'Compensation', noun: 'bands', single: true },
  { key: 'budget', label: 'Budget', noun: 'budgets', single: true },
  { key: 'duration', label: 'Duration', noun: 'durations', single: true },
  { key: 'size', label: 'Company size', noun: 'sizes', single: true },
  { key: 'hiring', label: 'Hiring', noun: 'teams' },
]

export function clauseTypeFor(key: ClauseKey, types: readonly ClauseType[] = PEOPLE_CLAUSE_TYPES): ClauseType {
  return (
    types.find((t) => t.key === key) ??
    PEOPLE_CLAUSE_TYPES.find((t) => t.key === key) ??
    EXTRA_CLAUSE_TYPES.find((t) => t.key === key) ?? { key, label: key }
  )
}

/**
 * Built-in option lists (value + mono count of matching profiles in the network) used when the caller
 * passes no `getOptions`. The People query's own values are first in each list.
 */
export const DEFAULT_CLAUSE_OPTIONS: Partial<Record<ClauseKey, readonly ClauseOption[]>> = {
  role: [
    { value: 'Product designers', count: 1284 },
    { value: 'Interaction designers', count: 386 },
    { value: 'Design engineers', count: 212 },
    { value: 'UX researchers', count: 297 },
    { value: 'Design managers', count: 164 },
    { value: 'Content designers', count: 118 },
  ],
  seniority: [
    { value: 'senior or above', count: 642 },
    { value: 'staff or above', count: 231 },
    { value: 'principal or above', count: 87 },
    { value: 'mid-level or above', count: 1036 },
  ],
  region: [
    { value: 'EMEA, UTC−1 to +3', count: 418 },
    { value: 'Europe', count: 902 },
    { value: 'Nordics', count: 96 },
    { value: 'DACH', count: 188 },
    { value: 'UK and Ireland', count: 143 },
    { value: 'Africa', count: 71 },
  ],
  skill: [
    { value: 'design systems', count: 311 },
    { value: 'design tokens', count: 124 },
    { value: 'accessibility', count: 187 },
    { value: 'prototyping (code)', count: 142 },
    { value: 'research', count: 402 },
    { value: 'motion', count: 88 },
  ],
  availability: [
    { value: '1 month', count: 38 },
    { value: '3 months', count: 61 },
    { value: '6 months', count: 104 },
    { value: '12 months', count: 162 },
  ],
  company: [
    { value: 'Plinth', count: 6 },
    { value: 'Oriel', count: 3 },
    { value: 'Halden', count: 4 },
    { value: 'Northdesk', count: 5 },
    { value: 'Ledgerline', count: 7 },
    { value: 'Quanta Labs', count: 3 },
  ],
  degree: [
    { value: '1° only', count: 214 },
    { value: '2° or closer', count: 1109 },
    { value: '3° or closer', count: 1284 },
  ],
  level: [
    { value: 'principal or staff', count: 48 },
    { value: 'senior', count: 131 },
    { value: 'lead', count: 57 },
    { value: 'head or director', count: 22 },
  ],
  discipline: [
    { value: 'product design', count: 164 },
    { value: 'design engineering', count: 31 },
    { value: 'UX research', count: 26 },
    { value: 'design leadership', count: 19 },
  ],
  remote: [
    { value: 'remote in EMEA', count: 71 },
    { value: 'remote', count: 96 },
    { value: 'hybrid', count: 83 },
    { value: 'on-site', count: 40 },
  ],
  comp: [
    { value: '€120k or more', count: 48 },
    { value: '€100k or more', count: 92 },
    { value: '€150k or more', count: 14 },
  ],
  budget: [
    { value: '€15k or more', count: 312 },
    { value: '€25k or more', count: 104 },
    { value: '€50k or more', count: 21 },
  ],
  duration: [
    { value: '4–12 weeks', count: 198 },
    { value: 'under 4 weeks', count: 87 },
    { value: '3 months or more', count: 64 },
  ],
  size: [
    { value: '50–500 people', count: 23 },
    { value: '10–50 people', count: 31 },
    { value: '500+ people', count: 12 },
  ],
  hiring: [
    { value: 'hiring designers', count: 23 },
    { value: 'hiring engineers', count: 57 },
    { value: 'hiring researchers', count: 9 },
  ],
}
