// The app store: one external store read through useSyncExternalStore with memoized selectors,
// so a row that selects `s.selection.people === id` re-renders only when that boolean flips.
import { createContext, useContext, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { sections } from '../shell/sections'
import { createInitialState, createReducer } from './reducer'
import type { Action, AppState, BootParams, SectionId } from './types'
import type { SectionDef } from '../shell/types'

export type Dispatch = (action: Action) => void

export interface Store {
  getState(): AppState
  dispatch: Dispatch
  subscribe(listener: () => void): () => void
}

export function createStore(boot: BootParams): Store {
  const reduce = createReducer(sections)
  let state = createInitialState(boot, sections, Date.now())
  const listeners = new Set<() => void>()
  return {
    getState: () => state,
    dispatch(action) {
      const next = reduce(state, action, Date.now())
      if (next === state) return
      state = next
      listeners.forEach((l) => l())
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ initial, children }: { initial: BootParams; children?: ReactNode }) {
  const [store] = useState(() => {
    const s = createStore(initial)
    if (typeof window !== 'undefined') (window as unknown as { __strivo?: Store }).__strivo = s
    return s
  })
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

/** The store object, for imperative reads (event handlers) without subscribing. */
export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore: missing <StoreProvider>')
  return store
}

/**
 * Subscribe to a slice of state. Re-renders only when the selected value changes by `isEqual`
 * (default Object.is). Inline selectors are fine; selectors may close over props.
 * For derived objects/arrays pass `shallowEqual` (or return primitives).
 */
export function useApp<T>(selector: (state: AppState) => T, isEqual: (a: T, b: T) => boolean = Object.is): T {
  const store = useStore()
  const memo = useRef<{ state: AppState; selector: (state: AppState) => T; value: T } | null>(null)
  const getSnapshot = () => {
    const state = store.getState()
    const m = memo.current
    if (m && m.state === state && m.selector === selector) return m.value
    const next = selector(state)
    const value = m && isEqual(m.value, next) ? m.value : next
    memo.current = { state, selector, value }
    return value
  }
  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
}

export function useDispatch(): Dispatch {
  return useStore().dispatch
}

/** The current section id. */
export const useSection = (): SectionId => useApp((s) => s.section)

/** The current section's registry entry. */
export function useSectionDef(): SectionDef {
  return sections[useSection()]
}

/** Shallow equality for arrays and plain objects (one level). */
export function shallowEqual<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) return false
    return true
  }
  const ka = Object.keys(a as object)
  const kb = Object.keys(b as object)
  if (ka.length !== kb.length) return false
  for (const k of ka) {
    if (!Object.is((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])) return false
  }
  return true
}
