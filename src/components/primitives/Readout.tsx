import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import s from './Readout.module.css'

export interface ReadoutProps {
  children: ReactNode
  /** Whole readout in mono 11/16 (position, width, dates). Default: sans 11/16 with tabular figures. */
  mono?: boolean
  /** Text tone (default text-3). */
  tone?: 'text-1' | 'text-2' | 'text-3'
  className?: string
}

/** Sans 11/16 text-3 sentence with tabular figures, or mono (§8.3 --t-11 / --t-11m). */
export function Readout({ children, mono = false, tone = 'text-3', className }: ReadoutProps) {
  return <span className={cx(s.readout, mono && s.mono, s[tone], className)}>{children}</span>
}

export interface FigProps {
  children: ReactNode
  tone?: 'text-1' | 'text-2' | 'text-3'
  className?: string
}

/** A figure set in mono inside a sans run (D7): inherits the size, keeps 11/16 metrics inside readouts. */
export function Fig({ children, tone, className }: FigProps) {
  return <span className={cx(s.fig, tone && s[tone], className)}>{children}</span>
}
