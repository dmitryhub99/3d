// Shared plumbing for Flag, Popover and Menu: the portal root, anchor geometry in overlay-root
// coordinates (the app may be CSS-scaled), and a module-level stack of open overlays.
import { getOverlayRoot } from '../../lib/overlay'
import { getStage } from '../../lib/stage'

/** An element, or a client-space point/box (e.g. a right-click position from a MouseEvent). */
export type OverlayAnchor = Element | { x: number; y: number; width?: number; height?: number }

export interface Box {
  left: number
  top: number
  width: number
  height: number
}

export interface RootFrame {
  root: HTMLElement
  /** Client-space origin of the overlay root. */
  originX: number
  originY: number
  /** Visual scale of the overlay root (1 when the app is not scaled). */
  scale: number
  /** Usable width/height in root coordinates (for clamping). */
  width: number
  height: number
  /** True when the root is document.body (overlays then use position: fixed). */
  isBody: boolean
}

export function overlayRoot(): HTMLElement {
  let root: HTMLElement | null = null
  try {
    root = getOverlayRoot()
  } catch {
    root = null
  }
  return root ?? document.body
}

export function rootFrame(): RootFrame {
  const root = overlayRoot()
  const isBody = root === document.body
  if (isBody) {
    return { root, originX: 0, originY: 0, scale: 1, width: window.innerWidth, height: window.innerHeight, isBody }
  }
  const r = root.getBoundingClientRect()
  // scale = rendered width / layout width; the overlay root may be a zero-size box, so fall back to the stage scale.
  const scale = root.offsetWidth > 0 ? r.width / root.offsetWidth : getStage().scale || 1
  const stage = getStage()
  const width = root.offsetWidth > 0 ? root.offsetWidth : stage.width
  const height = root.offsetHeight > 0 ? root.offsetHeight : stage.height
  return { root, originX: r.left, originY: r.top, scale: scale || 1, width, height, isBody }
}

/** Anchor box converted into overlay-root coordinates. */
export function anchorBox(anchor: OverlayAnchor, frame: RootFrame = rootFrame()): Box {
  let left: number, top: number, width: number, height: number
  if (anchor instanceof Element) {
    const r = anchor.getBoundingClientRect()
    left = r.left
    top = r.top
    width = r.width
    height = r.height
  } else {
    left = anchor.x
    top = anchor.y
    width = anchor.width ?? 0
    height = anchor.height ?? 0
  }
  const k = frame.scale
  return { left: (left - frame.originX) / k, top: (top - frame.originY) / k, width: width / k, height: height / k }
}

export type Side = 'bottom' | 'top' | 'right' | 'left'
export type Align = 'start' | 'center' | 'end'

const EDGE = 4

/** Place a w × h box against an anchor box; flips on overflow and clamps into the frame. */
export function place(a: Box, w: number, h: number, side: Side, align: Align, offset: number, frame: RootFrame) {
  const W = frame.width
  const H = frame.height
  let left = 0
  let top = 0
  let resolved: Side = side
  const alongX = () =>
    align === 'start' ? a.left : align === 'end' ? a.left + a.width - w : a.left + a.width / 2 - w / 2
  const alongY = () =>
    align === 'start' ? a.top : align === 'end' ? a.top + a.height - h : a.top + a.height / 2 - h / 2

  if (side === 'bottom' || side === 'top') {
    left = alongX()
    const below = a.top + a.height + offset
    const above = a.top - offset - h
    if (side === 'bottom') {
      top = below
      if (below + h > H - EDGE && above >= EDGE) {
        top = above
        resolved = 'top'
      }
    } else {
      top = above
      if (above < EDGE && below + h <= H - EDGE) {
        top = below
        resolved = 'bottom'
      }
    }
  } else {
    top = alongY()
    const right = a.left + a.width + offset
    const leftSide = a.left - offset - w
    if (side === 'right') {
      left = right
      if (right + w > W - EDGE && leftSide >= EDGE) {
        left = leftSide
        resolved = 'left'
      }
    } else {
      left = leftSide
      if (leftSide < EDGE && right + w <= W - EDGE) {
        left = right
        resolved = 'right'
      }
    }
  }
  left = Math.max(EDGE, Math.min(left, W - w - EDGE))
  top = Math.max(EDGE, Math.min(top, H - h - EDGE))
  return { left: Math.round(left), top: Math.round(top), side: resolved }
}

// ---- open-overlay stack (menus, popovers). Flags stay quiet while any overlay is open. ----
const stack: number[] = []
const listeners = new Set<() => void>()
let nextId = 1

export const newOverlayId = () => nextId++

export function pushOverlay(id: number) {
  if (!stack.includes(id)) stack.push(id)
  listeners.forEach((l) => l())
}

export function popOverlay(id: number) {
  const i = stack.indexOf(id)
  if (i >= 0) stack.splice(i, 1)
  listeners.forEach((l) => l())
}

export const isTopOverlay = (id: number) => stack[stack.length - 1] === id

/** True while any Menu / Popover / ClausePopover is open. The global hotkey layer can use it to let Esc close the overlay first. */
export const isOverlayOpen = () => stack.length > 0

export function subscribeOverlays(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

/** True when the keyboard event comes from a text-entry field. */
export function isTypingTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false
  if (t.isContentEditable) return true
  const tag = t.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}
