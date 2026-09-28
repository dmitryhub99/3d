// Company Peek content (§5.4 Companies, §13.6 Halden Peek). Halden is §13.6 verbatim; every other company
// in companies.ts has a hand-written record of the same shape; other companies get a derived one.

import type { CompanyDetail, Degree, HueIndex } from './types'
import { getCompanyById } from './companies'
import { allPeople, getPersonById } from './people'

interface DetailSeed {
  growth: string
  designTeam: number
  remotePolicy: string
  roles: { title: string; comp: string; posted: string; jobId?: string }[]
  known: { personId: string; degree?: Degree }[]
}

const SEEDS: Record<string, DetailSeed> = {
  plinth: {
    growth: '+12%', designTeam: 14, remotePolicy: 'Hybrid, Berlin',
    roles: [
      { title: 'Staff Designer, Multiplayer', comp: '€120–140k', posted: '3d', jobId: 'job-plinth-staff' },
      { title: 'Senior Product Designer, Canvas', comp: '€85–100k', posted: '8d' },
      { title: 'Design Engineer', comp: '€85–105k', posted: '12d' },
    ],
    known: [{ personId: 'maren-aaltonen' }, { personId: 'henrik-lund' }, { personId: 'jin-woo-park' }],
  },
  oriel: {
    growth: '+9%', designTeam: 8, remotePolicy: 'Hybrid, Paris',
    roles: [
      { title: 'Head of Design, Editor', comp: '€140–165k', posted: '4d', jobId: 'job-oriel-head' },
      { title: 'Senior Product Designer, Collaboration', comp: '€80–95k', posted: '11d' },
    ],
    known: [{ personId: 'aurelien-duclos' }, { personId: 'lea-moreau' }, { personId: 'leila-ahmadi' }],
  },
  halden: {
    growth: '+18%', designTeam: 11, remotePolicy: 'EMEA remote',
    roles: [
      { title: 'Principal Product Designer, Platform', comp: '€130–150k', posted: '2d', jobId: 'job-halden-principal' },
      { title: 'Senior Product Designer, CI', comp: '€95–115k', posted: '6d' },
      { title: 'Design Engineer', comp: '€90–110k', posted: '9d' },
    ],
    known: [
      { personId: 'kwame-asante', degree: 2 },
      { personId: 'lars-visser', degree: 1 },
      { personId: 'mirte-bakker', degree: 2 },
      { personId: 'pieter-jansen', degree: 3 },
    ],
  },
  northdesk: {
    growth: '+15%', designTeam: 12, remotePolicy: 'EMEA remote',
    roles: [
      { title: 'Staff Product Designer, Agent Workspace', comp: '€115–135k', posted: '1d', jobId: 'job-northdesk-staff' },
      { title: 'Design Director', comp: '€150–170k', posted: '3w' },
      { title: 'Senior Product Designer, Reporting', comp: '€85–100k', posted: '9d' },
    ],
    known: [{ personId: 'tove-lindqvist' }, { personId: 'arjun-mehta' }],
  },
  ledgerline: {
    growth: '+6%', designTeam: 18, remotePolicy: 'Remote in EU',
    roles: [
      { title: 'Principal Designer, Payments Console', comp: '€100–118k', posted: '6d', jobId: 'job-ledgerline-principal' },
      { title: 'Senior UX Engineer', comp: '€80–95k', posted: '5d' },
      { title: 'Product Designer, Treasury', comp: '€65–80k', posted: '10d' },
    ],
    known: [{ personId: 'mateusz-krol' }, { personId: 'marta-nowak' }],
  },
  sable: {
    growth: '+21%', designTeam: 16, remotePolicy: 'Hybrid, London',
    roles: [
      { title: 'Staff Product Designer, Approvals', comp: '£105–125k', posted: '5d', jobId: 'job-sable-staff' },
      { title: 'Senior Product Designer, Integrations', comp: '£80–95k', posted: '9d' },
      { title: 'Design Manager', comp: '£110–125k', posted: '13d' },
    ],
    known: [{ personId: 'priya-raman' }, { personId: 'elif-sahin' }],
  },
  mawimbi: {
    growth: '+24%', designTeam: 9, remotePolicy: 'Hybrid, Nairobi',
    roles: [
      { title: 'Lead Product Designer, Merchant', comp: '$90–110k', posted: '7d', jobId: 'job-mawimbi-lead' },
      { title: 'Senior Product Designer, Agent network', comp: '$60–75k', posted: '12d' },
      { title: 'UX Researcher', comp: '$45–60k', posted: '15d' },
    ],
    known: [{ personId: 'tomas-rey' }, { personId: 'wanjiru-kamau' }, { personId: 'zanele-dube' }],
  },
  tessera: {
    growth: '+30%', designTeam: 10, remotePolicy: 'Hybrid, Lagos',
    roles: [
      { title: 'Design Lead, Payments', comp: '$80–100k', posted: '3w' },
      { title: 'Senior Product Designer, Invoicing', comp: '$55–70k', posted: '6d' },
      { title: 'Product Designer, Android', comp: '$40–55k', posted: '11d' },
    ],
    known: [{ personId: 'amara-okafor' }, { personId: 'yusuf-adeyemi' }, { personId: 'daniel-mensah' }],
  },
  brisa: {
    growth: '+11%', designTeam: 13, remotePolicy: 'Hybrid, Barcelona',
    roles: [
      { title: 'VP Design', comp: '€150–180k', posted: '10d', jobId: 'job-brisa-vp' },
      { title: 'Senior Product Designer, Operator console', comp: '€70–85k', posted: '6d' },
      { title: 'Design Engineer', comp: '€65–80k', posted: '9d' },
    ],
    known: [{ personId: 'ana-ruiz' }, { personId: 'lucia-ferrer' }, { personId: 'sofia-oliveira' }],
  },
  'quanta-labs': {
    growth: '+40%', designTeam: 6, remotePolicy: 'EMEA remote',
    roles: [
      { title: 'Staff Design Engineer, Tokens', comp: '€100–120k', posted: '8d', jobId: 'job-quanta-staff' },
      { title: 'Product Designer, Plugins', comp: '€70–85k', posted: '5d' },
    ],
    known: [{ personId: 'aiko-mori' }, { personId: 'jin-woo-park' }],
  },
  'atlas-maps': {
    growth: '+4%', designTeam: 7, remotePolicy: 'Remote in EU',
    roles: [
      { title: 'Principal Designer, Map Styles', comp: '€95–115k', posted: '12d', jobId: 'job-atlas-principal' },
      { title: 'Cartographer', comp: '€55–70k', posted: '9d' },
      { title: 'Senior Product Designer, SDK', comp: '€70–85k', posted: '14d' },
    ],
    known: [{ personId: 'eleni-papadaki' }],
  },
  fondo: {
    growth: '+16%', designTeam: 7, remotePolicy: 'Hybrid, Milan',
    roles: [
      { title: 'Senior Product Designer, Reporting', comp: '€70–85k', posted: '4d' },
      { title: 'Design Engineer', comp: '€65–80k', posted: '7d' },
    ],
    known: [{ personId: 'giulia-romano' }, { personId: 'chiara-bianchi' }],
  },
}

