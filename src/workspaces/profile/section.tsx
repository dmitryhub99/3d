import type { CSSProperties } from 'react'
import type { SectionDef } from '../../shell/types'

// Profile section: registry entry (§5.4, §12.2, §12.3).
// PLACEHOLDER owned by core until the Profile owner replaces this file. Static values are final;
// Workspace / WorkspaceFoot / Channel / InspectorBody / InspectorFoot / objectOrder are stand-ins.

const quiet: CSSProperties = { padding: '12px 16px', font: 'var(--t-11)', color: 'var(--text-3)' }

const SEGMENTS: Record<string, string> = {
  'overview': 'Overview',
  'experience': 'Experience',
  'selected-work': 'Selected work',
  'writing': 'Writing',
  'skills': 'Skills',
  'recommendations': 'Recommendations',
}

const titleize = (id: string) => id.split('-').map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w)).join(' ')

function Workspace() {
  return <div style={quiet}>Profile workspace</div>
}

function WorkspaceFoot() {
  return <div style={quiet} />
}

function Channel() {
  return <div style={quiet}>Outline</div>
}

const section: SectionDef = {
  id: 'profile',
  label: 'Profile',
  icon: 'people',
  railGroup: null,
  railSection: 'people',
  chord: 'M',
  mode: 'sheet',
  localNav: 'channel',
  channelTitle: 'Outline',
  inspector: 'none',
  boot: {
    inspectorOpen: false,
    selection: 'maren-aaltonen',
    segment: 'overview',
    view: 'sheet',
    channelOpen: true,
  },
  crumbs: (state) => ['People', titleize(state.selection.profile ?? 'maren-aaltonen')],
  objectLabel: (id) => titleize(id),
  objectOrder: () => [],
  capActions: [{ id: 'share', label: 'Share' }, { id: 'copy-link', label: 'Copy link' }],
  segmentLabel: (id) => SEGMENTS[id] ?? titleize(id),
  Workspace,
  WorkspaceFoot,
  Channel,
}

export default section
