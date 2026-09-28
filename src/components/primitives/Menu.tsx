import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { fadeIn, fadeOut } from '../../lib/motion'
import { cx } from '../../lib/cx'
import { Icon, type IconName } from '../icons/Icon'
import { Kbd } from './Kbd'
import { Checkbox } from './Checkbox'
import { hideFlags } from './Flag'
import {
  anchorBox,
  isTopOverlay,
  newOverlayId,
  overlayRoot,
  place,
  popOverlay,
  pushOverlay,
  rootFrame,
  type Align,
  type OverlayAnchor,
  type Side,
} from './overlayKit'
import s from './Menu.module.css'

export type { OverlayAnchor, Side as OverlaySide, Align as OverlayAlign } from './overlayKit'
export { isOverlayOpen } from './overlayKit'

const LONG_PRESS_MS = 400

const stop = (e: { stopPropagation: () => void }) => e.stopPropagation()

export type CloseReason = 'escape' | 'outside' | 'select' | 'tab' | 'trigger'

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return
  if (typeof ref === 'function') ref(value)
  else (ref as { current: T | null }).current = value
}

// =====================================================================================
// Popover: an anchored overlay (portal into the overlay root). Menus and the clause popover
// are built on it. Style: `overlay` fill, 1px line-2, radius 6, no shadow (§8.5, §8.7).
// =====================================================================================

export interface PopoverProps {
  open: boolean
  /** Element, or a client-space point/box (right-click position). Positions are converted into overlay-root space. */
  anchor: OverlayAnchor | null
  onClose: (reason: CloseReason) => void
  /** Side of the anchor to open on (default 'bottom'); flips when it would overflow. */
  side?: Side
  /** Alignment along that side: 'start' (left/top edges flush, default), 'center', 'end' (right/bottom edges flush). */
  align?: Align
  /** Gap to the anchor in px (default 4). */
  offset?: number
  /** Fixed width in px; omit for content width. */
  width?: number
  /** Inner padding 4 (menus). Default true. */
  padded?: boolean
  role?: 'menu' | 'dialog' | 'listbox'
  ariaLabel?: string
  id?: string
  className?: string
  /** Elements whose pointerdown is not "outside" (the trigger). */
  ignore?: readonly (Element | null | undefined)[]
  /** Focus on open: the container (menus), the first `[data-autofocus]`/input ('auto'), or nothing. */
  initialFocus?: 'container' | 'auto' | 'none'
  /** Return focus to what had it before opening (default true). */
  restoreFocus?: boolean
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>
  activeDescendant?: string
  containerRef?: Ref<HTMLDivElement>
  children: ReactNode
}

