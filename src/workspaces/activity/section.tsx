import type { CSSProperties } from 'react'
import type { SectionDef } from '../../shell/types'

// Activity section: registry entry (§5.4, §12.2, §12.3).
// PLACEHOLDER owned by core until the Activity owner replaces this file. Static values are final;
// Workspace / WorkspaceFoot / Channel / InspectorBody / InspectorFoot / objectOrder are stand-ins.

const quiet: CSSProperties = { padding: '12px 16px', font: 'var(--t-11)', color: 'var(--text-3)' }

const SEGMENTS: Record<string, string> = {
  'all': 'All',
  'mentions': 'Mentions',
  'profile-views': 'Profile views',
  'applications': 'Applications',
  'hiring': 'Hiring',
}

const titleize = (id: string) => id.split('-').map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w)).join(' ')

function Workspace() {
  return <div style={quiet}>Activity workspace</div>
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
  id: 'activity',
  label: 'Activity',
  icon: 'activity',
  railGroup: 'you',
  railSection: 'activity',
  chord: 'N',
  mode: 'stream',
  localNav: 'strip',
  inspector: 'peek',
  boot: {
    inspectorOpen: false,
    selection: null,
    segment: 'all',
    view: 'stream',
    channelOpen: false,
  },
  crumbs: (state) => ['Activity', SEGMENTS[state.segment.activity] ?? titleize(state.segment.activity)],
  objectLabel: (id) => titleize(id),
  objectOrder: () => [],
  capActions: [{ id: 'mark-all-read', label: 'Mark all read' }],
  segmentLabel: (id) => SEGMENTS[id] ?? titleize(id),
  Workspace,
  WorkspaceFoot,
  InspectorBody,
  InspectorFoot,
}

export default section
