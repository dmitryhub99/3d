// URL sync (§12.4). After boot, mirror ?section=<id> (plus &p=<id> in People) with history.replaceState.
// Never pushes browser history. A later `hashchange` (#people, #jobs…) dispatches `navigate`.
import { useEffect } from 'react'
import { isSectionId } from '../lib/boot'
import { useApp, useDispatch } from './store'

export function urlFor(section: string, person: string | null): string {
  const params = new URLSearchParams()
  params.set('section', section)
  if (section === 'people' && person) params.set('p', person)
  return `${window.location.pathname}?${params.toString()}`
}

/** Mount once, in the shell. */
export function useUrlSync(): void {
  const section = useApp((s) => s.section)
  const person = useApp((s) => s.selection.people)
  const dispatch = useDispatch()

  useEffect(() => {
    const url = urlFor(section, person)
    const current = window.location.pathname + window.location.search
    if (url !== current || window.location.hash) {
      try {
        window.history.replaceState(window.history.state, '', url)
      } catch {
        // sandboxed frames may refuse replaceState; the app state is unaffected
      }
    }
  }, [section, person])

  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.replace(/^#/, '')
      if (isSectionId(id)) dispatch({ type: 'navigate', section: id })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [dispatch])
}
