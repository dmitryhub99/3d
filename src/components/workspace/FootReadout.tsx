import { Fragment, type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import s from './FootReadout.module.css'

export interface FootReadoutProps {
  /** Readout parts joined with " · " (e.g. [<><Fig>22</Fig> results</>, …]). */
  items?: readonly ReactNode[]
  /** Free-form readout instead of `items`. */
  children?: ReactNode
  /** Right-hand content (KeyHints, a TextButton), right-aligned to the content edge. */
  right?: ReactNode
  /** Side padding: 16 (workspace), 20 (Peek inspector), 24 (Reader). Default 16. */
  inset?: 16 | 20 | 24
  /** Figures are tabular sans; wrap them in <Fig> for mono (inspector foot). */
  className?: string
}

/**
 * A foot band's content (28h, §2.2): readout at the left in 11/16 text-3 with tabular figures, optional right slot.
 * Place it inside the column's foot slot; it fills the slot's height.
 */
export function FootReadout({ items, children, right, inset = 16, className }: FootReadoutProps) {
  return (
    <div className={cx(s.foot, s[`i${inset}`], className)}>
      <div className={s.readout} role="status" aria-live="polite">
        {items
          ? items.map((it, i) => (
              <Fragment key={i}>
                {i > 0 ? <span className={s.sep}> · </span> : null}
                {it}
              </Fragment>
            ))
          : children}
      </div>
      {right ? <div className={s.right}>{right}</div> : null}
    </div>
  )
}
