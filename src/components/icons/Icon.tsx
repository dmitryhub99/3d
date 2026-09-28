import type { CSSProperties } from 'react'
import { cx } from '../../lib/cx'
import { ICONS, type Glyph, type IconName, type Shape } from './paths'
import s from './Icon.module.css'

export type { IconName } from './paths'
export { ICONS, ICON_NAMES } from './paths'

export type IconSize = 10 | 12 | 14 | 16

/** Stroke width in screen px per render size (§8.6: 1.5 at 16, 1.25 at 12; key-cap glyphs 1.2 at 10). */
const STROKE: Record<IconSize, number> = { 10: 1.2, 12: 1.25, 14: 1.4, 16: 1.5 }

export interface IconProps {
  name: IconName
  size?: IconSize
  /** Filled variant: `saved`/`save` (saved state) and `panel-right` (inspector open). */
  filled?: boolean
  className?: string
  style?: CSSProperties
  /** Accessible name. Without it the icon is decorative (aria-hidden). */
  label?: string
}

function renderShape(shape: Shape, i: number, sw: number) {
  const paint = shape.paint ?? 'stroke'
  const common = {
    vectorEffect: 'non-scaling-stroke' as const,
    strokeWidth: paint === 'fill' ? undefined : sw,
    stroke: paint === 'fill' ? 'none' : undefined,
    fill: paint === 'stroke' ? undefined : 'currentColor',
  }
  if ('rect' in shape) {
    const [x, y, w, h] = shape.rect
    return <rect key={i} x={x} y={y} width={w} height={h} {...common} />
  }
  return <path key={i} d={shape.d} {...common} />
}

export function Icon({ name, size = 16, filled = false, className, style, label }: IconProps) {
  const g: Glyph = ICONS[name]
  const grid = g.grid ?? 16
  const sw = STROKE[size]
  const shapes = filled && g.filled ? [...g.shapes, ...g.filled] : g.shapes
  const body = shapes.map((sh, i) => renderShape(sh, i, sw))
  return (
    <svg
      className={cx(s.icon, className)}
      style={style}
      width={size}
      height={size}
      viewBox={`0 0 ${grid} ${grid}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      focusable="false"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-icon={name}
    >
      {g.rotate ? <g transform={`rotate(${g.rotate} ${grid / 2} ${grid / 2})`}>{body}</g> : body}
    </svg>
  )
}
