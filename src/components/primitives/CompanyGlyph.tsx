import { cx } from '../../lib/cx'
import s from './CompanyGlyph.module.css'

export type CompanyGlyphSize = 14 | 20 | 24 | 28 | 32 | 56

export interface CompanyGlyphProps {
  /** Company name; the glyph shows its first letter. */
  name: string
  hue: number
  size?: CompanyGlyphSize
  /** Accessible name; decorative by default because the name is printed beside it. */
  label?: string
  className?: string
}

/**
 * Company initial tile (§8.7).
 *   14: 1px line-2 outline, no fill, radius 2, initial 9/10 600 text-3 (rows).
 *   20/24/28/32: hue fill, radius 4, initial 600 text-2 (notifications, Saved, tiles).
 *   56: hue fill with a 1px line-2 inner edge, initial 20/24 600 text-1 (company Peek).
 */
export function CompanyGlyph({ name, hue, size = 14, label, className }: CompanyGlyphProps) {
  const h = Math.abs(Math.trunc(hue)) % 6
  const initial = (name.trim()[0] ?? '·').toLocaleUpperCase()
  return (
    <span
      className={cx(s.glyph, s[`s${size}`], size !== 14 && s[`h${h}`], className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {initial}
    </span>
  )
}
