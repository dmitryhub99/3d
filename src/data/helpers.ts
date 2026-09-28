// Small pure helpers shared by the data modules (no data of their own, no imports from other data modules).

import type { Availability, AvailabilityStatus, FitVector, HueIndex, Skill } from './types'

const AVAIL_LABEL = { open: 'Open', exploring: 'Exploring', 'not-looking': 'Not looking', freelance: 'Freelance' } as const

/** Availability record from a status and its row timing ('Nov 2026', 'now', '2 d/wk', '—'). */
export function availability(status: AvailabilityStatus, timing: string): Availability {
  return { status, label: AVAIL_LABEL[status], timing }
}

/** Fit vector from a '11110' string (clause 1..5). */
export function fitOf(bits: string): FitVector {
  const b = bits.split('').map((c) => c === '1')
  return [!!b[0], !!b[1], !!b[2], !!b[3], !!b[4]]
}

/** Number of clauses met. */
export const fitCount = (fit: readonly boolean[]) => fit.filter(Boolean).length

/** '4/5' */
export const fitFraction = (fit: readonly boolean[]) => `${fitCount(fit)}/${fit.length}`

/** A matched skill (it answers a query clause: design systems). */
export const matchedSkill = (name = 'Design systems'): Skill => ({ name, matched: true })
/** An unmatched skill. */
export const skill = (name: string): Skill => ({ name, matched: false })

const FOLD: Record<string, string> = { ł: 'l', Ł: 'L', ø: 'o', Ø: 'O', ð: 'd', Ð: 'D', ı: 'i', ß: 'ss', þ: 'th', Þ: 'Th', æ: 'ae', Æ: 'Ae', œ: 'oe', đ: 'd' }

/** ASCII-fold a name: 'Sigríður Jónsdóttir' → 'Sigridur Jonsdottir'. */
export function asciiFold(s: string): string {
  return s
    .replace(/[łŁøØðÐıßþÞæÆœđ]/g, (c) => FOLD[c] ?? c)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/** kebab-case id of a name, ASCII-folded: 'Élodie Marchand' → 'elodie-marchand'. */
export function slugify(s: string): string {
  return asciiFold(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Initials of a name: first letter of the first and last words ('Ilse de Vries' → 'IV'), ASCII-folded. */
export function initialsOf(name: string): string {
  const words = asciiFold(name).split(/[\s]+/).filter(Boolean)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? words[words.length - 1]![0] ?? '' : ''
  return (first + last).toUpperCase()
}

/** Normalise any integer to a hue index 0–5. */
export const hueOf = (n: number): HueIndex => (((n % 6) + 6) % 6) as HueIndex

/** Deterministic 32-bit hash of a string (FNV-1a), for stable derived values. */
export function hash(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Group thousands with a comma: 1284 → '1,284'. */
export const formatCount = (n: number) => n.toLocaleString('en-US')
