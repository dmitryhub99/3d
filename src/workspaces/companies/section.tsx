import type { CSSProperties } from 'react'
import type { SectionDef } from '../../shell/types'

// Companies section: registry entry (§5.4, §12.2, §12.3).
// PLACEHOLDER owned by core until the Companies owner replaces this file. Static values are final;
// Workspace / WorkspaceFoot / Channel / InspectorBody / InspectorFoot / objectOrder are stand-ins.

const quiet: CSSProperties = { padding: '12px 16px', font: 'var(--t-11)', color: 'var(--text-3)' }

const SEGMENTS: Record<string, string> = {
  'following': 'Following',
  'hiring-now': 'Hiring now',
  'design-led': 'Design-led',
  'fintech-emea': 'Fintech · EMEA',
}

const titleize = (id: string) => id.split('-').map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w)).join(' ')

function Workspace() {
  return <div style={quiet}>Companies workspace</div>
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
  id: 'companies',
  label: 'Companies',
  icon: 'companies',
  railGroup: 'network',
  railSection: 'companies',
  chord: 'C',
  mode: 'matrix',
  localNav: 'strip',
  inspector: 'peek',
  boot: {
    inspectorOpen: true,
    selection: 'halden',
    segment: 'hiring-now',
    view: 'gallery',
    channelOpen: false,
  },
  crumbs: (state) => ['Companies', SEGMENTS[state.segment.companies] ?? titleize(state.segment.companies)],
  objectLabel: (id) => titleize(id),
  objectOrder: () => [],
  capActions: [{ id: 'share', label: 'Share' }],
  segmentLabel: (id) => SEGMENTS[id] ?? titleize(id),
  Workspace,
  WorkspaceFoot,
  InspectorBody,
  InspectorFoot,
}

export default section
