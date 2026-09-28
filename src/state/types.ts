// state/types.ts — §12.3, verbatim, plus the extensions marked "core extension".
// Extensions are additive: every field and action from the spec keeps its exact shape.

export type SectionId = 'home' | 'people' | 'jobs' | 'companies' | 'projects' | 'applications' | 'hiring' | 'saved' | 'activity' | 'profile'
export type ViewId = 'table' | 'compact' | 'gallery' | 'board' | 'stream' | 'sheet'

/** core extension: what kind of change produced a history entry (the history menu shows a glyph per kind). */
export type HistoryKind = 'section' | 'segment' | 'object' | 'inspector'

export interface HistoryEntry {
  section: SectionId
  segmentId: string
  subjectId: string | null
  inspectorOpen: boolean
  at: number
  kind: HistoryKind // core extension
}

export interface AppState {
  section: SectionId
  segment: Record<SectionId, string>            // active segment / collection / requisition id
  selection: Record<SectionId, string | null>   // object bound to the inspector (persists when closed)
  checked: Record<SectionId, string[]>          // multi-select
  inspectorOpen: Record<SectionId, boolean>
  inspectorWidth: Record<SectionId, number>     // default 400 (peek) / 560 (reader)
  channelOpen: Record<SectionId, boolean>       // preference; computeLayout folds it when the yield order requires
  view: Record<SectionId, ViewId>
  palette: { open: boolean; query: string; highlight: number }
  drop: null | 'notifications' | 'account' | 'history'
  keyboardSheet: boolean
  resize: null | { from: number; to: number }
  history: { stack: HistoryEntry[]; index: number }
  lastSelectAt: number

  /** core extension: the user explicitly opened a channel that the yield order had folded (`[` in Hiring). computeLayout then keeps it. */
  channelForced: Record<SectionId, boolean>
  /** core extension: a pending G-chord ('g' while the 1200ms window is open). The rail shows chord hints while set. */
  chord: 'g' | null
}

export type Action =
  | { type: 'navigate'; section: SectionId }                          // pushes history
  | { type: 'setSegment'; section: SectionId; segmentId: string; record?: boolean }     // pushes history (record: false = no history, e.g. scroll-spy)
  | { type: 'select'; section: SectionId; id: string; via: 'click' | 'key' | 'peek' }  // key: merge within 800ms; peek: no history
  | { type: 'step'; delta: 1 | -1 }                                   // J/K in the current section's objectOrder
  | { type: 'toggleInspector'; open?: boolean; via?: 'peek' }         // via 'peek' (Space) writes no history
  | { type: 'setInspectorWidth'; section: SectionId; width: number }
  | { type: 'toggleChannel'; folded?: boolean }                       // folded: the channel is currently folded by the yield order
  | { type: 'toggleCheck'; id: string; extend?: boolean }             // extend: add only, never uncheck
  | { type: 'clearChecks' }
  | { type: 'setView'; view: ViewId }
  | { type: 'openPalette' } | { type: 'closePalette' } | { type: 'paletteQuery'; query: string } | { type: 'paletteMove'; delta: 1 | -1; count?: number }
  | { type: 'openDrop'; drop: AppState['drop'] } | { type: 'closeDrop' }
  | { type: 'back' } | { type: 'forward' }
  | { type: 'resize'; value: AppState['resize'] }
  // ---- core extensions ----
  | { type: 'openObject'; section: SectionId; id: string }           // switch section (if needed), select, open its inspector: one history entry
  | { type: 'extendCheck'; delta: 1 | -1 }                            // ⇧J / ⇧K: check the current row, move, check the next
  | { type: 'setChecks'; ids: string[] }                              // replace the current section's checks
  | { type: 'paletteHighlight'; index: number }                       // pointer hover in the palette list
  | { type: 'toggleKeyboardSheet'; open?: boolean }
  | { type: 'escape' }                                                // global Esc ladder (§10.4, §6.9)
  | { type: 'chord'; value: 'g' | null }
  | { type: 'goto'; index: number }                                   // jump to a history index (history menu)

/** Boot parameters parsed from the URL (§12.4). */
export interface BootParams {
  section: SectionId
  /** false when ?inspector=0 (the boot section's inspector starts closed, selection kept); true for ?inspector=1; null when absent. */
  inspectorOpen: boolean | null
  /** ?palette=1 */
  palette: boolean
  /** ?p=<personId>: overrides the People selection. */
  person: string | null
}
