import type { CSSProperties } from 'react'
import type { SectionDef } from '../../shell/types'

// Saved section: registry entry (§5.4, §12.2, §12.3).
// PLACEHOLDER owned by core until the Saved owner replaces this file. Static values are final;
// Workspace / WorkspaceFoot / Channel / InspectorBody / InspectorFoot / objectOrder are stand-ins.

const quiet: CSSProperties = { padding: '12px 16px', font: 'var(--t-11)', color: 'var(--text-3)' }

const SEGMENTS: Record<string, string> = {
  'all-saved': 'All saved',
  'shortlist-canvas': 'Shortlist · Canvas',
  'reading': 'Reading',
  'companies-to-watch': 'Companies to watch',
  'jobs': 'Jobs',
  'projects': 'Projects',
}

const titleize = (id: string) => id.split('-').map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w)).join(' ')

function Workspace() {
  return <div style={quiet}>Saved workspace</div>
}

function WorkspaceFoot() {
  return <div style={quiet} />
}

function Channel() {
  return <div style={quiet}>Collections</div>
}

function InspectorBody({ id }: { id: string }) {
  return <div style={quiet}>{id}</div>
}

function InspectorFoot(_: { id: string }) {
  return <div />
}

const section: SectionDef = {
  id: 'saved',
  label: 'Saved',
  icon: 'saved',
  railGroup: 'you',
  railSection: 'saved',
  chord: 'S',
  mode: 'index',
  localNav: 'channel',
  channelTitle: 'Collections',
  inspector: 'peek',
  boot: {
    inspectorOpen: false,
    selection: null,
    segment: 'all-saved',
    view: 'table',
    channelOpen: true,
  },
  crumbs: (state) => ['Saved', SEGMENTS[state.segment.saved] ?? titleize(state.segment.saved)],
  objectLabel: (id) => titleize(id),
  objectOrder: () => [],
  capActions: [{ id: 'new-collection', label: 'New collection' }],
  segmentLabel: (id) => SEGMENTS[id] ?? titleize(id),
  Workspace,
  WorkspaceFoot,
  Channel,
  InspectorBody,
  InspectorFoot,
}

export default section
