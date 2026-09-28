// computeLayout: column widths for the current section at a given stage width (§5.1).
//
// Yield order, applied whenever viewport − rail − channel − inspector < mode min:
//   1. the channel folds to 0 (its selection stays in the address line)          ← here
//   2. the mode yields its low-priority parts (columns, margin, tile column, lanes) ← the workspace, using workspaceW
//   3. the inspector narrows toward 360                                            ← here
// Nothing overlays the work surface and nothing scrolls horizontally.
import type { AppState, SectionId } from '../state/types'
import type { SectionDef } from '../shell/types'
import { CHANNEL_W, GLOBAL_ZONE_W, INSPECTOR_MAX, INSPECTOR_MIN, MODE_MIN, RAIL_W, clamp, inspectorDefault } from './geometry'

export interface Layout {
  railW: number
  channelW: number
  workspaceW: number
  inspectorW: number
  /** The section has a channel and wants it open, but the yield order folded it. */
  channelFolded: boolean
  /** The section's channel is visible. */
  channelVisible: boolean
  /** The inspector column is rendered at inspectorW (the section has one and it is open). */
  inspectorVisible: boolean
  /** The mode min width that drives the yield order. */
  modeMin: number
  /** Largest inspector width the resize handle may reach right now. */
  inspectorMax: number
  /** x of the workspace's left and right edges on the stage (right = the inspector separator when open). */
  workspaceLeft: number
  workspaceRight: number
  /** x where the global zone starts (stage width − 112). The workspace cap stops here when the inspector is closed. */
  globalZoneX: number
}

type LayoutState = Pick<AppState, 'channelOpen' | 'inspectorOpen' | 'inspectorWidth'> & Partial<Pick<AppState, 'channelForced'>>

export function computeLayout(viewportW: number, def: SectionDef, state: LayoutState): Layout {
  const id: SectionId = def.id
  const modeMin = def.modeMinWidth ?? MODE_MIN[def.mode]
  const hasChannel = def.localNav === 'channel'
  const wantsChannel = hasChannel && !!state.channelOpen[id]
  const forced = !!state.channelForced?.[id]
  const hasInspector = def.inspector !== 'none'
  const inspectorVisible = hasInspector && !!state.inspectorOpen[id]
  const preferredInspector = inspectorVisible
    ? clamp(state.inspectorWidth[id] || inspectorDefault(def.inspector), INSPECTOR_MIN, INSPECTOR_MAX)
    : 0

  let channelW = wantsChannel ? CHANNEL_W : 0
  let inspectorW = preferredInspector
  let channelFolded = false

  // 1. the channel folds (unless the user explicitly forced it open)
  if (channelW && !forced && viewportW - RAIL_W - channelW - inspectorW < modeMin) {
    channelW = 0
    channelFolded = true
  }
  // 3. the inspector narrows toward 360
  if (inspectorW && viewportW - RAIL_W - channelW - inspectorW < modeMin) {
    inspectorW = Math.max(INSPECTOR_MIN, viewportW - RAIL_W - channelW - modeMin)
  }

  const workspaceW = Math.max(0, viewportW - RAIL_W - channelW - inspectorW)
  const inspectorMax = Math.max(INSPECTOR_MIN, Math.min(INSPECTOR_MAX, viewportW - RAIL_W - channelW - modeMin))
  const workspaceLeft = RAIL_W + channelW

  return {
    railW: RAIL_W,
    channelW,
    workspaceW,
    inspectorW,
    channelFolded,
    channelVisible: channelW > 0,
    inspectorVisible,
    modeMin,
    inspectorMax,
    workspaceLeft,
    workspaceRight: workspaceLeft + workspaceW,
    globalZoneX: viewportW - GLOBAL_ZONE_W,
  }
}
