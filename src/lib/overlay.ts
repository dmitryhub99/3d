// Portal root for menus, flags, popovers, the palette list, the notification drop and the keyboard sheet.
// It is a zero-size box at the stage's top left (inside the scaled stage), so an overlay positioned with
// `position: absolute` (or `fixed`) and stage-coordinate left/top lands exactly where the spec says,
// at any stage scale. It creates no stacking context: overlays use the --z-* tokens directly.
//
//   import { createPortal } from 'react-dom'
//   createPortal(<div className={s.menu} style={{ left, top }} />, getOverlayRoot())
export const OVERLAY_ROOT_ID = 'strivo-overlays'

export function getOverlayRoot(): HTMLElement {
  return document.getElementById(OVERLAY_ROOT_ID) ?? document.body
}
