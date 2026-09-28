// §13.8 Projects › Marketplace, plus the viewer's own briefs (My briefs). Every brief has full Peek content.

import type { Project, Query, Segment, TextRun } from './types'
import { companyHue } from './companies'

export const projectsSegments: Segment[] = [
  { id: 'marketplace', label: 'Marketplace', count: 312 },
  { id: 'my-briefs', label: 'My briefs', count: 2 },
  { id: 'proposals', label: 'Proposals', count: 5 },
  { id: 'contracts', label: 'Contracts', count: 1 },
]

/** [1] product design [2] €15k or more [3] 4–12 weeks [4] remote — by newest. */
export const projectsQuery: Query = {
  clauses: [
    { index: 1, key: 'discipline', value: 'product design' },
    { index: 2, key: 'budget', value: '€15k or more' },
    { index: 3, key: 'duration', value: '4–12 weeks' },
    { index: 4, key: 'remote', value: 'remote' },
  ],
  sort: { lead: '— by', value: 'newest' },
}

type Seed = Omit<Project, 'hue' | 'facts' | 'budgetType' | 'location' | 'list' | 'remote'> & {
  budgetType?: Project['budgetType']
  location?: string
  list?: Project['list']
  remote?: boolean
}

const SEEDS: Seed[] = [
  {
    id: 'brief-brisa-audit', title: 'Design system audit and token migration', clientId: 'brisa', client: 'Brisa',
    budget: '€18–24k', duration: '8 wk', proposals: 11, skills: ['Design systems', 'Design tokens', 'Figma'], posted: '1d',
    summary: "Brisa's app and operator console share 60% of their components but three different token sets. We need an audit of the current system and a migration plan to a single token source, then support for the first two migration sprints.",
    clientNote: 'Brisa · Consumer mobility · 12 briefs posted · pays within 14 days',
    start: '19 Oct',
    scope: [
      'Inventory of components and tokens across 2 products',
      'Gap and duplication report',
      'Token architecture proposal (DTCG format)',
      'Migration plan with sequencing',
      'Pairing on 2 migration sprints',
    ],
  },
  {
    id: 'brief-quanta-figma', title: 'Figma plugin for token linting', clientId: 'quanta-labs', client: 'Quanta Labs',
    budget: '€18–26k', duration: '8 wk', proposals: 12, skills: ['Figma API', 'Design tokens', 'TypeScript'], posted: '2d',
    summary: 'Teams on Quanta compile tokens from one source, but their Figma files drift: raw hex values, detached styles, spacing off the scale. We want a plugin that flags drift in the file and proposes the matching token, with a report designers can share in review.',
    clientNote: 'Quanta Labs · Design infrastructure · 4 briefs posted · pays within 7 days',
    start: '12 Oct',
    scope: [
      'Lint rules for color, type, spacing and radius',
      'Fix-in-place suggestions mapped to tokens',
      'Shareable drift report per file',
      'Plugin published to the Figma community',
    ],
  },
  {
    id: 'brief-fondo-dashboard', title: 'Fund reporting dashboard redesign', clientId: 'fondo', client: 'Fondo',
    budget: '€22–30k', duration: '10 wk', proposals: 7, skills: ['Data-dense UI', 'Research'], posted: '2d',
    summary: 'Fund administrators at 140 small funds use our reporting screens every quarter end. The screens grew one column at a time. We want research with six administrators, a new information architecture and a redesigned NAV and capital-account view.',
    clientNote: 'Fondo · Fund administration · 3 briefs posted · pays within 30 days',
    start: '26 Oct',
    scope: [
      'Six contextual interviews at quarter end',
      'Information architecture for reporting',
      'NAV and capital-account views, high fidelity',
      'Handover to the in-house design team',
    ],
  },
  {
    id: 'brief-mawimbi-onboarding', title: 'Merchant onboarding flow, Android', clientId: 'mawimbi', client: 'Mawimbi',
    budget: '€15–20k', duration: '6 wk', proposals: 14, skills: ['Mobile', 'Onboarding', 'Research'], posted: '3d',
    summary: 'Four in ten merchants who start signing up on Android stop at identity verification. We need the onboarding flow redesigned for low-end devices and patchy networks, tested with merchants in Nairobi and Mombasa.',
    clientNote: 'Mawimbi · Mobile money · 9 briefs posted · pays within 14 days',
    start: '19 Oct',
    scope: [
      'Funnel review with the growth team',
      'Offline-tolerant onboarding flow',
      'Identity verification redesign',
      'Two rounds of field testing',
    ],
  },
  {
    id: 'brief-sable-templates', title: 'Workflow template gallery', clientId: 'sable', client: 'Sable',
    budget: '€20–28k', duration: '7 wk', proposals: 10, skills: ['Workflow design', 'Content design'], posted: '4d',
    summary: 'New Sable customers start from a blank workflow and half of them never publish one. We want a gallery of 30 starting templates, written and structured so an operations lead can adapt one in ten minutes.',
    clientNote: 'Sable · Workflow automation · 7 briefs posted · pays within 21 days',
    start: '2 Nov',
    scope: [
      'Template taxonomy from 200 published workflows',
      '30 templates, written and configured',
      'Gallery browsing and preview',
      'Measurement plan for template adoption',
    ],
  },
  {
    id: 'brief-veski-docs', title: 'Component documentation site', clientId: 'veski', client: 'Veski',
    budget: '€16–22k', duration: '6 wk', proposals: 5, skills: ['Design systems', 'Documentation'], posted: '5d',
    summary: "Veski's design system has 90 components and its documentation is a wiki page per component. We want a documentation site generated from the code, with usage guidance written for product engineers.",
    clientNote: 'Veski · Accounting software · 2 briefs posted · pays within 14 days',
    start: '19 Oct',
    scope: [
      'Documentation structure and templates',
      'Usage guidance for the 20 most-used components',
      'Site design and build handover',
      'Contribution guide for the team',
    ],
  },
  {
    id: 'brief-orbit-dispatch', title: 'Dispatch console usability study', clientId: 'orbit-freight', client: 'Orbit Freight',
    budget: '€15–18k', duration: '5 wk', proposals: 8, skills: ['Research', 'Data-dense UI'], posted: '6d',
    summary: 'Dispatchers at regional carriers use our console for a full shift. We want a usability study across three carriers in Morocco and Spain, with a prioritised list of fixes the team can ship this quarter.',
    clientNote: 'Orbit Freight · Freight logistics · 5 briefs posted · pays within 30 days',
    start: '12 Oct',
    scope: [
      'Shift-long observation at 3 carriers',
      'Task analysis for load assignment',
      'Prioritised findings with severity',
      'Workshop with the product team',
    ],
  },
  {
    id: 'brief-hekla-scheduling', title: 'Clinician scheduling prototype', clientId: 'hekla-health', client: 'Hekla Health',
    budget: '€25–32k', duration: '12 wk', proposals: 6, skills: ['Prototyping', 'Healthcare UX'], posted: '8d',
    summary: 'Clinics build rotas in spreadsheets and paste them into our system. We want a working prototype of rota planning inside Hekla, tested with schedulers at two hospitals before we commit engineering time.',
    clientNote: 'Hekla Health · Clinical software · 3 briefs posted · pays within 30 days',
    start: '2 Nov',
    scope: [
      'Research with schedulers at 2 hospitals',
      'Coded prototype with real rota data',
      'Two rounds of usability testing',
      'Recommendation for the build',
    ],
  },
  {
    id: 'brief-atlas-legend', title: 'Map legend and layer controls', clientId: 'atlas-maps', client: 'Atlas Maps',
    budget: '€12–16k', duration: '4 wk', proposals: 9, skills: ['Interaction design', 'Cartography UI'], posted: '9d',
    summary: 'Customers embed Atlas maps with our default legend and layer toggles, and most replace them. We want a legend and layer-control component set that works from 320px to full screen and reads at every zoom.',
    clientNote: 'Atlas Maps · Mapping platform · 6 briefs posted · pays within 14 days',
    start: '12 Oct',
    scope: [
      'Audit of 25 customer embeds',
      'Legend and layer-control components',
      'Responsive and zoom behaviour specs',
      'Handover to the SDK team',
    ],
  },
  // ---- My briefs (the viewer's own, posted as Tandem) ----
  {
    id: 'brief-tandem-icons', title: 'Icon audit', clientId: 'tandem', client: 'Tandem',
    budget: '€8–10k', duration: '3 wk', proposals: 9, skills: ['Iconography', 'Design systems'], posted: '12d',
    summary: "Tandem's new icon set has 212 glyphs on one 16px grid. We want an outside audit of consistency, legibility at 12px and gaps against the product's actions before we retire the old set.",
    clientNote: 'Tandem · Shared workspace · 2 briefs posted · pays within 14 days',
    start: '5 Oct',
    scope: ['Consistency audit of 212 glyphs', 'Legibility tests at 12 and 16px', 'Gap list against product actions'],
    list: 'mine', location: 'Remote, CET hours',
  },
  {
    id: 'brief-tandem-research', title: 'Canvas onboarding research', clientId: 'tandem', client: 'Tandem',
    budget: '€14–18k', duration: '5 wk', proposals: 4, skills: ['Research', 'Onboarding'], posted: '20d',
    summary: 'Teams that invite fewer than three people in week one rarely stay. We want interviews with 15 new teams and a map of what the first shared canvas needs to do.',
    clientNote: 'Tandem · Shared workspace · 2 briefs posted · pays within 14 days',
    start: '12 Oct',
    scope: ['Interviews with 15 new teams', 'First-week journey map', 'Recommendations for the first shared canvas'],
    list: 'mine', location: 'Remote, CET hours',
  },
]

