// §13.9 Applications › Active (personal context). Grouped by stage: Interview 2, Screen 1, Applied 2.

import type { AppStage, Application, Segment } from './types'
import { companyHue } from './companies'

export const applicationsSegments: Segment[] = [
  { id: 'active', label: 'Active', count: 5 },
  { id: 'drafts', label: 'Drafts', count: 2 },
  { id: 'archived', label: 'Archived', count: 31 },
]

/** Stage-track order (5 ticks): Applied → Screen → Interview → Offer → Closed. */
export const appStageOrder: AppStage[] = ['applied', 'screen', 'interview', 'offer', 'closed']
export const appStageLabel: Record<AppStage, string> = {
  applied: 'Applied', screen: 'Screen', interview: 'Interview', offer: 'Offer', closed: 'Closed',
}
/** Ticks for the stage track: filled up to and including the current stage ('interview' → 3 of 5). */
export const stageTrack = (stage: AppStage): boolean[] => {
  const n = appStageOrder.indexOf(stage) + 1
  return appStageOrder.map((_, i) => i < n)
}

type Seed = Omit<Application, 'hue'>

const SEEDS: Seed[] = [
  {
    id: 'app-oriel-head', role: 'Head of Design, Editor', companyId: 'oriel', company: 'Oriel', location: 'Paris · hybrid',
    stage: 'interview', next: { label: 'Panel interview', when: 'Thu 1 Oct 14:00' }, updated: '1d', jobId: 'job-oriel-head',
    nextDetail: 'Panel interview · Thu 1 Oct, 14:00–15:30 CEST · with Camille Roux (Head of Product) and Aurélien Duclos (Principal Designer)',
    timeline: [
      { date: '14 Sep', text: 'Applied' },
      { date: '16 Sep', text: 'Recruiter call with Inès Laurent' },
      { date: '22 Sep', text: 'Portfolio review passed' },
      { date: '25 Sep', text: 'Panel scheduled' },
    ],
    contacts: [
      { name: 'Inès Laurent', role: 'Recruiter' },
      { name: 'Camille Roux', role: 'Head of Product' },
    ],
    primaryAction: 'Confirm panel slot',
  },
  {
    id: 'app-northdesk-director', role: 'Design Director', companyId: 'northdesk', company: 'Northdesk', location: 'Stockholm or remote in EMEA',
    stage: 'interview', next: { label: 'Portfolio review', when: 'Mon 5 Oct 10:00' }, updated: '3d',
    nextDetail: 'Portfolio review · Mon 5 Oct, 10:00–11:00 CEST · with Erik Sandberg (VP Product) and Tove Lindqvist (Staff Product Designer)',
    timeline: [
      { date: '7 Sep', text: 'Applied, referred by Tove Lindqvist' },
      { date: '10 Sep', text: 'Recruiter call with Maja Holm' },
      { date: '18 Sep', text: 'Hiring manager call with Erik Sandberg' },
      { date: '25 Sep', text: 'Portfolio review scheduled' },
    ],
    contacts: [
      { name: 'Maja Holm', role: 'Recruiter' },
      { name: 'Erik Sandberg', role: 'VP Product' },
    ],
    primaryAction: 'Share portfolio link',
  },
  {
    id: 'app-halden-principal', role: 'Principal Product Designer, Platform', companyId: 'halden', company: 'Halden', location: 'Amsterdam or remote in EMEA',
    stage: 'screen', next: { label: 'Recruiter call', when: 'Wed 30 Sep 16:00' }, updated: '2h', jobId: 'job-halden-principal',
    nextDetail: 'Recruiter call · Wed 30 Sep, 16:00–16:30 CEST · with Sanne de Boer (Recruiter)',
    timeline: [
      { date: '26 Sep', text: 'Applied' },
      { date: '28 Sep', text: 'Moved to screen' },
      { date: '28 Sep', text: 'Recruiter call booked with Sanne de Boer' },
    ],
    contacts: [
      { name: 'Sanne de Boer', role: 'Recruiter' },
      { name: 'Mirte Bakker', role: 'Head of Design' },
    ],
    primaryAction: 'Confirm call',
  },
  {
    id: 'app-brisa-vp', role: 'VP Design', companyId: 'brisa', company: 'Brisa', location: 'Barcelona',
    stage: 'applied', next: { label: 'Awaiting review', when: null }, updated: '6d', jobId: 'job-brisa-vp',
    nextDetail: 'Awaiting review · Brisa usually replies within 10 days',
    timeline: [
      { date: '22 Sep', text: 'Applied' },
      { date: '23 Sep', text: 'Application viewed by Núria Vidal' },
    ],
    contacts: [{ name: 'Núria Vidal', role: 'Talent partner' }],
    primaryAction: 'Message Núria',
  },
  {
    id: 'app-tessera-lead', role: 'Design Lead, Payments', companyId: 'tessera', company: 'Tessera', location: 'Lagos or remote in EMEA',
    stage: 'applied', next: { label: 'Awaiting review', when: null }, updated: '9d',
    nextDetail: 'Awaiting review · Tessera usually replies within 2 weeks',
    timeline: [
      { date: '19 Sep', text: 'Applied' },
      { date: '21 Sep', text: 'Application viewed by Ifeoma Nwosu' },
    ],
    contacts: [{ name: 'Ifeoma Nwosu', role: 'Recruiter' }],
    primaryAction: 'Send a follow-up',
  },
]