export function Popover({
  open,
  anchor,
  onClose,
  side = 'bottom',
  align = 'start',
  offset = 4,
  width,
  padded = true,
  role = 'dialog',
  ariaLabel,
  id,
  className,
  ignore,
  initialFocus = 'container',
  restoreFocus = true,
  onKeyDown,
  activeDescendant,
  containerRef,
  children,
}: PopoverProps) {
  const [oid] = useState(newOverlayId)
  const elRef = useRef<HTMLDivElement | null>(null)
  const prevFocus = useRef<Element | null>(null)
  const [pos, setPos] = useState<{ left: number; top: number; side: Side; fixed: boolean } | null>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const ignoreRef = useRef(ignore)
  ignoreRef.current = ignore
  const lastAnchor = useRef<OverlayAnchor | null>(null)
  if (anchor) lastAnchor.current = anchor

  const setEl = useCallback(
    (el: HTMLDivElement | null) => {
      elRef.current = el
      setRef(containerRef, el)
    },
    [containerRef],
  )

  const reposition = useCallback(() => {
    const el = elRef.current
    const a = lastAnchor.current
    if (!el || !a) return
    if (a instanceof Element && !a.isConnected) return
    const frame = rootFrame()
    const box = anchorBox(a, frame)
    const p = place(box, el.offsetWidth, el.offsetHeight, side, align, offset, frame)
    setPos((prev) =>
      prev && prev.left === p.left && prev.top === p.top && prev.side === p.side ? prev : { ...p, fixed: frame.isBody },
    )
  }, [side, align, offset])

  // Register in the overlay stack; quiet every flag.
  useEffect(() => {
    if (!open) return
    pushOverlay(oid)
    hideFlags()
    return () => popOverlay(oid)
  }, [open, oid])

  useLayoutEffect(() => {
    if (open) reposition()
    else setPos(null)
  }, [open, reposition, anchor])

  useEffect(() => {
    if (!open) return
    const el = elRef.current
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => reposition()) : null
    if (el && ro) ro.observe(el)
    window.addEventListener('resize', reposition)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', reposition)
    }
  }, [open, reposition])

  // Focus in on open, back out on close.
  useEffect(() => {
    if (!open) return
    prevFocus.current = document.activeElement
    const el = elRef.current
    if (el && initialFocus !== 'none') {
      const target =
        initialFocus === 'auto'
          ? (el.querySelector<HTMLElement>('[data-autofocus]') ?? el.querySelector<HTMLElement>('input') ?? el)
          : el
      target.focus({ preventScroll: true })
    }
    return () => {
      if (!restoreFocus) return
      const active = document.activeElement
      const inside = !!(active && elRef.current?.contains(active))
      const prev = prevFocus.current
      if ((inside || active === document.body || !active) && prev instanceof HTMLElement && prev.isConnected) {
        prev.focus({ preventScroll: true })
      }
    }
  }, [open, initialFocus, restoreFocus])

  // Outside press and Escape. Escape is caught at window capture so only the topmost overlay closes.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node | null
      if (!t) return
      if (elRef.current?.contains(t)) return
      if (ignoreRef.current?.some((n) => n && n.contains(t))) return
      // A press inside an overlay stacked above this one (a nested menu) is not "outside".
      const other = (t as Element).closest?.('[data-overlay-id]')
      if (other && Number(other.getAttribute('data-overlay-id')) > oid) return
      onCloseRef.current('outside')
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape' || !isTopOverlay(oid)) return
      e.preventDefault()
      e.stopPropagation()
      onCloseRef.current('escape')
    }
    document.addEventListener('pointerdown', onDown, true)
    window.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      window.removeEventListener('keydown', onKey, true)
    }
  }, [open, oid])

  const off = { bottom: { y: -2 }, top: { y: 2 }, right: { x: -2 }, left: { x: 2 } }[pos?.side ?? side]

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="popover"
          ref={setEl}
          id={id}
          data-overlay-id={oid}
          role={role}
          aria-label={ariaLabel}
          aria-activedescendant={activeDescendant}
          tabIndex={-1}
          className={cx(s.popover, padded && s.padded, className)}
          style={{
            position: pos?.fixed ? 'fixed' : 'absolute',
            // Parked off-canvas (not visibility:hidden) until measured, so focus can land on open.
            left: pos?.left ?? -10000,
            top: pos?.top ?? 0,
            width,
          }}
          initial={{ opacity: 0, ...off }}
          animate={{ opacity: 1, x: 0, y: 0, transition: fadeIn(120) }}
          exit={{ opacity: 0, transition: fadeOut(80) }}
          onKeyDown={(e) => {
            onKeyDown?.(e)
            // Portal events bubble through the React tree: keep them away from rows / cells that own a trigger.
            e.stopPropagation()
          }}
          onClick={stop}
          onDoubleClick={stop}
          onPointerDown={stop}
          onMouseDown={stop}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    overlayRoot(),
  )
}

// =====================================================================================
// Menu
// =====================================================================================

