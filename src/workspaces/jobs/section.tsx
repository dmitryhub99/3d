import type { CSSProperties } from 'react'
import type { SectionDef } from '../../shell/types'
import { JobReader, JobReaderFoot } from './JobReader'

// Jobs section: registry entry (§5.4, §12.2, §12.3).
// PLACEHOLDER owned by core until the Jobs owner replaces this file. Static values are final;
// Workspace / WorkspaceFoot / Channel / InspectorBody / InspectorFoot / objectOrder are stand-ins.

const quiet: CSSProperties = { padding: '12px 16px', font: 'var(--t-11)', color: 'var(--text-3)' }

const SEGMENTS: Record<string, string> = {
  'recommended': 'Recommended',
  'saved-searches': 'Saved searches',
  'tracked': 'Tracked',
  'applied': 'Applied',
}

const titleize = (id: string) => id.split('-').map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w)).join(' ')

function Workspace() {
  return <div style={quiet}>Jobs workspace</div>
}

function WorkspaceFoot() {
  return <div style={quiet} />
}

const section: SectionDef = {
  id: 'jobs',
  label: 'Jobs',
  icon: 'jobs',
  railGroup: 'work',
  railSection: 'jobs',
  chord: 'J',
  mode: 'index',
  localNav: 'strip',
  inspector: 'reader',
  boot: {
    inspectorOpen: true,
    selection: 'job-halden-principal',
    segment: 'recommended',
    view: 'table',
    channelOpen: false,
  },
  crumbs: (state) => ['Jobs', SEGMENTS[state.segment.jobs] ?? titleize(state.segment.jobs)],
  objectLabel: (id) => titleize(id),
  objectOrder: () => [],
  capActions: [{ id: 'share', label: 'Share' }],
  segmentLabel: (id) => SEGMENTS[id] ?? titleize(id),
  Workspace,
  WorkspaceFoot,
  InspectorBody: JobReader,
  InspectorFoot: JobReaderFoot,
}

export default section
