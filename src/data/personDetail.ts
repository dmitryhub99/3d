// §13.5 Person detail. Maren Aaltonen is hand-written (§7.1, §13.5); every other person is derived by the
// exact rules of the §13.5 table. The viewer's own record is derived too, with an "Edit profile" action.

import type { ContextLine, ExperienceEntry, FitLine, Person, PersonDetail, Skill, TextRun, WorkItem } from './types'
import { getPersonById } from './people'
import { viewer, viewerBio, viewerExperience } from './viewer'
import { peopleFitClauses, fitSegmentLabel } from './peopleQuery'
import { fitFraction, hash } from './helpers'
import { addMonths, formatDuration, localTime, monthsBetween, yearsRange } from '../lib/time'

const TARGET = { label: viewer.target.label, org: viewer.target.org }
const NOW_YM = '2026-09'

const fitLinesOf = (evidence: string[], fit: readonly boolean[]): FitLine[] =>
  peopleFitClauses.map((clause, i) => ({ index: i + 1, clause, evidence: evidence[i] ?? '', met: !!fit[i] }))

const entry = (
  role: string, company: string, context: string, note: string, start: string, end: string | null, companyId?: string,
): ExperienceEntry => ({
  role, company, note, start, end,
  duration: formatDuration(monthsBetween(start, end)),
  yearsLabel: yearsRange(start, end),
  ...(context ? { context } : {}),
  ...(companyId ? { companyId } : {}),
})

const metaRuns = (p: Person): TextRun[] => [
  { text: `${p.company} · ${p.city}, ${p.country} · `, tone: 'text-3' },
  { text: `${localTime(p.utcOffset)} ${p.utcOffset}`, tone: 'text-3', mono: true },
]

// ---------------------------------------------------------------------------------------------
// Maren Aaltonen, hand-written (§7.1, §13.5)

const maren = getPersonById('maren-aaltonen')!

const MAREN_BIO_PARAGRAPHS = [
  'Eleven years designing the tools other designers use. At Plinth I lead the design system and own the editor\'s selection and multiplayer model — the part of the canvas everyone touches and nobody notices when it works.',
  "Before Plinth I spent three years on Ledgerline's payments console, where I learned to design for people who read tables for a living: disputes, reconciliation, and a lot of keyboard shortcuts.",
  'I write the spec before the mockup, prototype in code when the interaction is the product, and I am happiest in small teams with hard constraints.',
]

const MAREN_WORK: WorkItem[] = [
  {
    id: 'plinth-canvas-3-selection', title: 'Plinth Canvas 3 — selection model', year: 2025, kind: 'case study', minutes: 8, thumb: 'selection-model',
    summary: 'How Canvas 3 decides what a click selects when frames, groups and locked layers overlap, and why marquee selection now respects hierarchy.',
  },
  {
    id: 'ledgerline-disputes-flow', title: 'Ledgerline Console — disputes flow', year: 2022, kind: 'case study', minutes: 6, thumb: 'disputes-flow',
    summary: 'A five-step disputes flow that cut the median resolution time from nine days to four, with the evidence request as the pivot.',
  },
  {
    id: 'plinth-tokens-v2', title: 'Plinth tokens v2 — one source, three platforms', year: 2024, kind: 'essay', minutes: 5, thumb: 'token-pipeline',
    summary: 'Moving 1,400 tokens from three repositories to one DTCG source compiled for web, iOS and Android.',
  },
  {
    id: 'selection-is-a-product-decision', title: 'Selection is a product decision', year: 2026, kind: 'talk', minutes: 22, thumb: 'selection-model',
    summary: 'Talk at Canvas Days, Berlin 2026: the selection model is where a canvas states its opinions.',
  },
]

const MAREN_SKILLS: Skill[] = [
  { name: 'Design systems', matched: true, years: 6 },
  { name: 'Editor / canvas UX', matched: false, years: 5 },
  { name: 'Prototyping (code)', matched: false, years: 7 },
  { name: 'Interaction design', matched: false, years: 11 },
  { name: 'Multiplayer UX', matched: false, years: 3 },
  { name: 'Design tokens', matched: false, years: 4 },
  { name: 'Figma plugin API', matched: false, years: 3 },
  { name: 'Accessibility', matched: false, years: 6 },
]

