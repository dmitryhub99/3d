import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { fadeIn } from '../../lib/motion'
import { cx } from '../../lib/cx'
import { Kbd } from './Kbd'
import { anchorBox, isOverlayOpen, place, rootFrame } from './overlayKit'
import s from './Flag.module.css'

// ---- shared module-level state: 400ms delay, 0ms while another flag is (or just was) visible ----
let visibleOwner: string | null = null
let hideVisible: (() => void) | null = null
let lastHiddenAt = -Infinity
/** Moving from one anchor to the next counts as "another flag is visible" within this window. */
const SWAP_WINDOW_MS = 150
export const FLAG_DELAY = 400

/** Hide whichever flag is showing (e.g. when a menu opens or a key is pressed). */
export function hideFlags() {
  hideVisible?.()
}

export type FlagSide = 'right' | 'bottom' | 'top'

export interface FlagProps {
  /** Flag text (12/16 500 text-1). May be a node, e.g. a glyph plus text. */
  label: ReactNode
  /** Key caps after the label (8px gap), e.g. ['G','P'] or ['⌘','S']. */
  keys?: readonly string[] | string
  side?: FlagSide
  /** Gap from the anchor, default 6 (§8.7). Rail flags pass the distance to x=57. */
  offset?: number
  /** 'rail': flush flag with no left border and radius 0 4 4 0 (§3). */
  variant?: 'default' | 'rail'
  /** Hover delay; the default 400ms becomes 0 while another flag is visible. */
  delay?: number
  disabled?: boolean
  /** Controlled visibility. When set, hover and focus are ignored. */
  open?: boolean
  className?: string
  /** The anchor. Exactly one element; the flag measures it. */
  children: ReactNode
}

export function Flag({
  label,
  keys,
  side = 'bottom',
  offset = 6,
  variant = 'default',
  delay = FLAG_DELAY,
  disabled = false,
  open,
  className,
  children,
}: FlagProps) {
  const id = useId()
  const wrapRef = useRef<HTMLSpanElement>(null)
  const flagRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const [hoverShown, setHoverShown] = useState(false)
  const [instant, setInstant] = useState(false)
  const [pos, setPos] = useState<{ left: number; top: number; fixed: boolean } | null>(null)

  const controlled = open !== undefined
  const visible = !disabled && (controlled ? !!open : hoverShown)

  const hide = useCallback(() => {
    window.clearTimeout(timer.current)
    timer.current = undefined
    setHoverShown(false)
    if (visibleOwner === id) {
      visibleOwner = null
      hideVisible = null
      lastHiddenAt = performance.now()
    }
  }, [id])

  const show = useCallback(
    (fast: boolean) => {
      if (isOverlayOpen()) return
      if (visibleOwner && visibleOwner !== id) hideVisible?.()
      visibleOwner = id
      hideVisible = hide
      setInstant(fast)
      setHoverShown(true)
    },
    [hide, id],
  )

  const arm = useCallback(() => {
    if (disabled || controlled) return
    window.clearTimeout(timer.current)
    const fast = visibleOwner !== null || performance.now() - lastHiddenAt < SWAP_WINDOW_MS
    if (fast || delay <= 0) show(true)
    else timer.current = window.setTimeout(() => show(false), delay)
  }, [controlled, delay, disabled, show])

  useEffect(() => () => {
    window.clearTimeout(timer.current)
    if (visibleOwner === id) {
      visibleOwner = null
      hideVisible = null
      lastHiddenAt = performance.now()
    }
  }, [id])

  useEffect(() => {
    if (disabled && hoverShown) hide()
  }, [disabled, hoverShown, hide])

  // Hide when anything scrolls or a key is pressed while the flag is up.
  useEffect(() => {
    if (!visible || controlled) return
    const onScroll = () => hide()
    const onKey = () => hide()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('blur', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('blur', onScroll)
    }
  }, [visible, controlled, hide])

  useLayoutEffect(() => {
    if (!visible) {
      setPos(null)
      return
    }
    const anchor = wrapRef.current?.firstElementChild
    const el = flagRef.current
    if (!anchor || !el) return
    const frame = rootFrame()
    const a = anchorBox(anchor, frame)
    const p = place(a, el.offsetWidth, el.offsetHeight, side, 'center', offset, frame)
    setPos({ left: p.left, top: p.top, fixed: frame.isBody })
  }, [visible, side, offset, label])

  const onFocus = (e: React.FocusEvent) => {
    const t = e.target as HTMLElement
    if (t.matches?.(':focus-visible')) arm()
  }

  const flag = visible
    ? createPortal(
        <motion.div
          ref={flagRef}
          id={`flag-${id}`}
          role="tooltip"
          className={cx(s.flag, variant === 'rail' && s.rail, className)}
          style={{
            position: pos?.fixed ? 'fixed' : 'absolute',
            left: pos?.left ?? 0,
            top: pos?.top ?? 0,
            visibility: pos ? 'visible' : 'hidden',
          }}
          initial={instant ? false : { opacity: 0, x: side === 'right' ? -4 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={fadeIn(100)}
        >
          <span className={s.label}>{label}</span>
          {keys && keys.length > 0 ? <Kbd keys={keys} className={s.keys} /> : null}
        </motion.div>,
        rootFrame().root,
      )
    : null

  return (
    <span
      ref={wrapRef}
      className={s.anchor}
      onMouseEnter={arm}
      onMouseLeave={controlled ? undefined : hide}
      onFocus={onFocus}
      onBlur={controlled ? undefined : hide}
      onPointerDown={controlled ? undefined : hide}
    >
      {children}
      {flag}
    </span>
  )
}