const facts = (s: Seed, budgetType: Project['budgetType'], location: string): Project['facts'] => {
  const timeline: TextRun[] = [{ text: s.duration, mono: true }]
  if (s.start) timeline.push({ text: ` from ${s.start}` })
  return [
    { label: 'Budget', runs: [{ text: s.budget, mono: true }, { text: ` ${budgetType}` }] },
    { label: 'Timeline', runs: timeline },
    { label: 'Proposals', runs: [{ text: String(s.proposals), mono: true }] },
    { label: 'Location', runs: [{ text: location }] },
  ]
}

const allProjects: Project[] = SEEDS.map((s) => {
  const budgetType = s.budgetType ?? 'fixed'
  const location = s.location ?? 'Remote, EMEA hours'
  return {
    ...s,
    remote: s.remote ?? true,
    budgetType,
    location,
    list: s.list ?? 'marketplace',
    hue: companyHue(s.clientId),
    facts: facts(s, budgetType, location),
  }
})

/** The 9 Marketplace briefs, in tile order (§13.8). */
export const projects: Project[] = allProjects.filter((p) => p.list === 'marketplace')
/** The viewer's own briefs (My briefs 2). */
export const myBriefs: Project[] = allProjects.filter((p) => p.list === 'mine')

export const projectIds: string[] = projects.map((p) => p.id)

const byId = new Map(allProjects.map((p) => [p.id, p]))
export function getProjectById(id: string | null | undefined): Project | undefined {
  return id ? byId.get(id) : undefined
}

/** Tile mono line: '€18–24k · 8 wk · 11 proposals'. */
export const projectMonoLine = (p: Project) => `${p.budget} · ${p.duration} · ${p.proposals} proposals`

/** Tiles loaded for each Projects segment. */
export function projectsForSegment(segmentId: string): Project[] {
  switch (segmentId) {
    case 'my-briefs':
      return myBriefs
    case 'proposals':
      return ['brief-brisa-audit', 'brief-quanta-figma', 'brief-veski-docs', 'brief-sable-templates', 'brief-atlas-legend']
        .map((id) => byId.get(id)!)
    case 'contracts':
      return [byId.get('brief-veski-docs')!]
    case 'marketplace':
    default:
      return projects
  }
}

/** Peek primary action per list: 'Write proposal' (marketplace) or 'Review proposals' (own briefs). */
export const projectPrimaryAction = (p: Project) => (p.list === 'mine' ? 'Review proposals' : 'Write proposal')