const MAREN_CONTEXT: ContextLine[] = [
  {
    icon: 'worked-with',
    runs: [
      { text: 'Jonas Petersen', tone: 'text-1' },
      { text: ' worked with Maren at Ledgerline, 2020–22 · your 1°' },
    ],
  },
  {
    icon: 'people',
    runs: [
      { text: '3 mutual: ' },
      { text: 'Jonas Petersen', tone: 'text-1' },
      { text: ', ' },
      { text: 'Aiko Mori', tone: 'text-1' },
      { text: ', ' },
      { text: 'Tomás Rey', tone: 'text-1' },
    ],
  },
  {
    icon: 'view',
    runs: [
      { text: 'Viewed your job ' },
      { text: 'Staff Designer, Canvas', tone: 'text-1' },
      { text: ' · ' },
      { text: '2d ago', mono: true, tone: 'text-3' },
    ],
  },
  { icon: 'saved', runs: [{ text: 'Saved by 2 people on your team' }] },
]

const MAREN: PersonDetail = {
  ...maren,
  headlineLong: 'Senior Product Designer — design systems, editor tooling and multiplayer UX',
  meta: metaRuns(maren),
  localTime: localTime(maren.utcOffset), // '14:32'
  activeAgo: '3h',
  availabilityLine: [
    { text: 'Open to roles from ', tone: 'text-2' },
    { text: '11 Jan 2027', tone: 'text-2', mono: true },
  ],
  availabilityTerms: 'Full-time or contract · hybrid Berlin or remote EMEA',
  primaryAction: {
    kind: 'intro',
    label: 'Request intro via Jonas',
    flag: 'Jonas Petersen (your 1°) worked with Maren at Ledgerline, 2020–22',
  },
  target: TARGET,
  fitLines: fitLinesOf(
    ['Senior Product Designer', '11 yrs · senior since 2023', 'Berlin · UTC+2', "Leads Plinth's system, 3 yrs", 'from 11 Jan 2027 · 15 wks'],
    maren.fit,
  ),
  fitReadout: fitFraction(maren.fit),
  bio: "Eleven years designing tools for designers. Leads Plinth's design system and the editor's selection model; before that, payments tooling at Ledgerline.",
  bioLong: MAREN_BIO_PARAGRAPHS.join('\n\n'),
  bioParagraphs: MAREN_BIO_PARAGRAPHS,
  experience: [
    entry('Senior Product Designer', 'Plinth', 'collaborative canvas', 'Leads the design system (140 components, 3 platforms); designed the Canvas 3 selection model.', '2023-08', null, 'plinth'),
    entry('Product Designer, Console', 'Ledgerline', 'payments infrastructure', 'Disputes and reconciliation console; introduced the keyboard-first table pattern.', '2020-04', '2023-06', 'ledgerline'),
    entry('Interaction Designer', 'Forma Studio', 'Helsinki', 'Client work for Finnish public-sector services.', '2017-03', '2020-02'),
    entry('UX Designer', 'Rautatie Digital', 'Tampere', 'Timetable and ticketing flows.', '2015-03', '2017-01'),
  ],
  totalExperience: '11y',
  careerAxis: { from: '2015-01', to: '2026-09' },
  work: MAREN_WORK,
  inspectorWorkCount: 2,
  skillsDetail: MAREN_SKILLS,
  skillsReadout: `${MAREN_SKILLS.filter((s) => s.matched).length} of ${MAREN_SKILLS.length} match`,
  sharedContext: MAREN_CONTEXT,
  recommendations: [
    {
      quote: 'Maren rewrote our selection model in a week and then spent a month proving it with prototypes. Nothing shipped without her spec.',
      author: 'Jonas Petersen', authorRole: 'Staff Engineer, Ledgerline', year: 2022,
    },
    {
      quote: 'The calmest person in any critique, and the one who has read the code.',
      author: 'Aiko Mori', authorRole: 'Staff Designer, Quanta Labs', year: 2024,
    },
  ],
  recentActivity: [
    { title: 'Selection is a product decision, not a UI detail', date: '14 Sep' },
    { title: "Notes from rebuilding Plinth's token pipeline", date: '2 Aug' },
  ],
  writing: [
    { title: 'Selection is a product decision, not a UI detail', date: '14 Sep 2026', postId: 'post-maren-selection' },
    { title: "Notes from rebuilding Plinth's token pipeline", date: '2 Aug 2026', postId: 'post-maren-tokens' },
    { title: 'Dense tables are a kindness', date: '11 Mar 2026', postId: 'post-maren-tables' },
  ],
  profileReadouts: [
    { label: 'Profile views · 30d', value: '214', kind: 'figure' },
    { label: 'Response time', value: '~1 day', kind: 'figure' },
    { label: 'Last active', value: '3h ago', kind: 'figure' },
    { label: `Fit · ${fitSegmentLabel}`, value: '4/5', kind: 'fit' },
  ],
  provenance: [
    { text: 'Updated ' }, { text: '6d', mono: true }, { text: ' ago · ' },
    { text: '2', mono: true }, { text: ' of ' }, { text: '4', mono: true }, { text: ' roles verified' },
  ],
  source: 'hand-written',
}

