import { cx } from '../../lib/cx'
import { Kbd } from '../primitives/Kbd'
import s from './KeyHints.module.css'

export interface KeyHint {
  /** Caps, e.g. ['J','K'], ['↵'], ['X']. */
  keys: readonly string[] | string
  /** Lower-case verb, e.g. "move", "open", "select". */
  label: string
}

export interface KeyHintsProps {
  hints: readonly KeyHint[]
  className?: string
}

/** Key-hint strip (§10): Kbd + 11/16 text-3 label, 4px key → label, 12px between pairs. */
export function KeyHints({ hints, className }: KeyHintsProps) {
  return (
    <div className={cx(s.hints, className)} aria-label="Keyboard shortcuts">
      {hints.map((h, i) => (
        <span key={i} className={s.pair}>
          <Kbd keys={h.keys} />
          <span className={s.label}>{h.label}</span>
        </span>
      ))}
    </div>
  )
}

/** §10 People key hints: `J` `K` move · `↵` open · `X` select · `F` follow · `S` save. */
export const PEOPLE_KEY_HINTS: readonly KeyHint[] = [
  { keys: ['J', 'K'], label: 'move' },
  { keys: ['↵'], label: 'open' },
  { keys: ['X'], label: 'select' },
  { keys: ['F'], label: 'follow' },
  { keys: ['S'], label: 'save' },
]
