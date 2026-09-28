import { Icon, type IconName } from '../icons/Icon'
import { cx } from '../../lib/cx'
import s from './Kbd.module.css'

/** Symbols that neither font carries (§8.2) are drawn with the 10-grid kbd-* glyphs. */
const SYMBOLS: Record<string, { icon: IconName; name: string }> = {
  '⌘': { icon: 'kbd-cmd', name: 'Command' },
  '⌥': { icon: 'kbd-opt', name: 'Option' },
  '⇧': { icon: 'kbd-shift', name: 'Shift' },
  '↵': { icon: 'kbd-return', name: 'Return' },
  '⌫': { icon: 'kbd-backspace', name: 'Backspace' },
  '↑': { icon: 'kbd-up', name: 'Up' },
  '↓': { icon: 'kbd-down', name: 'Down' },
  '←': { icon: 'kbd-left', name: 'Left' },
  '→': { icon: 'kbd-right', name: 'Right' },
}

const WORD = /^[A-Za-z]{2,}$/

/**
 * Normalises the `keys` prop into one entry per cap:
 *   ['⌘','K'] → ⌘ K     'G P' → G P     ['⌘S'] → ⌘ S     ['esc'] → esc     ['Space'] → Space
 */
export function splitKeys(keys: readonly string[] | string): string[] {
  const list = typeof keys === 'string' ? keys.split(/\s+/) : keys
  const out: string[] = []
  for (const k of list) {
    if (!k) continue
    if (k.length === 1 || WORD.test(k)) out.push(k)
    else out.push(...Array.from(k))
  }
  return out
}

export interface KbdProps {
  /** One entry per cap, e.g. ['⌘','K'], ['G','P'], ['↵'], ['esc']. A space-separated string also works. */
  keys: readonly string[] | string
  className?: string
}

/** Key-cap sequence: 16 tall, sunken, 1px line-2, radius 2; letters mono 10/12 500, symbols as SVG. */
export function Kbd({ keys, className }: KbdProps) {
  const caps = splitKeys(keys)
  return (
    <span className={cx(s.keys, className)}>
      {caps.map((k, i) => {
        const sym = SYMBOLS[k]
        if (sym) {
          return (
            <kbd key={i} className={cx(s.cap, s.symbol)} aria-label={sym.name}>
              <Icon name={sym.icon} size={10} />
            </kbd>
          )
        }
        return (
          <kbd key={i} className={s.cap}>
            {k}
          </kbd>
        )
      })}
    </span>
  )
}