// ---------------------------------------------------------------------------------------------
// Derived records (§13.5 "Derived rule for everyone else")

const firstName = (name: string) => name.split(' ')[0] ?? name
const tenureYears = (t: string) => Number.parseInt(t, 10) || 1
const ACTIVE = ['1h', '3h', '5h', '8h', '1d', '2d', '4d', '6d']

function availabilityLineOf(p: Person): TextRun[] {
  const { status, timing } = p.availability
  switch (status) {
    case 'open':
      return timing === 'now'
        ? [{ text: 'Open to roles now', tone: 'text-2' }]
        : [{ text: 'Open to roles from ', tone: 'text-2' }, { text: timing, tone: 'text-2', mono: true }]
    case 'exploring':
      return [{ text: 'Exploring roles from ', tone: 'text-2' }, { text: timing, tone: 'text-2', mono: true }]
    case 'freelance':
      return [{ text: 'Available for projects · ', tone: 'text-2' }, { text: timing, tone: 'text-2', mono: true }]
    case 'not-looking':
    default:
      return [{ text: 'Not looking', tone: 'text-2' }]
  }
}

function availabilityEvidence(p: Person): string {
  const { status, timing } = p.availability
  if (status === 'open' || status === 'exploring') return timing === 'now' ? 'available now' : `from ${timing}`
  if (status === 'freelance') return `${timing}, available now`
  return 'Not looking'
}

function primaryActionOf(p: Person): PersonDetail['primaryAction'] {
  if (p.id === viewer.id) return { kind: 'edit', label: 'Edit profile' }
  if (p.relation === 'In pipeline') {
    return { kind: 'open-pipeline', label: 'Open in pipeline', flag: `${p.name} is in your pipeline for ${TARGET.label}` }
  }
  if (p.degree === 1 || p.degree === 'team') return { kind: 'message', label: 'Message' }
  if (p.degree === 2 && p.introVia) {
    return { kind: 'intro', label: `Request intro via ${firstName(p.introVia)}`, flag: `${p.introVia} (your 1°) can introduce you` }
  }
  return { kind: 'intro', label: 'Request intro' }
}

function sharedContextOf(p: Person): ContextLine[] {
  if (p.id === viewer.id) return []
  const runs: TextRun[] = [{ text: p.relation }]
  if (p.introVia) runs.push({ text: ' · via ' }, { text: p.introVia, tone: 'text-1' })
  return [{ icon: 'people', runs }]
}

