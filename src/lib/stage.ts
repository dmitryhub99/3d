// The stage: the box the whole app renders into (see App.tsx <Stage>).
//   innerWidth >= 1200 → the stage is the viewport (scale 1).
//   below 1200         → a fixed 1440 × 1024 box scaled by innerWidth / 1440 (transform-origin top left).
// Layout is computed from the stage width, never from window.innerWidth directly.
// Overlays live in #strivo-overlays inside the stage, so they scale with it: position them in
// stage coordinates (use toStageRect / toStagePoint to convert getBoundingClientRect / pointer values).
import { useSyncExternalStore } from 'react'
import { CANVAS_H, CANVAS_W } from './geometry'

export const STAGE_BREAKPOINT = 1200

export interface StageSize {
  /** Stage width in CSS px of the design (1440 when scaled). */
  width: number
  /** Stage height in CSS px of the design (1024 when scaled). */
  height: number
  /** Visual scale factor (1 when not scaled). */
  scale: number
  scaled: boolean
}

function measure(): StageSize {
  if (typeof window === 'undefined') return { width: CANVAS_W, height: CANVAS_H, scale: 1, scaled: false }
  const w = window.innerWidth
  const h = window.innerHeight
  if (w >= STAGE_BREAKPOINT) return { width: w, height: h, scale: 1, scaled: false }
  return { width: CANVAS_W, height: CANVAS_H, scale: w / CANVAS_W, scaled: true }
}

let current = measure()
const listeners = new Set<() => void>()

function update() {
  const next = measure()
  if (next.width === current.width && next.height === current.height && next.scale === current.scale) return
  current = next
  listeners.forEach((l) => l())
}

if (typeof window !== 'undefined') window.addEventListener('resize', update)

export const getStage = (): StageSize => current

export function subscribeStage(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Live stage size; re-renders on resize. */
export function useStage(): StageSize {
  return useSyncExternalStore(subscribeStage, getStage, getStage)
}

/** Convert a client (viewport) point to stage coordinates. The stage box sits at the viewport's top left. */
export function toStagePoint(clientX: number, clientY: number): { x: number; y: number } {
  const root = typeof document !== 'undefined' ? document.getElementById('strivo-stage') : null
  const r = root?.getBoundingClientRect()
  const s = current.scale
  return { x: (clientX - (r?.left ?? 0)) / s, y: (clientY - (r?.top ?? 0)) / s }
}

/** Convert a DOMRect from getBoundingClientRect() to stage coordinates. */
export function toStageRect(rect: DOMRect | DOMRectReadOnly): { left: number; top: number; right: number; bottom: number; width: number; height: number } {
  const { x: left, y: top } = toStagePoint(rect.left, rect.top)
  const s = current.scale
  const width = rect.width / s
  const height = rect.height / s
  return { left, top, right: left + width, bottom: top + height, width, height }
}
