import { cx } from '../../lib/cx'
import s from './SkillToken.module.css'

export interface SkillTokenProps {
  name: string
  /** Matches a query clause: text-1 plus a 4 × 4 text-1 square prefix (6px gap). */
  matched?: boolean
  /** Years of use, mono 11 text-3; pushed to the right edge when `block`. */
  years?: number | string
  /** 13 (13/18, row line 1) or 12 (12/16, row line 2 / lists). Default 13. */
  size?: 12 | 13
  /** Show the matched square (default: equal to `matched`). Rows pass false: they signal a match by color only. */
  mark?: boolean
  /** Color override (row line 2 uses text-3). Default: text-1 when matched, else text-2. */
  tone?: 'text-1' | 'text-2' | 'text-3'
  /** Fill the container width, years right-aligned (inspector skill columns). */
  block?: boolean
  className?: string
}

/** A skill as text, never a pill (§12.5). */
export function SkillToken({ name, matched = false, years, size = 13, mark, tone, block = false, className }: SkillTokenProps) {
  const showMark = mark ?? matched
  const color = tone ?? (matched ? 'text-1' : 'text-2')
  return (
    <span className={cx(s.token, s[`s${size}`], s[color], block && s.block, className)}>
      {showMark ? <span className={s.mark} aria-hidden /> : null}
      <span className={s.name}>{name}</span>
      {matched ? <span className="sr-only"> (matches the query)</span> : null}
      {years != null && years !== '' ? (
        <span className={s.years}>{typeof years === 'number' ? `${years}y` : years}</span>
      ) : null}
    </span>
  )
}
