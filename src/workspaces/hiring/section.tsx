import type { CSSProperties } from 'react'
import type { SectionDef } from '../../shell/types'

// Hiring section: registry entry (§5.4, §12.2, §12.3).
// PLACEHOLDER owned by core until the Hiring owner replaces this file. Static values are final;
// Workspace / WorkspaceFoot / Channel / InspectorBody / InspectorFoot / objectOrder are stand-ins.

const quiet: CSSProperties = { padding: '12px 16px', font: 'var(--t-11)', color: 'var(--text-3)' }

const SEGMENTS: Record<string, string> = {
  'req-t114': 'Staff Designer, Canvas',
  'req-t109': 'Senior Product Designer, Editor',
  'req-t121': 'Design Engineer',
  'req-t098': 'Product Design Intern 2027',
  'req-t117': 'Staff Engineer, Sync',
  'req-t102': 'Engineering Manager, Platform',
}

const titleize = (id: string) => id.split('-').map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w)).join(' ')

function Workspace() {
  return <div style={quiet}>Hiring workspace</div>
}

function WorkspaceFoot() {
  return <div style={quiet} />
}

function Channel() {
  return <div style={quiet}>Requisitions</div>
}

function InspectorBody({ id }: { id: string }) {
  return <div style={quiet}>{id}</div>
}

function InspectorFoot(_: { id: string }) {
  return <div />
}

const section: SectionDef = {
  id: 'hiring',
  label: 'Hiring',
  icon: 'hiring',
  railGroup: 'pipeline',
  railSection: 'hiring',
  chord: 'I',
  mode: 'board',
  localNav: 'channel',
  channelTitle: 'Requisitions',
  inspector: 'peek',
  boot: {
    inspectorOpen: true,
    selection: 'cand-kwame-asante',
    segment: 'req-t114',
    view: 'board',
    channelOpen: true,
  },
  crumbs: (state) => ['Hiring', SEGMENTS[state.segment.hiring] ?? titleize(state.segment.hiring)],
  objectLabel: (id) => titleize(id),
  objectOrder: () => [],
  capActions: [{ id: 'share', label: 'Share' }, { id: 'scorecards', label: 'Scorecards' }],
  segmentLabel: (id) => SEGMENTS[id] ?? titleize(id),
  railCount: 14,
  requiresEmployerSeat: true,
  Workspace,
  WorkspaceFoot,
  Channel,
  InspectorBody,
  InspectorFoot,
}

export default section
