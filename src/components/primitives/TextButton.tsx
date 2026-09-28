import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from '../../lib/cx'
import { Icon, type IconName } from '../icons/Icon'
import { Kbd } from './Kbd'
import { Flag, type FlagSide } from './Flag'
import s from './TextButton.module.css'

export interface TextButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode
  /** Key caps drawn inside the button (6px from the label). */
  keys?: readonly string[] | string
  /** Where the caps sit: after the label (default, "Save segment ⌘S") or before it ("↵ Full profile"). */
  keysPosition?: 'start' | 'end'
  /** Leading 16px icon (e.g. `display`), 6px before the label. */
  icon?: IconName
  /**
   * 'default' 12/16 500 text-2 · 'quiet' 12/16 400 text-3 (Revert) · 'strong' 12/16 500 text-1 (Save segment)
   * · 'foot' 11/16 400 text-3 (inspector foot "Full profile").
   * Every variant: hover fill `hover`, text text-1.
   */
  variant?: 'default' | 'quiet' | 'strong' | 'foot'
  /** Optional hover flag. */
  flag?: ReactNode
  flagKeys?: readonly string[] | string
  flagSide?: FlagSide
  ref?: Ref<HTMLButtonElement>
}

/** 24h text action, padding 0 8, radius 4 (§8.7). */
export function TextButton({
  children,
  keys,
  keysPosition = 'end',
  icon,
  variant = 'default',
  flag,
  flagKeys,
  flagSide = 'bottom',
  className,
  type = 'button',
  ref,
  ...rest
}: TextButtonProps) {
  const caps = keys && keys.length > 0 ? <Kbd keys={keys} /> : null
  const btn = (
    <button ref={ref} type={type} className={cx(s.btn, s[variant], className)} {...rest}>
      {keysPosition === 'start' ? caps : null}
      {icon ? <Icon name={icon} size={16} className={s.icon} /> : null}
      <span className={s.label}>{children}</span>
      {keysPosition === 'end' ? caps : null}
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
