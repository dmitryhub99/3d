// Career strip (§7.1 Experience): roles placed at their real dates on one axis, 2px apart.
// The current role is text-2, past roles text-4. Mono axis labels sit under the strip.
import s from './CareerStrip.module.css'

const toMonths = (ym: string) => {
  const [y, m] = ym.split('-').map(Number)
  return y! * 12 + (m! - 1)
}

export function CareerStrip({
  entries,
  width = 360,
  axis = { from: '2015-01', to: '2026-09' },
}: {
  entries: { from: string; to?: string; current?: boolean }[]
  width?: number
  axis?: { from: string; to: string }
}) {
  const a = toMonths(axis.from)
  const b = toMonths(axis.to)
  const x = (ym: string) => ((toMonths(ym) - a) / (b - a)) * width
  const firstYear = Number(axis.from.slice(0, 4))
  const lastYear = Number(axis.to.slice(0, 4))
  const span = lastYear - firstYear
  const ticks = [firstYear, firstYear + Math.round(span / 3), firstYear + Math.round((2 * span) / 3), lastYear]

  return (
    <div className={s.strip} style={{ width }}>
      <div className={s.bar}>
        {entries.map((e) => {
          const left = Math.max(0, x(e.from))
          const right = Math.min(width, e.to ? x(e.to) : width)
          return (
            <span
              key={e.from}
              className={e.current ? s.current : s.past}
              style={{ left, width: Math.max(2, right - left - 2) }}
            />
          )
        })}
      </div>
      <div className={s.axis}>
        {ticks.map((y, i) => (
          <span
            key={y}
            className={s.tick}
            style={
              i === ticks.length - 1
                ? { right: 0 }
                : { left: Math.max(0, x(`${y}-01`)) }
            }
          >
            {y}
          </span>
        ))}
      </div>
    </div>
  )
}
