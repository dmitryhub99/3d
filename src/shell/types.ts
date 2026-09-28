// shell/types.ts — the section contract (§12.2), plus the wiring fields marked "core extension".
import type { ComponentType } from 'react'
import type { Mode } from '../lib/geometry'
import type { Action, AppState, SectionId, ViewId } from '../state/types'

export type { Mode }
export type InspectorClass = 'none' | 'peek' | 'reader'
export type RailGroup = 'network' | 'work' | 'pipeline' | 'you'

/** Icon names a section can use in the rail (a subset of the §8.6 IconName union in components/icons). */
export type SectionIcon =
  | 'home' | 'people' | 'companies' | 'jobs' | 'projects' | 'applications' | 'hiring' | 'saved' | 'activity'

export interface CapAction {
  id: string
  label: string
  key?: string
}

export interface SectionBoot {
  inspectorOpen: boolean
  selection: string | null
  segment: string
  view: ViewId
  channelOpen: boolean
}

export interface SectionDef {
  id: SectionId
  label: string
  icon: SectionIcon
  railGroup: RailGroup | null                                 // profile: null (rail notch stays on People)
  railSection: SectionId                                      // which rail item is selected (profile → 'people')
  chord: string                                               // 'P' for G P
  mode: Mode
  localNav: 'strip' | 'channel'
  channelTitle?: string
  inspector: InspectorClass
  boot: SectionBoot
  crumbs(state: AppState): string[]                           // workspace-cap crumbs, max 2
  objectLabel(id: string): string                             // inspector crumb
  objectOrder(state: AppState): string[]                      // for J/K and "n/total"
  capActions: CapAction[]
  Workspace: ComponentType                                    // renders the workspace body (bands + scroll container)
  WorkspaceFoot: ComponentType                                // readout + key hints, or the action strip
  Channel?: ComponentType
  InspectorBody?: ComponentType<{ id: string }>
  InspectorFoot?: ComponentType<{ id: string }>

  // ---- core extensions (wiring) ----
  /** Overrides MODE_MIN[mode] for the yield order. */
  modeMinWidth?: number
  /** Mono count shown on the rail item (§3: Applications 2, Hiring 14). */
  railCount?: number
  /** The rail item exists only when the viewer holds an employer seat (Hiring, D18). */
  requiresEmployerSeat?: boolean
  /** Human label for a segment / collection / requisition id (history menu, palette). */
  segmentLabel?(id: string): string
  /** Cap actions for the current state, when they change (People: Export → Compare (n) while 2–4 rows are checked). Falls back to capActions. */
  capActionsFor?(state: AppState): CapAction[]
  /** Called when a cap action button is clicked (the shell passes the store's dispatch and current state). */
  onCapAction?(actionId: string, dispatch: (action: Action) => void, state: AppState): void
}

export type SectionRegistry = Record<SectionId, SectionDef>
