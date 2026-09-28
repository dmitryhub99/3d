// History (§10.3).
//   Entry: { section, segmentId, subjectId, inspectorOpen } (+ at, kind).
//   Pushed on: a section switch, a segment change, inspector open or close, a selection change, opening the full profile.
//   A selection change within 800ms of the previous one, in the same section, replaces the top entry (J/K runs merge).
//   Space peeks are not recorded. Back and Forward restore all four fields. The stack is capped at 50 entries.
import { HISTORY_MERGE_MS } from '../lib/motion'
import type { AppState, HistoryEntry, HistoryKind } from './types'

export const HISTORY_CAP = 50

export function entryOf(state: AppState, kind: HistoryKind, at: number): HistoryEntry {
  const section = state.section
  return {
    section,
    segmentId: state.segment[section],
    subjectId: state.selection[section],
    inspectorOpen: state.inspectorOpen[section],
    at,
    kind,
  }
}

export const sameEntry = (a: HistoryEntry, b: HistoryEntry) =>
  a.section === b.section && a.segmentId === b.segmentId && a.subjectId === b.subjectId && a.inspectorOpen === b.inspectorOpen

/**
 * Record `next` in its own history. `prev` is the state before the action (used for the 800ms merge rule).
 * Selection changes (kind 'object') merge into the top entry when the previous selection change in the
 * same section happened less than 800ms ago.
 */
export function record(prev: AppState, next: AppState, kind: HistoryKind, now: number): AppState {
  const entry = entryOf(next, kind, now)
  const { stack, index } = next.history
  const top = stack[index]
  if (top && sameEntry(top, entry)) return next
  const merge =
    kind === 'object' &&
    top !== undefined &&
    top.kind === 'object' &&
    top.section === entry.section &&
    prev.lastSelectAt > 0 &&
    now - prev.lastSelectAt < HISTORY_MERGE_MS
  let nextStack: HistoryEntry[]
  if (merge) {
    nextStack = stack.slice(0, index + 1)
    nextStack[index] = entry
  } else {
    nextStack = [...stack.slice(0, index + 1), entry]
    if (nextStack.length > HISTORY_CAP) nextStack = nextStack.slice(nextStack.length - HISTORY_CAP)
  }
  return { ...next, history: { stack: nextStack, index: nextStack.length - 1 } }
}

export const canGoBack = (h: AppState['history']) => h.index > 0
export const canGoForward = (h: AppState['history']) => h.index < h.stack.length - 1

/** Apply a history entry's four fields to the state and move the index. */
export function restore(state: AppState, index: number): AppState {
  const entry = state.history.stack[index]
  if (!entry || index === state.history.index) return state
  const s = entry.section
  return {
    ...state,
    section: s,
    segment: { ...state.segment, [s]: entry.segmentId },
    selection: { ...state.selection, [s]: entry.subjectId },
    inspectorOpen: { ...state.inspectorOpen, [s]: entry.inspectorOpen },
    palette: state.palette.open ? { open: false, query: '', highlight: 0 } : state.palette,
    drop: null,
    chord: null,
    lastSelectAt: 0,
    history: { stack: state.history.stack, index },
  }
}

/** The entry Back would restore, or null. */
export const backTarget = (h: AppState['history']) => (h.index > 0 ? h.stack[h.index - 1] ?? null : null)
/** The entry Forward would restore, or null. */
export const forwardTarget = (h: AppState['history']) => (h.index < h.stack.length - 1 ? h.stack[h.index + 1] ?? null : null)
