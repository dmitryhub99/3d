// §13.7 Jobs › Recommended, with Reader content for every job (the boot job is §13.7 verbatim).

import type { Job, JobBodySection, Query, Segment, TextRun } from './types'
import { companyHue } from './companies'

export const jobsSegments: Segment[] = [
  { id: 'recommended', label: 'Recommended', count: 48 },
  { id: 'saved-searches', label: 'Saved searches', count: 3 },
  { id: 'tracked', label: 'Tracked', count: 6 },
  { id: 'applied', label: 'Applied', count: 4 },
]

/** [1] principal or staff [2] product design [3] remote in EMEA [4] €120k or more — by fit. */
export const jobsQuery: Query = {
  clauses: [
    { index: 1, key: 'level', value: 'principal or staff' },
    { index: 2, key: 'discipline', value: 'product design' },
    { index: 3, key: 'remote', value: 'remote in EMEA' },
    { index: 4, key: 'comp', value: '€120k or more' },
  ],
  sort: { lead: '— by', value: 'fit' },
}

/** Clause labels for fit flags ("4 €120k or more · band top €150k"). */
export const jobsFitClauses = ['Principal or staff', 'Product design', 'Remote in EMEA', '€120k or more'] as const

type Seed = Omit<Job, 'facts' | 'hue' | 'fit' | 'employment'> & { fit: string; employment?: string }

const fit4 = (bits: string): [boolean, boolean, boolean, boolean] => {
  const b = bits.split('').map((c) => c === '1')
  return [!!b[0], !!b[1], !!b[2], !!b[3]]
}

const about = (p: string): JobBodySection => ({ heading: 'About the role', paragraphs: [p] })
const doLines = (lines: string[]): JobBodySection => ({ heading: "What you'll do", lines })
const lookLines = (lines: string[]): JobBodySection => ({ heading: 'What we look for', lines })
const interview = (lines: string[]): JobBodySection => ({ heading: 'How we interview', lines })

