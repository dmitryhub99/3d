import type { MouseEvent, Ref } from 'react'
import { cx } from '../../lib/cx'
import { Icon } from '../icons/Icon'
import s from './Checkbox.module.css'

export interface CheckboxProps {
  checked: boolean
  onChange?: (next: boolean, event: MouseEvent<HTMLButtonElement>) => void
  /** Accessible name, e.g. "Select Maren Aaltonen". */
  label?: string
  disabled?: boolean
  /** Remove from the tab order (rows handle X themselves; menus manage focus). */
  tabIndex?: number
  /** Decorative: render a non-interactive box (menu and popover option rows own the click). */
  presentational?: boolean
  className?: string
  ref?: Ref<HTMLButtonElement>
}

/**
 * 14 × 14, radius 2, 1px line-2. Checked: text-1 fill with a `check` drawn in `frame` (§8.7).
 * The click does not propagate, so a checkbox inside a clickable row never selects the row.
 */
export function Checkbox({ checked, onChange, label, disabled, tabIndex, presentational, className, ref }: CheckboxProps) {
  const mark = checked ? <Icon name="check" size={12} className={s.check} /> : null
  if (presentational) {
    return (
      <span className={cx(s.box, checked && s.checked, className)} aria-hidden>
        {mark}
      </span>
    )
  }
  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      tabIndex={tabIndex}
      className={cx(s.box, s.interactive, checked && s.checked, className)}
      onClick={(e) => {
        e.stopPropagation()
        onChange?.(!checked, e)
      }}
    >
      {mark}
    </button>
  )
}
