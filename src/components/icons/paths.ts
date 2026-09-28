// §8.6 glyph table. Every icon is hand-drawn on a 16 grid (the kbd-* glyphs on a 10 grid).
// Strokes are square-capped, miter-joined and non-scaling; widths are set by Icon.tsx per render size.
//
//   paint 'stroke' → outline only (fill none)
//   paint 'fill'   → a filled shape with stroke="none"   (the table's "(fill)")
//   paint 'both'   → filled and stroked (save-filled: "the same path with fill=currentColor")

export type Paint = 'stroke' | 'fill' | 'both'

export type Shape =
  | { d: string; paint?: Paint }
  | { rect: readonly [x: number, y: number, w: number, h: number]; paint?: Paint }

export interface Glyph {
  /** viewBox edge; 16 unless noted. */
  grid?: 10 | 16
  /** Rotation in degrees about the grid centre (kbd arrows). */
  rotate?: number
  shapes: readonly Shape[]
  /** Extra shapes drawn when `filled` is set (save, panel-right). */
  filled?: readonly Shape[]
}

const dot = (x: number, y: number): Shape => ({ rect: [x, y, 2, 2], paint: 'fill' })

const SAVED_D = 'M3.75 2.75H12.25V13.25H9.5V10.75H6.5V13.25H3.75Z'
const KBD_ARROW_D = 'M5 8.5V1.5 M2 4.5l3-3 3 3'