const SEEDS: Seed[] = [
  {
    id: 'job-halden-principal', title: 'Principal Product Designer, Platform', companyId: 'halden', company: 'Halden',
    location: 'Amsterdam or remote in EMEA', comp: '€130–150k', compNote: 'base + equity', posted: '2d', applicants: 41, fit: '1111',
    level: 'Principal (L7)', team: 'Platform · 14 engineers, 2 designers', reportsTo: 'Mirte Bakker, Head of Design', process: '4 stages · about 3 weeks',
    body: [
      about("Halden's platform team builds the pipeline views that 30,000 engineering teams open every morning. You will own the design of how builds, deploys and failures are explained — from the first red check to the fix — and set the interaction model the rest of the product follows."),
      doLines([
        'Lead design for pipelines, logs and deploy history.',
        "Define the platform's interaction patterns with the design-system team.",
        'Prototype in code with engineers; ship weekly.',
        'Mentor two product designers.',
      ]),
      lookLines([
        '10+ years in product design, 3+ on developer or data-dense tools.',
        'A portfolio that shows systems thinking, not just screens.',
        'Comfortable writing specs and reading code.',
        'Based in or overlapping with CET.',
      ]),
      interview([
        'Recruiter call (30 min)',
        'Portfolio review (60 min)',
        'Working session with the team (90 min)',
        'Founder conversation (45 min)',
      ]),
    ],
  },
  {
    id: 'job-plinth-staff', title: 'Staff Designer, Multiplayer', companyId: 'plinth', company: 'Plinth',
    location: 'Berlin or remote in EMEA', comp: '€120–140k', compNote: 'base + equity', posted: '3d', applicants: 33, fit: '1111',
    level: 'Staff (L6)', team: 'Multiplayer · 9 engineers, 1 designer', reportsTo: 'Katrin Vogel, Head of Design', process: '4 stages · about 4 weeks',
    body: [
      about("Plinth's multiplayer team owns everything that happens when more than one person is on the canvas: cursors, presence, follow mode, comments and conflict resolution. You will decide how forty people work on one board without stepping on each other, and how the canvas explains what changed while you were away."),
      doLines([
        'Own presence, follow mode and the activity timeline.',
        'Work with the sync engineers on conflict and offline states.',
        'Run monthly sessions with the teams that use Plinth at scale.',
        'Set the multiplayer patterns the rest of the canvas follows.',
      ]),
      lookLines([
        '8+ years in product design, with real-time or collaborative tools.',
        'Shipped interaction models, not only flows.',
        'Prototypes in code when the interaction is the product.',
        'Berlin, or remote within three hours of CET.',
      ]),
      interview([
        'Recruiter call (30 min)',
        'Portfolio deep dive (75 min)',
        'Canvas critique with the team (60 min)',
        'Conversation with the CPO (45 min)',
      ]),
    ],
  },
  {
    id: 'job-northdesk-staff', title: 'Staff Product Designer, Agent Workspace', companyId: 'northdesk', company: 'Northdesk',
    location: 'Stockholm or remote in EMEA', comp: '€115–135k', compNote: 'base + equity', posted: '1d', applicants: 27, fit: '1111',
    level: 'Staff (IC5)', team: 'Agent Workspace · 12 engineers, 3 designers', reportsTo: 'Erik Sandberg, VP Product', process: '5 stages · about 4 weeks',
    body: [
      about('Support agents spend eight hours a day in Northdesk. The Agent Workspace team designs that day: the queue, the ticket, the macros and the moments between them. You will lead design for the workspace as it moves from one ticket at a time to parallel conversations across chat, email and voice.'),
      doLines([
        'Lead design for the queue, the ticket view and the macro editor.',
        'Sit with agents every month and bring back evidence, not anecdotes.',
        "Work with the design-system team on Northdesk's dense layouts.",
        'Mentor three product designers.',
      ]),
      lookLines([
        '10+ years in product design, with time on tools people use all day.',
        'Fluency with dense layouts and keyboard-first interaction.',
        'Clear written reasoning; we review specs before pixels.',
        'Stockholm, or overlapping with CET.',
      ]),
      interview([
        'Recruiter call (30 min)',
        'Hiring manager call (45 min)',
        'Portfolio review (60 min)',
        'Paid design exercise (half a day)',
        'Team conversation (45 min)',
      ]),
    ],
  },
  {
    id: 'job-oriel-head', title: 'Head of Design, Editor', companyId: 'oriel', company: 'Oriel',
    location: 'Paris · hybrid', comp: '€140–165k', compNote: 'base + equity', posted: '4d', applicants: 58, fit: '1101',
    level: 'Head of design (Director)', team: 'Editor · 6 designers, 22 engineers', reportsTo: 'Camille Roux, Head of Product', process: '5 stages · about 5 weeks',
    body: [
      about("Oriel builds the editing primitives behind other companies' writing tools: selection, comments, presence and review. As Head of Design for the editor you will lead six designers, set the craft bar for an open-source kit used by 300 products, and decide what the editor should refuse to do."),
      doLines([
        'Lead and grow a team of six product designers.',
        "Own the editor kit's interaction model and its documentation.",
        'Shape the roadmap with Camille Roux, Head of Product.',
        'Represent the kit in the open-source community.',
      ]),
      lookLines([
        '12+ years in product design, 4+ leading designers.',
        'Deep experience with editors, canvases or developer-facing kits.',
        'Able to write in public: docs, changelogs, talks.',
        'In Paris three days a week.',
      ]),
      interview([
        'Recruiter call with Inès Laurent (30 min)',
        'Portfolio review (60 min)',
        'Panel with product and design (90 min)',
        'Team presentation (60 min)',
        'Founders (45 min)',
      ]),
    ],
  },
  {
    id: 'job-sable-staff', title: 'Staff Product Designer, Approvals', companyId: 'sable', company: 'Sable',
    location: 'London · hybrid', comp: '£105–125k', compNote: 'base + equity', posted: '5d', applicants: 36, fit: '1101',
    level: 'Staff (L6)', team: 'Approvals · 10 engineers, 2 designers', reportsTo: 'Owen Hartley, Director of Design', process: '4 stages · about 3 weeks',
    body: [
      about('Approvals is where Sable earns its keep: purchase requests, contract sign-off, access grants. You will redesign how approval chains are built, delegated and audited, and make the unhappy paths — retries, partial approvals, people on holiday — first-class parts of the product.'),
      doLines([
        'Own the approval builder, delegation and the audit trail.',
        "Extend Sable's workflow patterns with the Workflows design lead.",
        'Run research with finance and IT admins at 20+ customers a quarter.',
        'Coach two designers on writing specs.',
      ]),
      lookLines([
        '9+ years in product design, ideally on B2B workflow tools.',
        'Comfort with rules, permissions and edge cases.',
        'A habit of testing with real data, not happy-path mockups.',
        'London, two days a week in the office.',
      ]),
      interview([
        'Recruiter call (30 min)',
        'Portfolio review (60 min)',
        'Workflow critique with the team (60 min)',
        'Director conversation (45 min)',
      ]),
    ],
  },
  {
    id: 'job-brisa-vp', title: 'VP Design', companyId: 'brisa', company: 'Brisa',
    location: 'Barcelona', comp: '€150–180k', compNote: 'base + bonus', posted: '10d', applicants: 74, fit: '1101',
    level: 'VP', team: 'Design · 18 designers, 3 managers', reportsTo: 'Marc Puig, CEO', process: '5 stages · about 6 weeks',
    body: [
      about("Brisa runs shared e-bikes in eleven Iberian cities and prices them like public transport. The rider app, the operator console and the bikes' own screens are designed by one team of eighteen. As VP Design you will lead that team through two new markets and a move to a single design system."),
      doLines([
        'Lead three design managers and eighteen designers.',
        'Unify the rider app and the operator console on one token source.',
        'Own design quality for two market launches in 2027.',
        'Sit on the leadership team with product and engineering.',
      ]),
      lookLines([
        '15+ years in design, 6+ leading managers.',
        'Consumer and operations products under one roof.',
        'Spanish or Catalan is a plus, not a requirement.',
        'Barcelona, four days a week in the office.',
      ]),
      interview([
        'Talent partner call (30 min)',
        'CEO conversation (60 min)',
        'Leadership panel (90 min)',
        'Team presentation (60 min)',
        'References',
      ]),
    ],
  },
  {
    id: 'job-ledgerline-principal', title: 'Principal Designer, Payments Console', companyId: 'ledgerline', company: 'Ledgerline',
    location: 'Warsaw or remote in EU', comp: '€100–118k', compNote: 'base + equity', posted: '6d', applicants: 19, fit: '1110',
    level: 'Principal (L7)', team: 'Console · 16 engineers, 3 designers', reportsTo: 'Agnieszka Wróbel, Head of Design', process: '4 stages · about 3 weeks',
    body: [
      about("Ledgerline's console is where finance teams reconcile payouts, resolve disputes and close the month. You will own the console's information design end to end — the tables, the filters, the keyboard model — and keep it fast for people who read tables for a living."),
      doLines([
        'Own disputes, reconciliation and payout views.',
        'Extend the keyboard-first table pattern across the console.',
        'Partner with the React kit maintainers on dense components.',
        'Mentor three designers.',
      ]),
      lookLines([
        '10+ years in product design, with data-dense B2B tools.',
        'Strong information design: tables, states, empty and error cases.',
        'Payments or accounting knowledge is a plus.',
        'Within the EU; Warsaw office optional.',
      ]),
      interview([
        'Recruiter call (30 min)',
        'Portfolio review (60 min)',
        'Table design session (90 min)',
        'Head of Design (45 min)',
      ]),
    ],
  },
  {
    id: 'job-atlas-principal', title: 'Principal Designer, Map Styles', companyId: 'atlas-maps', company: 'Atlas Maps',
    location: 'Athens or remote in EU', comp: '€95–115k', compNote: 'base + equity', posted: '12d', applicants: 16, fit: '1110',
    level: 'Principal', team: 'Styles · 7 engineers, 2 cartographers', reportsTo: 'Nikos Andreou, VP Product', process: '3 stages · about 2 weeks',
    body: [
      about('Atlas sells map styles that other products embed: delivery apps, property search, field tools. You will own how the styles read at every zoom, from the palette and label density to the legend and layer controls, and turn the style editor into something customers can use without a cartographer.'),
      doLines([
        'Own the default styles and their accessibility.',
        'Redesign the style editor for non-cartographers.',
        'Define the legend and layer-control components.',
        'Work with two cartographers and the rendering team.',
      ]),
      lookLines([
        '10+ years in product or visual design; maps or data visualisation.',
        'A trained eye for type at small sizes.',
        'Comfort with style specs and rendering constraints.',
        'Athens, or remote within the EU.',
      ]),
      interview([
        'Recruiter call (30 min)',
        'Portfolio and style critique (90 min)',
        'Team conversation (45 min)',
      ]),
    ],
  },
  {
    id: 'job-quanta-staff', title: 'Staff Design Engineer, Tokens', companyId: 'quanta-labs', company: 'Quanta Labs',
    location: 'Remote in EMEA', comp: '€100–120k', compNote: 'base + equity', posted: '8d', applicants: 12, fit: '1011',
    level: 'Staff', team: 'Tokens · 5 engineers, 2 designers', reportsTo: 'Jens Albrecht, CTO', process: '3 stages · about 2 weeks',
    body: [
      about('Quanta turns design tokens into a build artifact: one source, compiled for web, iOS and Android, versioned like code. You will own the token compiler\'s developer experience, the Figma plugin that edits the source, and the diff view teams use to review a token change.'),
      doLines([
        'Own the token diff viewer and the review flow.',
        'Build and maintain the Figma plugin with the plugins designer.',
        'Keep the compiler output readable for the people who ship it.',
        'Write the docs you wish you had.',
      ]),
      lookLines([
        '8+ years across design and frontend engineering.',
        'TypeScript you are proud of; DTCG format familiarity.',
        'Experience maintaining a design system in production.',
        'Anywhere in EMEA; we meet in Berlin twice a year.',
      ]),
      interview([
        'Call with the CTO (45 min)',
        'Paired build session (2 h)',
        'Team conversation (45 min)',
      ]),
    ],
  },
  {
    id: 'job-mawimbi-lead', title: 'Lead Product Designer, Merchant', companyId: 'mawimbi', company: 'Mawimbi',
    location: 'Nairobi or remote in EMEA', comp: '$90–110k', compNote: 'base + equity', posted: '7d', applicants: 22, fit: '0110',
    level: 'Lead (L5)', team: 'Merchant · 11 engineers, 3 designers', reportsTo: 'Tomás Rey, Head of Design', process: '4 stages · about 4 weeks',
    body: [
      about("Mawimbi's merchant app is how 900,000 small shops in East Africa take payments, pay suppliers and see the day's takings, often on a shared phone and a slow network. You will lead design for the merchant app and its agent tools, and set the bar for offline-first flows."),
      doLines([
        'Lead three designers on the merchant app and agent tools.',
        'Design offline-first flows for low-end Android devices.',
        "Run field research in Nairobi, Kampala and Dar es Salaam.",
        "Contribute to Mawimbi's design system guild.",
      ]),
      lookLines([
        '8+ years in product design, 2+ leading designers.',
        'Mobile money, banking or commerce experience.',
        'Comfortable designing for Swahili and English.',
        'Nairobi, or remote within EMEA with quarterly visits.',
      ]),
      interview([
        'Recruiter call (30 min)',
        'Portfolio review with Tomás Rey (60 min)',
        'Field-research case (take-home, paid)',
        'Team conversation (45 min)',
      ]),
    ],
  },
]

