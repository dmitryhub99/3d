import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from '../../lib/cx'
import { Icon, type IconName, type IconSize } from '../icons/Icon'
import { Flag, type FlagSide } from './Flag'
import s from './IconButton.module.css'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName
  /** Accessible name, and the flag label unless `flag` overrides it. */
  label: string
  /** Key caps shown in the flag, e.g. ['F'] or ['⌘','['] */
  keys?: readonly string[] | string
  /** 16 (strip `+` / `⋯`), 24 (ghost, default) or 32 (bordered, inspector). */
  size?: 16 | 24 | 32
  /** 1px line-2 border (the 32 × 32 inspector buttons). */
  bordered?: boolean
  /** Toggle state: `active` fill, text-1 icon, aria-pressed. */
  pressed?: boolean
  /** Render the icon's filled variant (save → saved, panel-right → open). */
  filled?: boolean
  /** Icon size override. Defaults: 12 in a 16 button, 16 otherwise. */
  iconSize?: IconSize
  /** Flag text override, or `false` for no flag. */
  flag?: ReactNode | false
  flagSide?: FlagSide
  /** Icon tone at rest: 'text-3' (default) or 'text-1' (a state that is on, e.g. saved). */
  tone?: 'text-3' | 'text-2' | 'text-1'
  ref?: Ref<HTMLButtonElement>
}

/** Ghost 24 × 24 or bordered 32 × 32 icon button (§8.7). Rest: text-3 icon. Hover: `hover` fill, text-1 icon. */
export function IconButton({
  icon,
  label,
  keys,
  size = 24,
  bordered = false,
  pressed,
  filled,
  iconSize,
  flag,
  flagSide = 'bottom',
  tone = 'text-3',
  className,
  type = 'button',
  ref,
  ...rest
}: IconButtonProps) {
  const btn = (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-pressed={pressed}
      className={cx(
        s.btn,
        s[`s${size}`],
        bordered && s.bordered,
        pressed && s.pressed,
        tone === 'text-1' && s.t1,
        tone === 'text-2' && s.t2,
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={iconSize ?? (size === 16 ? 12 : 16)} filled={filled} />
    </button>
  )
  if (flag === false) return btn
  return (
    <Flag label={flag ?? label} keys={keys} side={flagSide}>
      {btn}
    </Flag>
  )
}
