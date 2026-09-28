import { cx } from '../../lib/cx'
import s from './Monogram.module.css'

export type MonogramSize = 20 | 24 | 28 | 56 | 64
export type Hue = 0 | 1 | 2 | 3 | 4 | 5

export interface MonogramProps {
  initials: string
  hue: Hue | number
  size?: MonogramSize
  /** Org badge letter (acting-as, §3): a 12 × 12 hue-3 tile at the bottom right with a 2px frame ring. */
  badge?: string
  /** Initials color override. Default: text-2 below 56, text-1 at 56 and above. The rail account uses 'text-1'. */
  tone?: 'text-1' | 'text-2'
  /** Accessible name; without it the tile is decorative (the name is always printed next to it). */
  label?: string
  className?: string
}

/** Square initials tile (D15): radius 4, muted hue fill, 1px line-2 inner edge at 56 and above. */
export function Monogram({ initials, hue, size = 28, badge, tone, label, className }: MonogramProps) {
  const h = ((Math.abs(Math.trunc(hue)) % 6) as Hue)
  return (
    <span
      className={cx(s.mono, s[`s${size}`], s[`h${h}`], tone === 'text-1' && s.t1, tone === 'text-2' && s.t2, className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {initials}
      {badge ? <span className={s.badge}>{badge}</span> : null}
    </span>
  )
}