/** The 5 active applications, in row order (grouped: Interview, Screen, Applied). */
export const applications: Application[] = SEEDS.map((s) => ({ ...s, hue: companyHue(s.companyId) }))

export const applicationIds: string[] = applications.map((a) => a.id)


/** Group headers in order with their rows: `Interview 2`, `Screen 1`, `Applied 2`. */
export const applicationGroups: { stage: AppStage; label: string; items: Application[] }[] = (
  ['interview', 'screen', 'applied'] as AppStage[]
).map((stage) => ({ stage, label: appStageLabel[stage], items: applications.filter((a) => a.stage === stage) }))

/** Drafts (strip `Drafts 2`) and a sample of Archived, for the other segments. */
export const applicationDrafts: Application[] = [
  {
    id: 'app-plinth-staff-draft', role: 'Staff Designer, Multiplayer', companyId: 'plinth', company: 'Plinth', location: 'Berlin or remote in EMEA',
    stage: 'applied', next: { label: 'Draft · cover note unfinished', when: null }, updated: '3d', jobId: 'job-plinth-staff',
    nextDetail: 'Draft · cover note unfinished · saved 25 Sep', timeline: [{ date: '25 Sep', text: 'Draft started' }], contacts: [],
    primaryAction: 'Continue draft', hue: companyHue('plinth'),
  },
  {
    id: 'app-sable-staff-draft', role: 'Staff Product Designer, Approvals', companyId: 'sable', company: 'Sable', location: 'London · hybrid',
    stage: 'applied', next: { label: 'Draft · portfolio not attached', when: null }, updated: '5d', jobId: 'job-sable-staff',
    nextDetail: 'Draft · portfolio not attached · saved 23 Sep', timeline: [{ date: '23 Sep', text: 'Draft started' }], contacts: [],
    primaryAction: 'Continue draft', hue: companyHue('sable'),
  },
]

export const applicationsArchivedSample: Application[] = [
  {
    id: 'app-ledgerline-head-2025', role: 'Head of Product Design', companyId: 'ledgerline', company: 'Ledgerline', location: 'Warsaw',
    stage: 'closed', next: { label: 'Withdrawn', when: null }, updated: '11mo',
    nextDetail: 'Withdrawn after the final round · Oct 2025', timeline: [{ date: '2 Sep 2025', text: 'Applied' }, { date: '14 Oct 2025', text: 'Withdrawn' }],
    contacts: [], primaryAction: 'Reopen', hue: companyHue('ledgerline'),
  },
  {
    id: 'app-quanta-design-lead-2025', role: 'Design Lead', companyId: 'quanta-labs', company: 'Quanta Labs', location: 'Remote in EMEA',
    stage: 'closed', next: { label: 'Role closed', when: null }, updated: '1y',
    nextDetail: 'Role closed by Quanta Labs · Aug 2025', timeline: [{ date: '11 Jul 2025', text: 'Applied' }, { date: '20 Aug 2025', text: 'Role closed' }],
    contacts: [], primaryAction: 'Reopen', hue: companyHue('quanta-labs'),
  },
]

export function applicationsForSegment(segmentId: string): Application[] {
  if (segmentId === 'drafts') return applicationDrafts
  if (segmentId === 'archived') return applicationsArchivedSample
  return applications
}

const byId = new Map([...applications, ...applicationDrafts, ...applicationsArchivedSample].map((a) => [a.id, a]))

/** Any application (active, drafts, archived sample). */
export function getApplicationById(id: string | null | undefined): Application | undefined {
  return id ? byId.get(id) : undefined
}
