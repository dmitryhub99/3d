import type { CSSProperties } from 'react'
import type { SectionDef } from '../../shell/types'

// Home section: registry entry (§5.4, §12.2, §12.3).
// PLACEHOLDER owned by core until the Home owner replaces this file. Static values are final;
// Workspace / WorkspaceFoot / Channel / InspectorBody / InspectorFoot / objectOrder are stand-ins.

const quiet: CSSProperties = { padding: '12px 16px', font: 'var(--t-11)', color: 'var(--text-3)' }

const SEGMENTS: Record<string, string> = {
  'following': 'Following',
  'your-field': 'Your field',
  'companies': 'Companies',
  'saved-searches': 'Saved searches',
}

const titleize = (id: string) => id.split('-').map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w)).join(' ')

function Workspace() {
  return <div style={quiet}>Home workspace</div>
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
  id: 'home',
  label: 'Home',
  icon: 'home',
  railGroup: 'network',
  railSection: 'home',
  chord: 'H',
  mode: 'stream',
  localNav: 'strip',
  inspector: 'peek',
  boot: {
    inspectorOpen: false,
    selection: null,
    segment: 'following',
    view: 'stream',
    channelOpen: false,
  },
  crumbs: (state) => ['Home', SEGMENTS[state.segment.home] ?? titleize(state.segment.home)],
  objectLabel: (id) => titleize(id),
  objectOrder: () => [],
  capActions: [{ id: 'new-post', label: 'New post' }],
  segmentLabel: (id) => SEGMENTS[id] ?? titleize(id),
  Workspace,
  WorkspaceFoot,
  InspectorBody,
  InspectorFoot,
}

export default section
