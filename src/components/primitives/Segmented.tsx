import { useRef, type KeyboardEvent } from 'react'
import { cx } from '../../lib/cx'
import { Icon, type IconName } from '../icons/Icon'
import { Flag, type FlagSide } from './Flag'
import s from './Segmented.module.css'

export interface SegmentedOption<T extends string = string> {
  id: T
  icon: IconName
  /** Accessible name and flag label, e.g. "Table". */
  label: string
  /** Shortcut shown in the flag, e.g. '1'. */
  key?: string
}

export interface SegmentedProps<T extends string = string> {
  options: readonly SegmentedOption<T>[]
  value: T
  onChange: (id: T) => void
  /** Accessible group name, e.g. "View". */
  label?: string
  flagSide?: FlagSide
  className?: string
}

/**
 * View switcher (§6.2, §8.7): one 1px line-1 outline, radius 4, 24 × 24 cells with 1px line-1 dividers.
 * Selected cell: `active` fill, text-1 icon; others text-3. Arrow keys move the selection (radio group).
 */
export function Segmented<T extends string = string>({
  options,
  value,
  onChange,
  label = 'View',
  flagSide = 'bottom',
  className,
}: SegmentedProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const current = Math.max(0, options.findIndex((o) => o.id === value))

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (current + delta + options.length) % options.length
    onChange(options[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div role="radiogroup" aria-label={label} className={cx(s.group, className)} onKeyDown={onKeyDown}>
      {options.map((o, i) => {
        const selected = o.id === value
        return (
          <Flag key={o.id} label={o.label} keys={o.key ? [o.key] : undefined} side={flagSide}>
            <button
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={o.label}
              tabIndex={selected ? 0 : -1}
              className={cx(s.cell, selected && s.selected)}
              onClick={() => onChange(o.id)}
            >
              <Icon name={o.icon} size={16} />
            </button>
          </Flag>
        )
      })}
    </div>
  )
}
