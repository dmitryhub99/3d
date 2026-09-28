import type { CSSProperties } from 'react'
import type { SectionDef } from '../../shell/types'
import { PersonInspector, PersonInspectorFoot } from './PersonInspector'

// People section: registry entry (§5.4, §12.2, §12.3).
// PLACEHOLDER owned by core until the People owner replaces this file. Static values are final;
// Workspace / WorkspaceFoot / Channel / InspectorBody / InspectorFoot / objectOrder are stand-ins.

const quiet: CSSProperties = { padding: '12px 16px', font: 'var(--t-11)', color: 'var(--text-3)' }

const SEGMENTS: Record<string, string> = {
  'all-people': 'All people',
  'design-leads-emea': 'Design leads · EMEA',
  'following': 'Following',
  'warm-intros': 'Warm intros',
  'open-to-contract': 'Open to contract',
}

const titleize = (id: string) => id.split('-').map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w)).join(' ')

const ORDER = [
  'aurelien-duclos', 'tove-lindqvist', 'kwame-asante', 'maren-aaltonen',
  'wanjiru-kamau', 'mateusz-krol', 'aiko-mori', 'priya-raman',
  'eleni-papadaki', 'amara-okafor', 'lucia-ferrer', 'samir-benali',
  'dmytro-shevchenko', 'giulia-romano', 'omar-farouk', 'beatriz-costa',
  'sigridur-jonsdottir', 'kristjan-tamm', 'felix-braun', 'hana-nguyen',
  'lea-moreau', 'yusuf-adeyemi',
]

function Workspace() {
  return <div style={quiet}>People workspace</div>
}

function WorkspaceFoot() {
  return <div style={quiet} />
}

const section: SectionDef = {
  id: 'people',
  label: 'People',
  icon: 'people',
  railGroup: 'network',
  railSection: 'people',
  chord: 'P',
  mode: 'index',
  localNav: 'strip',
  inspector: 'peek',
  boot: {
    inspectorOpen: true,
    selection: 'maren-aaltonen',
    segment: 'design-leads-emea',
    view: 'table',
    channelOpen: false,
  },
  crumbs: (state) => ['People', SEGMENTS[state.segment.people] ?? titleize(state.segment.people)],
  objectLabel: (id) => titleize(id),
  objectOrder: () => ORDER,
  capActions: [{ id: 'share', label: 'Share' }, { id: 'export', label: 'Export' }],
  capActionsFor: (state) => {
    const n = state.checked.people.length
    return n >= 2 && n <= 4
      ? [{ id: 'share', label: 'Share' }, { id: 'compare', label: `Compare (${n})` }]
      : [{ id: 'share', label: 'Share' }, { id: 'export', label: 'Export' }]
  },
  segmentLabel: (id) => SEGMENTS[id] ?? titleize(id),
  Workspace,
  WorkspaceFoot,
  InspectorBody: PersonInspector,
  InspectorFoot: PersonInspectorFoot,
}

export default section
