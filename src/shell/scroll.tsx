// Scroll-container registry. The active workspace registers its scrolling rows container so the shell's
// TetherNotch can find `[data-object-id="…"]` inside it and follow scroll.
//
//   // in a workspace
//   const registerRows = useRegisterScrollContainer()
//   <div ref={registerRows} className={s.rows}>…</div>
//
//   // in the shell
//   const el = useScrollContainer()   // HTMLElement | null, re-renders when it changes
import { createContext, useCallback, useContext, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'

interface ScrollRegistry {
  element: HTMLElement | null
  setElement: Dispatch<SetStateAction<HTMLElement | null>>
}

const ScrollContext = createContext<ScrollRegistry | null>(null)

export function ScrollContainerProvider({ children }: { children?: ReactNode }) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  return <ScrollContext.Provider value={{ element, setElement }}>{children}</ScrollContext.Provider>
}

/** Callback ref that registers the element as the active workspace's scroll container while mounted. */
export function useRegisterScrollContainer(): (node: HTMLElement | null) => void {
  const ctx = useContext(ScrollContext)
  const mine = useRef<HTMLElement | null>(null)
  const setElement = ctx?.setElement
  return useCallback(
    (node: HTMLElement | null) => {
      if (!setElement) return
      if (node) {
        mine.current = node
        setElement(node)
      } else {
        const prev = mine.current
        mine.current = null
        // only clear if nobody else registered in the meantime (section switches overlap under AnimatePresence)
        setElement((cur) => (cur === prev ? null : cur))
      }
    },
    [setElement],
  )
}

/** The registered scroll container of the active workspace, or null. */
export function useScrollContainer(): HTMLElement | null {
  return useContext(ScrollContext)?.element ?? null
}
