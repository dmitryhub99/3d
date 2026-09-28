import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { useQueryHover } from '../workspace/queryHover'
import { Flag } from './Flag'
import s from './FitTicks.module.css'

export interface FitTicksProps {
  /** One tick per numbered clause (or per stage), in order. true = satisfied (filled). */
  values: readonly boolean[]
  /** Every tick filled text-1 (a 5/5 row). Default false: satisfied ticks are text-2. */
  full?: boolean
  /**
   * 0-based tick to keep; every other tick drops to 40%. `null` disables highlighting.
   * When omitted, the tick follows the QueryHoverContext (hovered clause) if `linked`.
   */
  highlight?: number | null
  /** Called with the hovered tick (0-based), then null on leave. */
  onHoverTick?: (index: number | null) => void
  /** Flag above a hovered tick, e.g. "5 available within 3 months · from 11 Jan 2027 — not met". */
  tickFlag?: (index: number) => ReactNode
  /** Read and publish the QueryHoverContext (default true). Stage tracks pass false. */
  linked?: boolean
  /** Accessible summary, e.g. "4 of 5 clauses met". Defaults to "n of m met". */
  label?: string
  className?: string
}

/** Clause ticks (§6.6): 8 × 10, 2px gap, filled text-2 (text-1 when full), unmet 1px text-4 outline. */
export function FitTicks({
  values,
  full = false,
  highlight,
  onHoverTick,
  tickFlag,
  linked = true,
  label,
  className,
}: FitTicksProps) {
  const ctx = useQueryHover()
  const active = highlight !== undefined ? highlight : linked ? ctx.hovered : null
  const met = values.filter(Boolean).length
  const hoverable = !!(onHoverTick || tickFlag || linked)

  const enter = (i: number) => {
    onHoverTick?.(i)
    if (linked) ctx.setHovered(i, 'tick')
  }
  const leave = () => {
    onHoverTick?.(null)
    if (linked) ctx.setHovered(null)
  }

  return (
    <span
      className={cx(s.ticks, className)}
      role="img"
      aria-label={label ?? `${met} of ${values.length} met`}
      data-highlight={active ?? undefined}
    >
      {values.map((v, i) => {
        const tick = (
          <span
            className={cx(s.tick, v ? (full ? s.full : s.met) : s.unmet, active != null && active !== i && s.dim)}
            onMouseEnter={hoverable ? () => enter(i) : undefined}
            onMouseLeave={hoverable ? leave : undefined}
          />
        )
        return tickFlag ? (
          <Flag key={i} label={tickFlag(i)} side="top">
            {tick}
          </Flag>
        ) : (
          <span key={i} className={s.slot}>
            {tick}
          </span>
        )
      })}
    </span>
  )
}
