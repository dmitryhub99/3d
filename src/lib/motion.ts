// src/lib/motion.ts — §9 motion grammar. The first six exports are copied verbatim from the spec.
export const snap  = { type: 'spring', stiffness: 700, damping: 56, mass: 0.6 } as const // notches, highlights (ζ≈1.37, ~150ms)
export const panel = { type: 'spring', stiffness: 420, damping: 44, mass: 1 } as const   // widths, band heights (ζ≈1.07, ~240ms)
export const easeOut = [0.16, 1, 0.3, 1] as const
export const easeIn  = [0.5, 0, 0.75, 0] as const
export const fadeIn  = (ms: number, delay = 0) => ({ duration: ms / 1000, delay: delay / 1000, ease: easeOut })
export const fadeOut = (ms: number) => ({ duration: ms / 1000, ease: easeIn })

// Named timings used across the product (§9 table), so every owner uses the same numbers.
/** List entrance: rows fade up 4px over 120ms, staggered 12ms across the first 12 visible rows. */
export const LIST_STAGGER_MS = 12
export const LIST_STAGGER_ROWS = 12
/** Inspector content swaps: out 70ms, in 120ms. Past 8 changes per second, crossfades are skipped. */
export const SWAP_OUT_MS = 70
export const SWAP_IN_MS = 120
export const SWAP_MAX_PER_SEC = 8
/** Flags: 400ms hover delay, 0ms while another flag is visible. */
export const FLAG_DELAY_MS = 400
/** G-chord window. */
export const CHORD_WINDOW_MS = 1200
/** History: selection changes within this window merge into one entry. */
export const HISTORY_MERGE_MS = 800
/** Long-press on the history buttons. */
export const LONG_PRESS_MS = 400

/** Menus, popovers and the notification drop (§9): enter y −2 → 0 over 120ms, exit over 80ms. */
export const dropMotion = {
  initial: { opacity: 0, y: -2 },
  animate: { opacity: 1, y: 0, transition: fadeIn(120) },
  exit: { opacity: 0, y: -2, transition: fadeOut(80) },
} as const

/** Flags: opacity 0 → 1 over 100ms (rail flags also move x −4 → 0). */
export const flagMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: fadeIn(100) },
  exit: { opacity: 0, transition: fadeOut(60) },
} as const
