import type { CSSProperties } from 'react'
import type { SectionDef } from '../../shell/types'

// Applications section: registry entry (§5.4, §12.2, §12.3).
// PLACEHOLDER owned by core until the Applications owner replaces this file. Static values are final;
// Workspace / WorkspaceFoot / Channel / InspectorBody / InspectorFoot / objectOrder are stand-ins.

const quiet: CSSProperties = { padding: '12px 16px', font: 'var(--t-11)', color: 'var(--text-3)' }

const SEGMENTS: Record<string, string> = {
  'active': 'Active',
  'drafts': 'Drafts',
  'archived': 'Archived',
}

const titleize = (id: string) => id.split('-').map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w)).join(' ')

function Workspace() {
  return <div style={quiet}>Applications workspace</div>
}

function WorkspaceFoot() {
  return <div style={quiet} />
}

function InspectorBody({ id }: { id: string }) {
  return <div style={quiet}>{id}</div>
}

function InspectorFoot(_: { id: string }) {
  return <div />
}

const section: SectionDef = {
  id: 'applications',
  label: 'Applications',
  icon: 'applications',
  railGroup: 'pipeline',
  railSection: 'applications',
  chord: 'A',
  mode: 'index',
  localNav: 'strip',
  inspector: 'peek',
  boot: {
    inspectorOpen: true,
    selection: 'app-oriel-head',
    segment: 'active',
    view: 'table',
    channelOpen: false,
  },
  crumbs: (state) => ['Applications', SEGMENTS[state.segment.applications] ?? titleize(state.segment.applications)],
  objectLabel: (id) => titleize(id),
  objectOrder: () => [],
  capActions: [{ id: 'export', label: 'Export' }],
  segmentLabel: (id) => SEGMENTS[id] ?? titleize(id),
  railCount: 2,
  Workspace,
  WorkspaceFoot,
  InspectorBody,
  InspectorFoot,
}

export default section
