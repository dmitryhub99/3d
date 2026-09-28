import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import s from './SectionHeading.module.css'

export interface SectionHeadingProps {
  /** Sentence-case label, 11/16 600 text-3. */
  label: ReactNode
  /** Right-aligned readout, mono 11/16 text-3 (e.g. `4/5`, `11y`, `1 of 8 match`). */
  readout?: ReactNode
  /** Heading element (default h3). */
  as?: 'h2' | 'h3' | 'h4'
  id?: string
  className?: string
}

/** Inspector / sheet heading: label, a 1px line-1 leader rule (8px each side), mono readout at the right edge. */
export function SectionHeading({ label, readout, as: Tag = 'h3', id, className }: SectionHeadingProps) {
  return (
    <div className={cx(s.heading, className)}>
      <Tag id={id} className={s.label}>
        {label}
      </Tag>
      <span className={s.rule} aria-hidden />
      {readout != null && readout !== '' ? <span className={s.readout}>{readout}</span> : null}
    </div>
  )
}