export interface MenuActionItem {
  kind?: 'item'
  id: string
  label: ReactNode
  /** Plain text for typeahead when `label` is not a string. */
  textValue?: string
  /** 12/16 text-3 after the label (8px). */
  secondary?: ReactNode
  /** Leading icon in text-3 (16 by default; history entries use 12). */
  icon?: IconName
  iconSize?: 12 | 16
  /** Right-aligned key caps, e.g. ['⌘','C']. */
  keys?: readonly string[] | string
  /** Right-aligned mono 11 text-3 figure (e.g. a count). */
  hint?: ReactNode
  /** Radio semantics: a trailing text-1 `check` marks the chosen option (Group by, sort). */
  selected?: boolean
  /** Checkbox semantics: a leading 14px checkbox; the menu stays open on toggle (Display → Columns). */
  checked?: boolean
  /** Context switch (account menu): true = text-1 plus a 2 × 16 accent notch on the menu's left edge; false = text-2. */
  active?: boolean
  disabled?: boolean
  /** Keep the menu open after selecting. */
  keepOpen?: boolean
  onSelect?: () => void
}

export interface MenuSeparator {
  kind: 'separator'
  id?: string
}

export interface MenuGroupLabel {
  kind: 'group'
  id?: string
  label: string
}

export type MenuItem = MenuActionItem | MenuSeparator | MenuGroupLabel

export interface MenuProps {
  open: boolean
  anchor: OverlayAnchor | null
  items: readonly MenuItem[]
  onClose: (reason: CloseReason) => void
  /** Called with the item id after the item's own onSelect. */
  onSelect?: (id: string) => void
  side?: Side
  align?: Align
  offset?: number
  /** Default 240. */
  width?: number
  /** Accessible name of the menu. */
  label?: string
  /** Item highlighted on open: -1 none (pointer), 0 the first enabled item (keyboard). */
  initialHighlight?: number
  ignore?: readonly (Element | null | undefined)[]
  className?: string
}

const isAction = (it: MenuItem): it is MenuActionItem => it.kind === undefined || it.kind === 'item'
const enabled = (it: MenuItem) => isAction(it) && !it.disabled

function textOf(it: MenuActionItem): string {
  if (it.textValue) return it.textValue
  return typeof it.label === 'string' ? it.label : ''
}

/**
 * Overlay list (§8.7): padding 4; items 28h, padding 0 8, radius 4, 13/18 text-1, right-aligned Kbd or
 * mono 11 text-3; highlight `active`; separator 1px line-1 with 4px margin; group label 11/16 600 text-3, 24h.
 * Keyboard: ↑ ↓ Home End move, ↵ / Space choose, Esc close, Tab close, letters jump.
 */
