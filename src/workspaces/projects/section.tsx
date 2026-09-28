import type { CSSProperties } from 'react'
import type { SectionDef } from '../../shell/types'

// Projects section: registry entry (§5.4, §12.2, §12.3).
// PLACEHOLDER owned by core until the Projects owner replaces this file. Static values are final;
// Workspace / WorkspaceFoot / Channel / InspectorBody / InspectorFoot / objectOrder are stand-ins.

const quiet: CSSProperties = { padding: '12px 16px', font: 'var(--t-11)', color: 'var(--text-3)' }

const SEGMENTS: Record<string, string> = {
  'marketplace': 'Marketplace',
  'my-briefs': 'My briefs',
  'proposals': 'Proposals',
  'contracts': 'Contracts',
}

const titleize = (id: string) => id.split('-').map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w)).join(' ')

function Workspace() {
  return <div style={quiet}>Projects workspace</div>
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
  id: 'projects',
  label: 'Projects',
  icon: 'projects',
  railGroup: 'work',
  railSection: 'projects',
  chord: 'R',
  mode: 'matrix',
  localNav: 'strip',
  inspector: 'peek',
  boot: {
    inspectorOpen: true,
    selection: 'brief-brisa-audit',
    segment: 'marketplace',
    view: 'gallery',
    channelOpen: false,
  },
  crumbs: (state) => ['Projects', SEGMENTS[state.segment.projects] ?? titleize(state.segment.projects)],
  objectLabel: (id) => titleize(id),
  objectOrder: () => [],
  capActions: [{ id: 'new-brief', label: 'New brief' }],
  segmentLabel: (id) => SEGMENTS[id] ?? titleize(id),
  Workspace,
  WorkspaceFoot,
  InspectorBody,
  InspectorFoot,
}

export default section
