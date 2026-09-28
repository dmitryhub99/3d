// Structural constants (§8.4) and small geometry helpers.
// Every coordinate in the spec is on the 1440 × 1024 canvas; these are the numbers behind it.

export const CANVAS_W = 1440
export const CANVAS_H = 1024

export const RAIL_W = 56
export const CAP_H = 40
export const FOOT_H = 28
export const STRIP_H = 36
export const QUERY_H = 40
export const QUERY_H_WRAPPED = 64
export const COLHEAD_H = 28
export const ROW_H = 44
export const ROW_H_COMPACT = 32
export const GROUP_H = 28
export const CHANNEL_W = 200
export const PEEK_W = 400
export const READER_W = 560
export const INSPECTOR_MIN = 360
export const INSPECTOR_MAX = 640
export const SNAP_POINTS = [360, 400, 480, 560, 640] as const
export const SNAP_ZONE = 6
export const GLOBAL_ZONE_W = 112

export type Mode = 'index' | 'stream' | 'matrix' | 'board' | 'sheet'
export const MODE_MIN: Record<Mode, number> = { index: 640, stream: 640, matrix: 656, board: 880, sheet: 720 }

/** Workspace side padding (content runs x 72–1024 in People). */
export const SIDE_PAD = 16
/** Inspector padding: Peek 20, Reader 24. */
export const INSPECTOR_PAD = 20
export const READER_PAD = 24
/** Inspector section gap. */
export const SECTION_GAP = 20

/** Notches (§2.1, §8.7). */
export const NOTCH = 2
export const TETHER_H = 20
export const TETHER_STUB_H = 8

/** Rail item metrics (§3). */
export const RAIL_HIT_W = 40
export const RAIL_HIT_H = 32
export const RAIL_SQUARE = 32
export const RAIL_GROUP_GAP = 12

/** Top of the People rows container on the canvas: cap + strip + query + header. */
export const ROWS_TOP = CAP_H + STRIP_H + QUERY_H + COLHEAD_H // 144
/** Bottom of every body: the foot line. */
export const BODY_BOTTOM = CANVAS_H - FOOT_H // 996

/** Top y of row i inside its scroll container (0-based). */
export const rowTop = (i: number, h: number = ROW_H) => i * h

/** Clamp a number into [min, max]. */
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** Nearest snap point within SNAP_ZONE, else the width itself (rounded). */
export function snapWidth(w: number, max: number = INSPECTOR_MAX): number {
  let best = Math.round(w)
  let bestD = SNAP_ZONE + 1
  for (const p of SNAP_POINTS) {
    if (p > max) continue
    const d = Math.abs(p - w)
    if (d <= SNAP_ZONE && d < bestD) {
      best = p
      bestD = d
    }
  }
  return clamp(best, INSPECTOR_MIN, Math.max(INSPECTOR_MIN, max))
}

/** Class default width for an inspector class. */
export const inspectorDefault = (cls: 'peek' | 'reader' | 'none') => (cls === 'reader' ? READER_W : PEEK_W)
