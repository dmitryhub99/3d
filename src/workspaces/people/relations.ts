// Follow / save state for people, shared by rows and the inspector.
import { useSyncExternalStore } from 'react'
import { allPeople } from '../../data/people'

const following = new Set(allPeople.filter((p) => p.following).map((p) => p.id))
const saved = new Set(allPeople.filter((p) => p.saved).map((p) => p.id))
const listeners = new Set<() => void>()
let version = 0

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
const emit = () => {
  version++
  listeners.forEach((l) => l())
}

export function toggleFollow(id: string) {
  if (following.has(id)) following.delete(id)
  else following.add(id)
  emit()
}

export function toggleSaved(id: string) {
  if (saved.has(id)) saved.delete(id)
  else saved.add(id)
  emit()
}

export function useFollowing(id: string): boolean {
  useSyncExternalStore(subscribe, () => version)
  return following.has(id)
}

export function useSaved(id: string): boolean {
  useSyncExternalStore(subscribe, () => version)
  return saved.has(id)
}