export function Menu({
  open,
  anchor,
  items,
  onClose,
  onSelect,
  side = 'bottom',
  align = 'start',
  offset = 4,
  width = 240,
  label,
  initialHighlight = -1,
  ignore,
  className,
}: MenuProps) {
  const baseId = useId()
  const [hl, setHl] = useState(-1)

  const itemsRef = useRef(items)
  itemsRef.current = items

  // Reset the highlight only when the menu opens (item lists are often rebuilt on every render).
  useLayoutEffect(() => {
    if (open) setHl(initialHighlight >= 0 ? itemsRef.current.findIndex(enabled) : -1)
  }, [open, initialHighlight])

  const move = (from: number, dir: 1 | -1) => {
    const n = items.length
    if (!n) return -1
    let i = from
    for (let k = 0; k < n; k++) {
      i = (i + dir + n) % n
      if (i < 0) i = n - 1
      if (enabled(items[i])) return i
    }
    return -1
  }

  const activate = (i: number) => {
    const it = items[i]
    if (!it || !isAction(it) || it.disabled) return
    it.onSelect?.()
    onSelect?.(it.id)
    if (!it.keepOpen && it.checked === undefined) onClose('select')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHl((h) => move(h < 0 ? -1 : h, 1))
        return
      case 'ArrowUp':
        e.preventDefault()
        setHl((h) => move(h < 0 ? items.length : h, -1))
        return
      case 'Home':
        e.preventDefault()
        setHl(move(-1, 1))
        return
      case 'End':
        e.preventDefault()
        setHl(move(items.length, -1))
        return
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (hl >= 0) activate(hl)
        return
      case 'Tab':
        e.preventDefault()
        onClose('tab')
        return
    }
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const ch = e.key.toLocaleLowerCase()
      const n = items.length
      for (let k = 1; k <= n; k++) {
        const i = (Math.max(hl, -1) + k + n) % n
        const it = items[i]
        if (isAction(it) && !it.disabled && textOf(it).toLocaleLowerCase().startsWith(ch)) {
          setHl(i)
          return
        }
      }
    }
  }

  const optId = (i: number) => `${baseId}-opt-${i}`

  return (
    <Popover
      open={open}
      anchor={anchor}
      onClose={onClose}
      side={side}
      align={align}
      offset={offset}
      width={width}
      role="menu"
      ariaLabel={label}
      ignore={ignore}
      initialFocus="container"
      activeDescendant={hl >= 0 ? optId(hl) : undefined}
      onKeyDown={onKeyDown}
      className={className}
    >
      {items.map((it, i) => {
        if (it.kind === 'separator') return <div key={it.id ?? `sep-${i}`} role="separator" className={s.separator} />
        if (it.kind === 'group')
          return (
            <div key={it.id ?? `grp-${i}`} role="presentation" className={s.group}>
              {it.label}
            </div>
          )
        const roleName =
          it.checked !== undefined ? 'menuitemcheckbox' : it.selected !== undefined ? 'menuitemradio' : 'menuitem'
        return (
          <div
            key={it.id}
            id={optId(i)}
            role={roleName}
            aria-checked={it.checked ?? it.selected}
            aria-disabled={it.disabled || undefined}
            data-highlighted={hl === i || undefined}
            className={cx(s.item, it.active === false && s.muted, it.active && s.current)}
            onMouseMove={() => !it.disabled && hl !== i && setHl(i)}
            onMouseLeave={() => setHl(-1)}
            onClick={() => activate(i)}
          >
            {it.active ? <span className={s.ctxNotch} aria-hidden /> : null}
            {it.checked !== undefined ? <Checkbox presentational checked={it.checked} /> : null}
            {it.icon ? <Icon name={it.icon} size={it.iconSize ?? 16} className={s.icon} /> : null}
            <span className={s.itemLabel}>
              <span className={s.labelText}>{it.label}</span>
              {it.secondary ? <span className={s.secondary}>{it.secondary}</span> : null}
            </span>
            {it.hint != null || it.keys || it.selected ? (
              <span className={s.end}>
                {it.hint != null ? <span className={s.hint}>{it.hint}</span> : null}
                {it.keys ? <Kbd keys={it.keys} /> : null}
                {it.selected ? <Icon name="check" size={12} className={s.check} /> : null}
              </span>
            ) : null}
          </div>
        )
      })}
    </Popover>
  )
}

// =====================================================================================
// MenuTrigger: owns open state and anchoring for one trigger element.
// =====================================================================================

export interface MenuTriggerApi {
  open: boolean
  /** Open the menu; `keyboard` highlights the first item. */
  openMenu: (keyboard?: boolean) => void
  close: () => void
  toggle: () => void
  /** Spread onto a custom trigger element (render-prop form). */
  triggerProps: {
    ref: (el: HTMLElement | null) => void
    onClick: (e: ReactMouseEvent<HTMLElement>) => void
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => void
    onContextMenu: (e: ReactMouseEvent<HTMLElement>) => void
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void
    onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void
    onPointerLeave: (e: ReactPointerEvent<HTMLElement>) => void
    'aria-haspopup': 'menu'
    'aria-expanded': boolean
  }
}

export interface MenuTriggerProps extends Omit<MenuProps, 'open' | 'anchor' | 'onClose' | 'initialHighlight' | 'ignore'> {
  /**
   * The trigger: one element (a Button / IconButton / TextButton / any element that accepts ref and
   * event props) which is cloned with the trigger props, or a render function receiving the API.
   */
  children: ReactElement | ((api: MenuTriggerApi) => ReactNode)
  /** Controlled open state. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** What opens the menu. Default ['click']. History buttons use ['longpress','contextmenu']. */
  openOn?: readonly ('click' | 'contextmenu' | 'longpress')[]
  disabled?: boolean
}

