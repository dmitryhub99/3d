// Time helpers. The product's clock is frozen at NOW (§13): Monday 28 September 2026, 12:32 UTC.
// Data files write relative times literally; these helpers exist for derived values (§13.5).

export const NOW = new Date('2026-09-28T12:32:00Z')
export const NOW_YM = '2026-09'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const pad2 = (n: number) => String(n).padStart(2, '0')

/** 'UTC+2', 'UTC−3' (U+2212), 'UTC-3', 'UTC+5:30', or minutes → offset in minutes. */
export function parseOffset(offset: string | number): number {
  if (typeof offset === 'number') return offset * 60
  const m = /UTC\s*([+\-−])?\s*(\d{1,2})(?::(\d{2}))?/.exec(offset)
  if (!m || !m[2]) return 0
  const sign = m[1] === '-' || m[1] === '−' ? -1 : 1
  return sign * (Number(m[2]) * 60 + Number(m[3] ?? 0))
}

/** Format an offset in hours as 'UTC+2' / 'UTC−3' (with the U+2212 minus). */
export function formatOffset(hours: number): string {
  if (hours === 0) return 'UTC+0'
  return `UTC${hours < 0 ? '−' : '+'}${Math.abs(hours)}`
}

/** Local time at NOW for a UTC offset: localTime('UTC+2') → '14:32'. */
export function localTime(offset: string | number, at: Date = NOW): string {
  const t = new Date(at.getTime() + parseOffset(offset) * 60_000)
  return `${pad2(t.getUTCHours())}:${pad2(t.getUTCMinutes())}`
}

/** Compact relative time before NOW: '12s', '5m', '3h', '2d', '2w', '3mo', '1y'. */
export function relative(date: Date | string | number, now: Date = NOW): string {
  const t = date instanceof Date ? date.getTime() : new Date(date).getTime()
  const s = Math.max(0, Math.round((now.getTime() - t) / 1000))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 14) return `${d}d`
  if (d < 60) return `${Math.floor(d / 7)}w`
  if (d < 365) return `${Math.floor(d / 30)}mo`
  return `${Math.floor(d / 365)}y`
}

/** 'Mon 28 Sep' (UTC calendar day). */
export function formatDay(date: Date | string = NOW): string {
  const d = date instanceof Date ? date : new Date(date)
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
}

/** '11 Jan 2027'. */
export function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

// ---- 'YYYY-MM' month arithmetic (career strip, experience) ----

export interface YM { y: number; m: number } // m is 1–12

export function parseYM(ym: string): YM {
  const [y, m] = ym.split('-').map(Number)
  return { y: y ?? 0, m: m ?? 1 }
}

export function formatYM({ y, m }: YM): string {
  return `${y}-${pad2(m)}`
}

/** Months since year 0, for linear placement on an axis. */
export const ymIndex = (ym: string) => {
  const { y, m } = parseYM(ym)
  return y * 12 + (m - 1)
}

/** Months from a to b ('2023-08' → '2026-09' = 37). A null end means NOW. */
export function monthsBetween(from: string, to: string | null | undefined): number {
  return ymIndex(to ?? NOW_YM) - ymIndex(from)
}

/** Add months to a 'YYYY-MM' string (negative to subtract). */
export function addMonths(ym: string, months: number): string {
  const i = ymIndex(ym) + months
  return formatYM({ y: Math.floor(i / 12), m: (i % 12) + 1 })
}

/** 37 → '3y 1m', 35 → '2y 11m', 24 → '2y', 5 → '5m'. */
export function formatDuration(months: number): string {
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y && m) return `${y}y ${m}m`
  if (y) return `${y}y`
  return `${m}m`
}

/** Years label for a hanging column: ('2023-08', null) → '2023–', ('2020-04', '2023-06') → '2020–23'. */
export function yearsRange(from: string, to: string | null | undefined): string {
  const a = parseYM(from).y
  if (!to) return `${a}–`
  const b = parseYM(to).y
  if (b === a) return `${a}`
  return Math.floor(a / 100) === Math.floor(b / 100) ? `${a}–${String(b).slice(2)}` : `${a}–${b}`
}

/** 'Jan 2027' from '2027-01'. */
export function formatMonthYear(ym: string): string {
  const { y, m } = parseYM(ym)
  return `${MONTHS[m - 1]} ${y}`
}
