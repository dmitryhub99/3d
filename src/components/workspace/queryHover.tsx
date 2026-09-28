import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

/** Who is hovering: a query clause, a row's fit tick, or a line of the inspector's Fit block. */
export type QueryHoverSource = 'clause' | 'tick' | 'fit'

export interface QueryHoverValue {
  /** 0-based clause position (= tick position) under the pointer, or null. */
  hovered: number | null
  source: QueryHoverSource | null
  setHovered: (index: number | null, source?: QueryHoverSource) => void
}

const NOOP: QueryHoverValue = { hovered: null, source: null, setHovered: () => {} }

/**
 * Links the query line, every row's FitTicks and the inspector's Fit block (§6.6, §10:
 * "hovering any one highlights the other two"). Without a provider every consumer is inert.
 */
export const QueryHoverContext = createContext<QueryHoverValue>(NOOP)

export function QueryHoverProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ hovered: number | null; source: QueryHoverSource | null }>({
    hovered: null,
    source: null,
  })
  const setHovered = useCallback((index: number | null, source: QueryHoverSource = 'clause') => {
    setState((prev) =>
      prev.hovered === index && prev.source === (index === null ? null : source)
        ? prev
        : { hovered: index, source: index === null ? null : source },
    )
  }, [])
  const value = useMemo(() => ({ ...state, setHovered }), [state, setHovered])
  return <QueryHoverContext.Provider value={value}>{children}</QueryHoverContext.Provider>
}

export const useQueryHover = () => useContext(QueryHoverContext)