const factRuns = (s: Seed): Job['facts'] => {
  const facts: Job['facts'] = [
    { label: 'Comp', runs: [{ text: s.comp, mono: true }, { text: ` + ${s.compNote.replace(/^base \+ /, '')}` }] },
  ]
  if (s.level) facts.push({ label: 'Level', runs: [{ text: s.level }] })
  if (s.team) facts.push({ label: 'Team', runs: [{ text: s.team }] })
  if (s.reportsTo) facts.push({ label: 'Reports to', runs: [{ text: s.reportsTo }] })
  const posted: TextRun[] = [
    { text: s.posted, mono: true }, { text: ' ago · ' }, { text: String(s.applicants), mono: true }, { text: ' applicants' },
  ]
  facts.push({ label: 'Posted', runs: posted })
  if (s.process) facts.push({ label: 'Process', runs: [{ text: s.process }] })
  return facts
}

/** The 10 Recommended jobs, in row order. Every job carries full Reader content. */
export const jobs: Job[] = SEEDS.map((s) => ({
  ...s,
  employment: s.employment ?? 'Full-time',
  fit: fit4(s.fit),
  hue: companyHue(s.companyId),
  facts: factRuns(s),
}))

export const jobIds: string[] = jobs.map((j) => j.id)

const byId = new Map(jobs.map((j) => [j.id, j]))
export function getJobById(id: string | null | undefined): Job | undefined {
  return id ? byId.get(id) : undefined
}

/** Reader company line: 'Halden · Amsterdam or remote in EMEA · Full-time'. */
export const jobCompanyLine = (j: Job) => `${j.company} · ${j.location} · ${j.employment}`

/** Rows shown for each Jobs segment (strip counts are totals; these are the loaded rows). */
export function jobsForSegment(segmentId: string): Job[] {
  const pick = (ids: string[]) => ids.map((id) => byId.get(id)).filter((j): j is Job => !!j)
  switch (segmentId) {
    case 'saved-searches':
      return pick(['job-halden-principal', 'job-ledgerline-principal', 'job-atlas-principal'])
    case 'tracked':
      return pick(['job-halden-principal', 'job-plinth-staff', 'job-northdesk-staff', 'job-oriel-head', 'job-sable-staff', 'job-quanta-staff'])
    case 'applied':
      return pick(['job-oriel-head', 'job-halden-principal', 'job-brisa-vp'])
    case 'recommended':
    default:
      return jobs
  }
}

/** Foot readout for Recommended: '48 results · 3 match all 4 · by fit · updated 5m ago'. */
export const jobsResultStats = { total: 48, matchAll: 3, sortNote: 'by fit', updated: '5m ago' } as const