export const ICONS = {
  mark: { shapes: [{ d: 'M12.25 2.75H3.75V7.25 M3.75 13.25H12.25V8.75' }] },
  home: { shapes: [{ d: 'M2.75 3.75H13.25 M2.75 8H9.25 M2.75 12.25H13.25' }] },
  people: { shapes: [{ rect: [2.75, 5.75, 7.5, 7.5] }, { d: 'M5.75 2.75H13.25V10.25' }] },
  companies: {
    shapes: [
      dot(2, 2), dot(7, 2), dot(12, 2), dot(2, 7), dot(12, 7), dot(2, 12), dot(7, 12), dot(12, 12),
      { rect: [6, 6, 4, 4], paint: 'fill' },
    ],
  },
  jobs: { shapes: [{ rect: [2.75, 5.75, 10.5, 7.5] }, { d: 'M6 5.75V3.25H10V5.75' }] },
  projects: { shapes: [{ d: 'M5.25 2.75H2.75V13.25H5.25 M10.75 2.75H13.25V13.25H10.75' }, dot(7, 7)] },
  applications: { shapes: [{ d: 'M2.75 13.25H13.25 M4.75 10.25V13.25 M8 7.25V13.25 M11.25 4.25V13.25' }] },
  hiring: { shapes: [{ d: 'M2.75 3.75H13.25 M4.75 8H11.25 M6.75 12.25H9.25' }] },
  saved: { shapes: [{ d: SAVED_D }], filled: [{ d: SAVED_D, paint: 'both' }] },
  /** Alias of `saved` (the row-hover and inspector "Save" action). */
  save: { shapes: [{ d: SAVED_D }], filled: [{ d: SAVED_D, paint: 'both' }] },
  'save-filled': { shapes: [{ d: SAVED_D, paint: 'both' }] },
  activity: { shapes: [{ d: 'M1.75 8.75H5V4.75H8.5V11.25H11V8.75H14.25' }] },
  settings: { shapes: [{ d: 'M5.5 2.75H10.5L13.25 5.5V10.5L10.5 13.25H5.5L2.75 10.5V5.5Z' }, dot(7, 7)] },
  'chevron-left': { shapes: [{ d: 'M9.75 4.25L6 8L9.75 11.75' }] },
  'chevron-right': { shapes: [{ d: 'M6.25 4.25L10 8L6.25 11.75' }] },
  'chevron-up': { shapes: [{ d: 'M4.25 9.75L8 6L11.75 9.75' }] },
  'chevron-down': { shapes: [{ d: 'M4.25 6.25L8 10L11.75 6.25' }] },
  'arrow-right': { shapes: [{ d: 'M2.75 8H12.25 M8.75 4.5L12.25 8L8.75 11.5' }] },
  /** Mirror of arrow-right (history flags: "← People › All people"). */
  'arrow-left': { shapes: [{ d: 'M13.25 8H3.75 M7.25 4.5L3.75 8L7.25 11.5' }] },
  'arrow-up-right': { shapes: [{ d: 'M5.75 2.75H13.25V10.25 M12.75 3.25L3.25 12.75' }] },
  close: { shapes: [{ d: 'M3.75 3.75L12.25 12.25 M12.25 3.75L3.75 12.25' }] },
  search: { shapes: [{ rect: [2.75, 2.75, 8, 8] }, { d: 'M10.75 10.75L13.25 13.25' }] },
  bell: { shapes: [{ d: 'M4.25 11.25V4.75H11.75V11.25 M2.75 11.25H13.25 M6.75 13.75H9.25 M8 2.25V4.75' }] },
  'panel-right': {
    shapes: [{ rect: [2.75, 2.75, 10.5, 10.5] }, { d: 'M9.75 2.75V13.25' }],
    filled: [{ rect: [9.75, 2.75, 3.5, 10.5], paint: 'fill' }],
  },
  'view-table': { shapes: [{ rect: [2.75, 2.75, 10.5, 10.5] }, { d: 'M2.75 6.25H13.25 M2.75 9.75H13.25' }] },
  'view-compact': { shapes: [{ d: 'M2.75 3.25H13.25 M2.75 6.25H13.25 M2.75 9.25H13.25 M2.75 12.25H13.25' }] },
  'view-gallery': {
    shapes: [
      { rect: [2.75, 2.75, 4, 4] }, { rect: [9.25, 2.75, 4, 4] },
      { rect: [2.75, 9.25, 4, 4] }, { rect: [9.25, 9.25, 4, 4] },
    ],
  },
  'view-board': { shapes: [{ d: 'M2.75 2.75V13.25 M8 2.75V10.25 M13.25 2.75V7.25' }] },
  display: {
    shapes: [
      { d: 'M2.75 5H13.25 M2.75 11H13.25' },
      { rect: [4.75, 3.25, 2.5, 3.5], paint: 'fill' },
      { rect: [8.75, 9.25, 2.5, 3.5], paint: 'fill' },
    ],
  },
  plus: { shapes: [{ d: 'M8 3.25V12.75 M3.25 8H12.75' }] },
  more: { shapes: [dot(3, 7), dot(7, 7), dot(11, 7)] },
  follow: { shapes: [{ rect: [2.75, 4.75, 6.5, 6.5] }, { d: 'M12 5.25V10.25 M9.5 7.75H14.5' }] },
  following: { shapes: [{ rect: [2.75, 4.75, 6.5, 6.5] }, { d: 'M9.5 8L11.25 9.75L14.25 6.75' }] },
  message: { shapes: [{ d: 'M2.75 3.25H13.25V10.75H7.25L4.75 13.25V10.75H2.75Z' }] },
  check: { shapes: [{ d: 'M3.5 8.5L6.25 11.25L12.5 5' }] },
  share: { shapes: [{ d: 'M8 2.75V10.25 M5 5.75L8 2.75L11 5.75 M3.75 8.75V13.25H12.25V8.75' }] },
  export: { shapes: [{ d: 'M8 2.75V10.25 M5 7.25L8 10.25L11 7.25 M2.75 10.75V13.25H13.25V10.75' }] },
  'worked-with': { shapes: [{ d: 'M2.75 5.75H12.75 M10 3L12.75 5.75L10 8.5 M13.25 10.25H3.25 M6 7.5L3.25 10.25L6 13' }] },
  view: { shapes: [{ rect: [2.75, 4.75, 10.5, 6.5] }, dot(7, 7)] },
  calendar: { shapes: [{ rect: [2.75, 3.75, 10.5, 9.5] }, { d: 'M2.75 6.75H13.25 M5.75 2.25V5.25 M10.25 2.25V5.25' }] },
  clock: { shapes: [{ rect: [2.75, 2.75, 10.5, 10.5] }, { d: 'M8 5V8.25H10.75' }] },
  link: { shapes: [{ rect: [2.75, 5.75, 6.5, 4.5] }, { rect: [6.75, 5.75, 6.5, 4.5] }] },
  reply: { shapes: [{ d: 'M2.75 7.75H13.25V12.25 M6 4.5L2.75 7.75L6 11' }] },
  repost: {
    shapes: [{ d: 'M3.75 7.25V3.75H12.25 M10 1.5L12.25 3.75L10 6 M12.25 8.75V12.25H3.75 M6 10L3.75 12.25L6 14.5' }],
  },
  keyboard: { shapes: [{ rect: [1.75, 4.25, 12.5, 7.5] }, { d: 'M4.75 9.25H11.25' }] },

  // ---- key-cap glyphs, 10 grid ----
  'kbd-cmd': {
    grid: 10,
    shapes: [
      {
        d: 'M3.5 3.5h3v3h-3z M3.5 3.5H2a1.5 1.5 0 1 1 1.5-1.5v1.5 M6.5 3.5V2a1.5 1.5 0 1 1 1.5 1.5H6.5 M6.5 6.5H8a1.5 1.5 0 1 1-1.5 1.5V6.5 M3.5 6.5V8a1.5 1.5 0 1 1-1.5-1.5h1.5',
      },
    ],
  },
  'kbd-opt': { grid: 10, shapes: [{ d: 'M1 2.5h3l3 5h2 M6 2.5h3' }] },
  'kbd-shift': { grid: 10, shapes: [{ d: 'M5 1.5L1.5 5h2v3.5h3V5h2Z' }] },
  'kbd-return': { grid: 10, shapes: [{ d: 'M8.5 1.5v4h-7 M3.5 3.5l-2 2 2 2' }] },
  'kbd-backspace': { grid: 10, shapes: [{ d: 'M3.5 2h5v6h-5L1 5Z' }] },
  'kbd-up': { grid: 10, shapes: [{ d: KBD_ARROW_D }] },
  'kbd-down': { grid: 10, rotate: 180, shapes: [{ d: KBD_ARROW_D }] },
  'kbd-left': { grid: 10, rotate: 270, shapes: [{ d: KBD_ARROW_D }] },
  'kbd-right': { grid: 10, rotate: 90, shapes: [{ d: KBD_ARROW_D }] },
} as const satisfies Record<string, Glyph>

export type IconName = keyof typeof ICONS

export const ICON_NAMES = Object.keys(ICONS) as IconName[]
