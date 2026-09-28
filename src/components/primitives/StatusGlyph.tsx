import { cx } from '../../lib/cx'
import s from './StatusGlyph.module.css'

export type StatusKind = 'open' | 'exploring' | 'not-looking' | 'freelance' | 'synced' | 'offline'

const LABELS: Record<StatusKind, string> = {
  open: 'Open',
  exploring: 'Exploring',
  'not-looking': 'Not looking',
  freelance: 'Freelance',
  synced: 'Synced',
  offline: 'Offline',
}

export interface StatusGlyphProps {
  status: StatusKind
  /** Accessible name. Pass `true` to use the default label ("Open", "Synced"…); omit when a text label follows. */
  label?: string | true
  className?: string
}

/**
 * Availability shapes (§6.7), 7 × 7: open ● ok · exploring ◐ warn · not-looking ○ text-3 · freelance ■ ok.
 * Sync dot (§3), 6 × 6: synced ● ok · offline ○ 1px text-3 ring.
 */
export function StatusGlyph({ status, label, className }: StatusGlyphProps) {
  const name = label === true ? LABELS[status] : label
  const a11y = name ? { role: 'img' as const, 'aria-label': name } : { 'aria-hidden': true as const }
  const sync = status === 'synced' || status === 'offline'
  const n = sync ? 6 : 7
  const c = n / 2
  let body
  switch (status) {
    case 'open':
    case 'synced':
      body = <circle cx={c} cy={c} r={c} fill="currentColor" />
      break
    case 'exploring':
      body = (
        <>
          <circle cx={c} cy={c} r={c - 0.5} fill="none" stroke="currentColor" strokeWidth={1} />
          <path d={`M${c} 0.5A${c - 0.5} ${c - 0.5} 0 0 0 ${c} ${n - 0.5}Z`} fill="currentColor" />
        </>
      )
      break
    case 'not-looking':
    case 'offline':
      body = <circle cx={c} cy={c} r={c - 0.5} fill="none" stroke="currentColor" strokeWidth={1} />
      break
    case 'freelance':
      body = <rect x={0} y={0} width={n} height={n} fill="currentColor" />
      break
  }
  return (
    <svg
      className={cx(s.glyph, s[status], className)}
      width={n}
      height={n}
      viewBox={`0 0 ${n} ${n}`}
      focusable="false"
      data-status={status}
      {...a11y}
    >
      {body}
    </svg>
  )
}
