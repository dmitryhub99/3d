// useLayout(): computeLayout for the current section at the live stage width.
import { useMemo } from 'react'
import { computeLayout, type Layout } from '../lib/layout'
import { useStage } from '../lib/stage'
import { sections } from '../shell/sections'
import { useApp } from './store'
import type { SectionId } from './types'

export function useLayout(sectionId?: SectionId): Layout {
  const { width } = useStage()
  const current = useApp((s) => s.section)
  const id = sectionId ?? current
  const channelOpen = useApp((s) => s.channelOpen[id])
  const channelForced = useApp((s) => s.channelForced[id])
  const inspectorOpen = useApp((s) => s.inspectorOpen[id])
  const inspectorWidth = useApp((s) => s.inspectorWidth[id])
  return useMemo(
    () =>
      computeLayout(width, sections[id], {
        channelOpen: { [id]: channelOpen } as Record<SectionId, boolean>,
        channelForced: { [id]: channelForced } as Record<SectionId, boolean>,
        inspectorOpen: { [id]: inspectorOpen } as Record<SectionId, boolean>,
        inspectorWidth: { [id]: inspectorWidth } as Record<SectionId, number>,
      }),
    [width, id, channelOpen, channelForced, inspectorOpen, inspectorWidth],
  )
}