/** Derived Peek for companies outside the 12 tiles: growth and team size from headcount, known people by employer. */
const derivedSeed = (id: string, headcount: number): DetailSeed => ({
  growth: `+${5 + (headcount % 17)}%`,
  designTeam: Math.max(2, Math.round(headcount / 30)),
  remotePolicy: 'Hybrid',
  roles: [],
  known: allPeople
    .filter((p) => p.companyId === id && p.id !== 'rhea-kovac')
    .slice(0, 4)
    .map((p) => ({ personId: p.id })),
})

/** The company Peek record, or undefined for an unknown id. */
export function getCompanyDetail(id: string | null | undefined): CompanyDetail | undefined {
  const c = getCompanyById(id)
  if (!c) return undefined
  const seed = SEEDS[c.id] ?? derivedSeed(c.id, c.headcount)
  const peopleYouKnow = seed.known
    .map(({ personId, degree }) => {
      const p = getPersonById(personId)
      if (!p) return undefined
      return {
        personId: p.id,
        name: p.name,
        initials: p.initials,
        hue: p.hue as HueIndex,
        degree: degree ?? p.degree,
        headline: p.headline,
      }
    })
    .filter((x): x is NonNullable<typeof x> => !!x)
  return {
    ...c,
    growth: seed.growth,
    designTeam: seed.designTeam,
    remotePolicy: seed.remotePolicy,
    roles: seed.roles,
    peopleYouKnow,
    facts: [
      { label: 'Headcount', value: String(c.headcount), mono: true },
      { label: 'Growth · 12 mo', value: seed.growth, mono: true },
      { label: 'Open roles', value: String(c.openRoles), mono: true },
      { label: 'Design team', value: String(seed.designTeam), mono: true },
      { label: 'Remote policy', value: seed.remotePolicy, mono: false },
    ],
  }
}

/** Identity line under the company name: 'Developer platform · Amsterdam · founded 2017'. */
export const companyIdentityLine = (c: { sector: string; hq: string; founded: number }) =>
  `${c.sector} · ${c.hq} · founded ${c.founded}`
