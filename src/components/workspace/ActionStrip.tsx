import { Fragment } from 'react'
import { motion } from 'motion/react'
import { fadeIn } from '../../lib/motion'
import { cx } from '../../lib/cx'
import type { IconName } from '../icons/Icon'
import { TextButton } from '../primitives/TextButton'
import s from './ActionStrip.module.css'

export interface StripAction {
  id: string
  /** 12/16 500 text-2 label, e.g. "Add to pipeline". */
  label: string
  /** Kbd hint after the label, e.g. ['P']. */
  keys?: readonly string[] | string
  icon?: IconName
  disabled?: boolean
  onSelect: () => void
}

export interface ActionStripProps {
  /** Number of checked rows (mono). */
  count: number
  actions: readonly StripAction[]
  /** "Esc clear". */
  onClear: () => void
  /** Side padding, default 16 (content from x=72 in People). */
  inset?: 16 | 20 | 24
  className?: string
}

/**
 * Multi-select foot (§6.8): `3 selected · Add to pipeline P · Save to list · Message M · Compare · Esc clear`.
 * Labels are 12/16 500 text-2 text buttons with Kbd hints; the count is mono. Fades in over 120ms.
 */
export function ActionStrip({ count, actions, onClear, inset = 16, className }: ActionStripProps) {
  return (
    <motion.div
      role="toolbar"
      aria-label={`${count} selected`}
      className={cx(s.strip, s[`i${inset}`], className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={fadeIn(120)}
    >
      <span className={s.count}>
        <span className={s.num}>{count}</span> selected
      </span>
      {actions.map((a) => (
        <Fragment key={a.id}>
          <span className={s.sep} aria-hidden>
            ·
          </span>
          <TextButton icon={a.icon} keys={a.keys} disabled={a.disabled} onClick={a.onSelect} className={s.action}>
            {a.label}
          </TextButton>
        </Fragment>
      ))}
      <span className={s.sep} aria-hidden>
        ·
      </span>
      <TextButton keys={['esc']} keysPosition="start" onClick={onClear} className={s.action}>
        clear
      </TextButton>
    </motion.div>
  )
}

/** §6.8 People actions, in order (wire `onSelect` in the workspace). */
export const PEOPLE_STRIP_ACTIONS: readonly Omit<StripAction, 'onSelect'>[] = [
  { id: 'pipeline', label: 'Add to pipeline', keys: ['P'] },
  { id: 'list', label: 'Save to list' },
  { id: 'message', label: 'Message', keys: ['M'] },
  { id: 'compare', label: 'Compare' },
]