type TriggerChildProps = {
  ref?: Ref<HTMLElement>
  onClick?: (e: ReactMouseEvent<HTMLElement>) => void
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void
  onContextMenu?: (e: ReactMouseEvent<HTMLElement>) => void
  onPointerDown?: (e: ReactPointerEvent<HTMLElement>) => void
  onPointerUp?: (e: ReactPointerEvent<HTMLElement>) => void
  onPointerLeave?: (e: ReactPointerEvent<HTMLElement>) => void
}

export function MenuTrigger({
  children,
  open: controlledOpen,
  onOpenChange,
  openOn = ['click'],
  disabled = false,
  items,
  ...menu
}: MenuTriggerProps) {
  const [innerOpen, setInnerOpen] = useState(false)
  const [kbd, setKbd] = useState(false)
  const [anchorPoint, setAnchorPoint] = useState<OverlayAnchor | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const lp = useRef<{ timer?: number; fired: boolean }>({ fired: false })
  const isOpen = controlledOpen ?? innerOpen

  const child = typeof children === 'function' ? null : (Children.only(children) as ReactElement<TriggerChildProps>)
  const childProps: TriggerChildProps = child && isValidElement(child) ? child.props : {}

  const setOpen = useCallback(
    (v: boolean) => {
      if (controlledOpen === undefined) setInnerOpen(v)
      onOpenChange?.(v)
    },
    [controlledOpen, onOpenChange],
  )

  const openMenu = useCallback(
    (keyboard = false, point: OverlayAnchor | null = null) => {
      if (disabled) return
      setKbd(keyboard)
      setAnchorPoint(point)
      setOpen(true)
    },
    [disabled, setOpen],
  )
  const close = useCallback(() => setOpen(false), [setOpen])

  useEffect(() => () => window.clearTimeout(lp.current.timer), [])

  const has = (m: 'click' | 'contextmenu' | 'longpress') => openOn.includes(m)

  const triggerProps: MenuTriggerApi['triggerProps'] = {
    ref: (el) => {
      triggerRef.current = el
      setRef(childProps.ref, el)
    },
    onClick: (e) => {
      if (lp.current.fired) {
        lp.current.fired = false
        e.preventDefault()
        return
      }
      childProps.onClick?.(e)
      if (has('click') && !e.defaultPrevented) {
        // A trigger inside a clickable row must not also select the row.
        e.stopPropagation()
        if (isOpen) close()
        else openMenu(e.detail === 0)
      }
    },
    onKeyDown: (e) => {
      childProps.onKeyDown?.(e)
      if (e.defaultPrevented) return
      if (!isOpen && e.key === 'ArrowDown' && (has('click') || has('longpress'))) {
        e.preventDefault()
        openMenu(true)
      }
    },
    onContextMenu: (e) => {
      childProps.onContextMenu?.(e)
      if (has('contextmenu')) {
        e.preventDefault()
        openMenu(false)
      }
    },
    onPointerDown: (e) => {
      childProps.onPointerDown?.(e)
      if (!has('longpress') || e.button !== 0) return
      lp.current.fired = false
      window.clearTimeout(lp.current.timer)
      lp.current.timer = window.setTimeout(() => {
        lp.current.fired = true
        openMenu(false)
      }, LONG_PRESS_MS)
    },
    onPointerUp: (e) => {
      childProps.onPointerUp?.(e)
      window.clearTimeout(lp.current.timer)
    },
    onPointerLeave: (e) => {
      childProps.onPointerLeave?.(e)
      window.clearTimeout(lp.current.timer)
    },
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
  }

  const api: MenuTriggerApi = { open: isOpen, openMenu, close, toggle: () => (isOpen ? close() : openMenu()), triggerProps }

  const trigger =
    typeof children === 'function' ? children(api) : child ? cloneElement(child, triggerProps as Partial<TriggerChildProps>) : null

  return (
    <>
      {trigger}
      <Menu
        {...menu}
        items={items}
        open={isOpen}
        anchor={anchorPoint ?? triggerRef.current}
        onClose={() => close()}
        initialHighlight={kbd ? 0 : -1}
        ignore={[triggerRef.current]}
      />
    </>
  )
}
