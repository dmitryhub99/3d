// §13.2 The viewer: Rhea Kovač, Design Director at Tandem (Munich), acting as Tandem · Hiring.

import type { Viewer } from './types'

export const viewer: Viewer = {
  name: 'Rhea Kovač',
  initials: 'RK',
  hue: 2,
  role: 'Design Director',
  company: 'Tandem',
  actingAs: { kind: 'employer', org: 'Tandem', badge: 'T' },
  employerSeat: true,

  id: 'rhea-kovac',
  companyId: 'tandem',
  city: 'Munich',
  country: 'Germany',
  utcOffset: 'UTC+2',
  connections: [
    'jonas-petersen',
    'aiko-mori',
    'tove-lindqvist',
    'priya-raman',
    'tomas-rey',
    'elodie-marchand',
    'ana-ruiz',
    'lars-visser',
  ],
  team: ['felix-braun'],
  targetRequisitionId: 'req-t114',
  target: { label: 'Staff Designer, Canvas', org: 'Tandem' },
  contexts: [
    { id: 'personal', label: 'Personal', active: false },
    { id: 'tandem-hiring', label: 'Tandem · Hiring', active: true },
  ],
  flag: 'Rhea Kovač · acting as Tandem',
  syncFlag: 'Synced 12s ago',
  personalTarget: { name: 'Rhea Kovač', context: 'personal' },
  savedSearches: [
    { id: 'principal-emea', label: 'Principal · EMEA', section: 'jobs' },
    { id: 'staff-design-remote', label: 'Staff design · remote', section: 'jobs' },
    { id: 'design-systems-contract', label: 'Design systems · contract', section: 'projects' },
  ],
}

/** The viewer's own short bio, used by her own profile record. */
export const viewerBio =
  'Design Director at Tandem, where a team of nine designs the shared canvas engineering teams plan in. Before Tandem: seven years at Sable, the last three leading design for approvals and handoffs.'

/** The viewer's own career (her profile record in personDetail.ts). */
export const viewerExperience = [
  { role: 'Design Director', company: 'Tandem', companyId: 'tandem', context: 'shared workspace', start: '2023-02', end: null, note: 'Leads a team of nine across Canvas, Editor and the design system; hiring for Canvas.' },
  { role: 'Design Lead, Approvals', company: 'Sable', companyId: 'sable', context: 'workflow automation', start: '2016-03', end: '2023-01', note: 'Grew the design team from two to eleven; owned approvals and handoffs.' },
  { role: 'Product Designer', company: 'Kvadrat Labs', context: 'Zagreb', start: '2012-06', end: '2016-02', note: 'Agency work for Croatian and Slovenian banks.' },
] as const
