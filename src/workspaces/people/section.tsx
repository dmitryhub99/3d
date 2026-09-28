import type { SectionDef } from '../../shell/types'
import { PersonInspector, PersonInspectorFoot } from './PersonInspector'
import { PeopleWorkspace, evaluate, getPeopleQuery } from './PeopleWorkspace'
import { PeopleFoot } from './PeopleFoot'
import { peopleForSegment } from '../../data/peopleQuery'
import { getPersonById } from '../../data/people'

// People section: registry entry (§5.4, §12.2, §12.3).

const SEGMENTS: Record<string, string> = {
  'all-people': 'All people',
  'design-leads-emea': 'Design leads · EMEA',
  'following': 'Following',
  'warm-intros': 'Warm intros',
  'open-to-contract': 'Open to contract',
}

const titleize = (id: string) => id.split('-').map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w)).join(' ')

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
  objectLabel: (id) => getPersonById(id)?.name ?? titleize(id),
  objectOrder: (state) => evaluate(peopleForSegment(state.segment.people), getPeopleQuery()).map((r) => r.person.id),
  capActions: [{ id: 'share', label: 'Share' }, { id: 'export', label: 'Export' }],
  capActionsFor: (state) => {
    const n = state.checked.people.length
    return n >= 2 && n <= 4
      ? [{ id: 'share', label: 'Share' }, { id: 'compare', label: `Compare (${n})` }]
      : [{ id: 'share', label: 'Share' }, { id: 'export', label: 'Export' }]
  },
  segmentLabel: (id) => SEGMENTS[id] ?? titleize(id),
  Workspace: PeopleWorkspace,
  WorkspaceFoot: PeopleFoot,
  InspectorBody: PersonInspector,
  InspectorFoot: PersonInspectorFoot,
}

export default section