function derive(p: Person): PersonDetail {
  const tenure = tenureYears(p.tenure)
  const currentStart = addMonths(NOW_YM, -12 * tenure)
  const prevYears = Math.max(1, p.years - tenure)
  const prevStart = addMonths(currentStart, -12 * prevYears)
  const isViewer = p.id === viewer.id

  const experience: ExperienceEntry[] = isViewer
    ? viewerExperience.map((e) =>
        entry(e.role, e.company, e.context, e.note, e.start, e.end, 'companyId' in e ? e.companyId : undefined))
    : [
        entry(p.headline, p.company, '', `${p.evidence}.`, currentStart, null, p.companyId),
        entry(p.prev.role, p.prev.company, '', '', prevStart, currentStart),
      ]

  const work: WorkItem[] = [
    { id: `${p.id}-work-1`, title: `${p.company} — ${p.skills[0]?.name ?? p.headline}`, year: 2025, kind: 'case study', minutes: 7, thumb: 'component-grid' },
    { id: `${p.id}-work-2`, title: `${p.prev.company} — ${p.skills[1]?.name ?? p.prev.role}`, year: 2022, kind: 'case study', minutes: 5, thumb: 'stepper' },
  ]

  const ladder = [Math.min(p.years, 6), 4, 3, 2]
  const skillsDetail: Skill[] = p.skills.map((s, i) => ({ ...s, years: ladder[i] ?? 2 }))

  const fitLines = fitLinesOf(
    [
      p.headline,
      `${p.years} yrs`,
      `${p.city} · ${p.utcOffset}`,
      p.fit[3] ? p.evidence : 'No design-system work listed',
      availabilityEvidence(p),
    ],
    p.fit,
  )

  const bio = isViewer
    ? viewerBio
    : `${p.evidence}. ${p.years} years in product and interaction design; ${p.tenure} at ${p.company}.`

  return {
    ...p,
    headlineLong: `${p.headline} at ${p.company}`,
    meta: metaRuns(p),
    localTime: localTime(p.utcOffset),
    activeAgo: isViewer ? 'now' : ACTIVE[hash(p.id) % ACTIVE.length]!,
    availabilityLine: availabilityLineOf(p),
    availabilityTerms: `Full-time · ${p.city} or remote`,
    primaryAction: primaryActionOf(p),
    target: isViewer ? null : TARGET,
    fitLines,
    fitReadout: fitFraction(p.fit),
    bio,
    bioLong: bio,
    bioParagraphs: [bio],
    experience,
    totalExperience: `${p.years}y`,
    careerAxis: { from: `${2026 - p.years}-01`, to: NOW_YM },
    work,
    inspectorWorkCount: 2,
    skillsDetail,
    skillsReadout: `${skillsDetail.filter((s) => s.matched).length} of ${skillsDetail.length} match`,
    sharedContext: sharedContextOf(p),
    recommendations: [],
    recentActivity: [],
    writing: [],
    profileReadouts: [{ label: `Fit · ${fitSegmentLabel}`, value: fitFraction(p.fit), kind: 'fit' }],
    provenance: [
      { text: 'Updated ' }, { text: '2w', mono: true }, { text: ' ago · ' },
      { text: '1', mono: true }, { text: ' of ' }, { text: '2', mono: true }, { text: ' roles verified' },
    ],
    source: 'derived',
  }
}

const cache = new Map<string, PersonDetail>([['maren-aaltonen', MAREN]])

/**
 * The inspector / profile record for any person id (the 22 results, extra people, generated candidates and
 * the viewer). Maren Aaltonen is hand-written; everyone else is derived by the §13.5 rules. Memoized, so the
 * same object is returned for the same id.
 */
export function getPersonDetail(id: string | null | undefined): PersonDetail | undefined {
  if (!id) return undefined
  const hit = cache.get(id)
  if (hit) return hit
  const p = getPersonById(id)
  if (!p) return undefined
  const d = derive(p)
  cache.set(id, d)
  return d
}

/** Fit-line flag text for tick n (§6.6): '5 available within 3 months · from 11 Jan 2027 — not met'. */
export function fitFlagText(detail: PersonDetail, index: number, clauseText: string): string {
  const line = detail.fitLines[index - 1]
  if (!line) return clauseText
  return `${index} ${clauseText} · ${line.evidence}${line.met ? '' : ' — not met'}`
}
