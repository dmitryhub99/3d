import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from '../../lib/cx'
import { Icon, type IconName } from '../icons/Icon'
import { Flag, type FlagSide } from './Flag'
import s from './Button.module.css'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 'primary' is the one accent fill per screen (§8.1 role 2). */
  variant?: 'primary' | 'secondary'
  /** 32 (inspector, default) or 24 (toolbar / compact primary). */
  size?: 24 | 32
  /** Leading 16px icon (12px at size 24). */
  icon?: IconName
  iconFilled?: boolean
  /** Secondary only: 'muted' sets the label in text-2 (e.g. "Following"). */
  tone?: 'default' | 'muted'
  /** Hover flag text (e.g. the intro path on the primary action). */
  flag?: ReactNode
  flagKeys?: readonly string[] | string
  flagSide?: FlagSide
  children?: ReactNode
  ref?: Ref<HTMLButtonElement>
}

/**
 * Primary: 32h, padding 0 12, radius 4, accent fill (hover accent-hover, press accent-press), 13/18 500 accent-ink.
 * Compact primary (24): 12/16 500. Secondary: 1px line-2, transparent, 13/18 500 text-1 (24h: 12/16 500 text-2), hover fill.
 */
export function Button({
  variant = 'secondary',
  size = 32,
  icon,
  iconFilled,
  tone = 'default',
  flag,
  flagKeys,
  flagSide = 'bottom',
  className,
  children,
  type = 'button',
  ref,
  ...rest
}: ButtonProps) {
  const btn = (
    <button
      ref={ref}
      type={type}
      className={cx(
        s.button,
        variant === 'primary' ? s.primary : s.secondary,
        size === 24 ? s.small : s.large,
        tone === 'muted' && s.muted,
        !children && s.iconOnly,
        className,
      )}
      {...rest}
    >
      {icon ? <Icon name={icon} size={size === 24 ? 12 : 16} filled={iconFilled} className={s.icon} /> : null}
      {children != null ? <span className={s.label}>{children}</span> : null}
    </button>
  )
  return flag ? (
    <Flag label={flag} keys={flagKeys} side={flagSide}>
      {btn}
    </Flag>
  ) : (
    btn
  )
}
