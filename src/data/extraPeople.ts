// People who are not in the §13.4 result set but appear elsewhere in the data:
// - the viewer's 1° connections and the Halden contacts (shared context, intro flags, company Peek, scorecards)
// - the candidates for req-t114 other than Kwame Asante (§13.10), in lane order
// - deterministic candidates for the other five requisitions (so every requisition's board is populated)
// - the viewer herself (her own profile, "27 people viewed your profile")
// This module must not import people.ts (people.ts imports it).

import type { Degree, FitVector, HiringStage, Person } from './types'
import {
  availability, fitOf, hash, hueOf, initialsOf, matchedSkill as ds, skill as sk, slugify,
} from './helpers'

const person = (p: Person): Person => p

// ---------------------------------------------------------------------------------------------
// Connections and contacts

export const connectionPeople: Person[] = [
  person({
    id: 'jonas-petersen', name: 'Jonas Petersen', initials: 'JP', hue: 3,
    headline: 'Staff Engineer, Canvas', companyId: 'tandem', company: 'Tandem', tenure: '3y',
    city: 'Munich', country: 'Germany', utcOffset: 'UTC+2', years: 12,
    availability: availability('not-looking', '—'),
    degree: 1, relation: 'Colleague',
    fit: fitOf('01100'), evidence: "Leads Tandem's canvas engine",
    skills: [sk('TypeScript'), sk('Rendering'), sk('CRDTs')],
    prev: { role: 'Staff Engineer', company: 'Ledgerline' },
    following: true,
  }),
  person({
    id: 'tomas-rey', name: 'Tomás Rey', initials: 'TR', hue: 5,
    headline: 'Head of Design', companyId: 'mawimbi', company: 'Mawimbi', tenure: '3y',
    city: 'Nairobi', country: 'Kenya', utcOffset: 'UTC+3', years: 15,
    availability: availability('not-looking', '—'),
    degree: 1, relation: 'Worked together',
    fit: fitOf('01110'), evidence: "Built Mawimbi's design team of 9",
    skills: [ds(), sk('Design leadership'), sk('Hiring')],
    prev: { role: 'Design Lead', company: 'Sable' },
    following: true,
  }),
  person({
    id: 'elodie-marchand', name: 'Élodie Marchand', initials: 'EM', hue: 4,
    headline: 'Design Director', companyId: 'mosaic-health', company: 'Mosaic Health', tenure: '5y',
    city: 'Paris', country: 'France', utcOffset: 'UTC+2', years: 16,
    availability: availability('not-looking', '—'),
    degree: 1, relation: 'Follows you',
    fit: fitOf('01100'), evidence: "Leads design for Mosaic's clinics",
    skills: [sk('Design leadership'), sk('Healthcare UX'), sk('Research')],
    prev: { role: 'Head of Design', company: 'Oriel' },
    following: true,
  }),
  person({
    id: 'ana-ruiz', name: 'Ana Ruiz', initials: 'AR', hue: 1,
    headline: 'Principal Designer', companyId: 'brisa', company: 'Brisa', tenure: '5y',
    city: 'Barcelona', country: 'Spain', utcOffset: 'UTC+2', years: 14,
    availability: availability('not-looking', '—'),
    degree: 1, relation: 'Follows you',
    fit: fitOf('11110'), evidence: "Leads Brisa's rider app design",
    skills: [ds(), sk('Mobility UX'), sk('Mentoring')],
    prev: { role: 'Senior Designer', company: 'Movia' },
    following: true,
  }),
  person({
    id: 'lars-visser', name: 'Lars Visser', initials: 'LV', hue: 2,
    headline: 'Engineering Manager, Platform', companyId: 'halden', company: 'Halden', tenure: '4y',
    city: 'Amsterdam', country: 'Netherlands', utcOffset: 'UTC+2', years: 13,
    availability: availability('not-looking', '—'),
    degree: 1, relation: 'Worked together',
    fit: fitOf('01100'), evidence: "Runs Halden's platform team",
    skills: [sk('Developer tools'), sk('Go'), sk('Team leadership')],
    prev: { role: 'Senior Engineer', company: 'Sable' },
    following: true,
  }),
  person({
    id: 'mirte-bakker', name: 'Mirte Bakker', initials: 'MB', hue: 4,
    headline: 'Head of Design', companyId: 'halden', company: 'Halden', tenure: '5y',
    city: 'Amsterdam', country: 'Netherlands', utcOffset: 'UTC+2', years: 16,
    availability: availability('not-looking', '—'),
    degree: 2, relation: '1 mutual', introVia: 'Lars Visser',
    fit: fitOf('01110'), evidence: "Leads Halden's 11-person design team",
    skills: [ds(), sk('Design leadership'), sk('Developer tools')],
    prev: { role: 'Design Manager', company: 'Kanto Studio' },
  }),
]

// ---------------------------------------------------------------------------------------------
// req-t114 candidates (Staff Designer, Canvas), lane order; index = position in the full candidate list.
// Kwame Asante (index 13) is in people.ts. Hue = index % 6 (§13.10).

interface CandidateSeed {
  index: number
  name: string
  city: string; country: string; utcOffset: string
  companyId: string; company: string; tenure: string; years: number
  status: 'open' | 'exploring'; timing: string
  via?: string
  fit: string
  evidence: string
  skills: string[]            // 'DS' marks the matched design-systems skill
  prev: [string, string]
}

const T114_SEEDS: CandidateSeed[] = [
  { index: 0, name: 'Noor Haddad', city: 'Amman', country: 'Jordan', utcOffset: 'UTC+3', companyId: 'dunes-cloud', company: 'Dunes Cloud', tenure: '3y', years: 9, status: 'exploring', timing: 'Jan 2027', fit: '11110', evidence: "Built Dunes Cloud's billing console", skills: ['DS', 'Data-dense UI', 'Prototyping'], prev: ['Product Designer', 'Qanat Systems'] },
  { index: 1, name: 'Rafael Mendes', city: 'Lisbon', country: 'Portugal', utcOffset: 'UTC+1', companyId: 'movia', company: 'Movia', tenure: '3y', years: 8, status: 'exploring', timing: 'Mar 2027', fit: '11100', evidence: "Redesigned Movia's trip planner", skills: ['Mobility UX', 'Research', 'Prototyping'], prev: ['Product Designer', 'Rota Digital'] },
  { index: 2, name: 'Leila Ahmadi', city: 'Paris', country: 'France', utcOffset: 'UTC+2', companyId: 'oriel', company: 'Oriel', tenure: '2y', years: 10, status: 'exploring', timing: 'Jan 2027', via: 'Élodie Marchand', fit: '11110', evidence: "Leads Oriel's editor accessibility", skills: ['DS', 'Editor UX', 'Accessibility'], prev: ['Senior Designer', 'Mosaic Health'] },
  { index: 3, name: 'Oskar Nyberg', city: 'Stockholm', country: 'Sweden', utcOffset: 'UTC+2', companyId: 'klarvik', company: 'Klarvik', tenure: '4y', years: 9, status: 'open', timing: 'Feb 2027', via: 'Tove Lindqvist', fit: '11100', evidence: "Designed Klarvik's savings goals", skills: ['Banking UX', 'Research', 'Prototyping'], prev: ['Product Designer', 'Northdesk'] },
  { index: 4, name: 'Chiara Bianchi', city: 'Milan', country: 'Italy', utcOffset: 'UTC+2', companyId: 'fondo', company: 'Fondo', tenure: '2y', years: 10, status: 'open', timing: 'Nov 2026', via: 'Ana Ruiz', fit: '11101', evidence: "Redesigned Fondo's NAV reporting", skills: ['Data-dense UI', 'Design leadership', 'Research'], prev: ['Senior Product Designer', 'Brisa'] },
  { index: 5, name: 'Daniel Mensah', city: 'Accra', country: 'Ghana', utcOffset: 'UTC+0', companyId: 'tessera', company: 'Tessera', tenure: '3y', years: 8, status: 'exploring', timing: 'Feb 2027', fit: '11100', evidence: "Designed Tessera's invoicing flow", skills: ['Fintech UX', 'Mobile', 'Research'], prev: ['Product Designer', 'Paylane'] },
  { index: 6, name: 'Yuki Tanaka', city: 'Dubai', country: 'United Arab Emirates', utcOffset: 'UTC+4', companyId: 'qanat-systems', company: 'Qanat Systems', tenure: '2y', years: 9, status: 'exploring', timing: 'Mar 2027', fit: '11010', evidence: "Built Qanat's component library", skills: ['DS', 'Developer tools', 'Motion'], prev: ['Product Designer', 'Kanto Studio'] },
  { index: 7, name: 'Ilse de Vries', city: 'Amsterdam', country: 'Netherlands', utcOffset: 'UTC+2', companyId: 'mosaic-health', company: 'Mosaic Health', tenure: '3y', years: 11, status: 'open', timing: 'Dec 2026', via: 'Lars Visser', fit: '11101', evidence: "Led Mosaic's patient intake redesign", skills: ['Healthcare UX', 'Service design', 'Prototyping'], prev: ['Product Designer', 'Halden'] },
  { index: 8, name: 'Anya Petrova', city: 'Tallinn', country: 'Estonia', utcOffset: 'UTC+3', companyId: 'veski', company: 'Veski', tenure: '3y', years: 10, status: 'exploring', timing: 'Jan 2027', via: 'Jonas Petersen', fit: '11110', evidence: "Co-leads Veski's design system", skills: ['DS', 'Design tokens', 'Documentation'], prev: ['Senior Designer', 'Lumo'] },
  { index: 9, name: 'Mehmet Kaya', city: 'Tbilisi', country: 'Georgia', utcOffset: 'UTC+4', companyId: 'orbit-freight', company: 'Orbit Freight', tenure: '2y', years: 9, status: 'open', timing: 'now', fit: '11001', evidence: "Designed Orbit's carrier onboarding", skills: ['Logistics UX', 'Data-dense UI', 'Research'], prev: ['Product Designer', 'Ferro'] },
  { index: 10, name: 'Sofia Oliveira', city: 'Lisbon', country: 'Portugal', utcOffset: 'UTC+1', companyId: 'brisa', company: 'Brisa', tenure: '3y', years: 9, status: 'open', timing: 'Dec 2026', via: 'Priya Raman', fit: '11101', evidence: "Rebuilt Brisa's rider onboarding", skills: ['Onboarding', 'Growth design', 'Research'], prev: ['Product Designer', 'Movia'] },
  { index: 11, name: 'Pieter Jansen', city: 'Amsterdam', country: 'Netherlands', utcOffset: 'UTC+2', companyId: 'halden', company: 'Halden', tenure: '3y', years: 8, status: 'exploring', timing: 'Feb 2027', fit: '11100', evidence: "Designs Halden's deploy history", skills: ['Developer tools', 'Interaction design', 'Prototyping'], prev: ['Product Designer', 'Kanto Studio'] },
  { index: 12, name: 'Zanele Dube', city: 'Cape Town', country: 'South Africa', utcOffset: 'UTC+2', companyId: 'mawimbi', company: 'Mawimbi', tenure: '3y', years: 10, status: 'exploring', timing: 'Jan 2027', via: 'Tomás Rey', fit: '11110', evidence: "Built Mawimbi's merchant app kit", skills: ['DS', 'Mobile money UX', 'Research'], prev: ['Senior Designer', 'Safiri Labs'] },
  { index: 14, name: 'Jin-woo Park', city: 'Berlin', country: 'Germany', utcOffset: 'UTC+2', companyId: 'quanta-labs', company: 'Quanta Labs', tenure: '2y', years: 9, status: 'open', timing: 'Dec 2026', via: 'Aiko Mori', fit: '11101', evidence: "Designed Quanta's token diff viewer", skills: ['Design tooling', 'Prototyping (code)', 'Motion'], prev: ['Product Designer', 'Plinth'] },
  { index: 15, name: 'Marta Nowak', city: 'Warsaw', country: 'Poland', utcOffset: 'UTC+2', companyId: 'ledgerline', company: 'Ledgerline', tenure: '4y', years: 11, status: 'exploring', timing: 'Jan 2027', via: 'Jonas Petersen', fit: '11110', evidence: "Leads Ledgerline's console patterns", skills: ['DS', 'Data-dense UI', 'Accessibility'], prev: ['Product Designer', 'Kanto Studio'] },
  { index: 16, name: 'Elif Şahin', city: 'Istanbul', country: 'Türkiye', utcOffset: 'UTC+3', companyId: 'sable', company: 'Sable', tenure: '2y', years: 8, status: 'exploring', timing: 'Mar 2027', via: 'Priya Raman', fit: '11100', evidence: "Designed Sable's approval rules", skills: ['Workflow design', 'Research', 'UX writing'], prev: ['Product Designer', 'Pazarlab'] },
  { index: 17, name: 'Arjun Mehta', city: 'London', country: 'United Kingdom', utcOffset: 'UTC+1', companyId: 'northdesk', company: 'Northdesk', tenure: '3y', years: 10, status: 'open', timing: 'Nov 2026', via: 'Tove Lindqvist', fit: '11101', evidence: "Designed Northdesk's macro editor", skills: ['Agent tooling', 'Data-dense UI', 'Research'], prev: ['Product Designer', 'Sable'] },
  { index: 18, name: 'Camila Reyes', city: 'Madrid', country: 'Spain', utcOffset: 'UTC+2', companyId: 'lienzo', company: 'Lienzo', tenure: '3y', years: 12, status: 'open', timing: 'Dec 2026', via: 'Élodie Marchand', fit: '11111', evidence: "Designed Lienzo's canvas and system", skills: ['DS', 'Editor / canvas UX', 'Prototyping (code)'], prev: ['Senior Product Designer', 'Oriel'] },
  { index: 19, name: 'Henrik Lund', city: 'Copenhagen', country: 'Denmark', utcOffset: 'UTC+2', companyId: 'plinth', company: 'Plinth', tenure: '3y', years: 12, status: 'exploring', timing: 'Jan 2027', via: 'Aiko Mori', fit: '11110', evidence: "Designed Plinth's comments layer", skills: ['DS', 'Editor / canvas UX', 'Multiplayer UX'], prev: ['Senior Designer', 'Klarvik'] },
  { index: 20, name: 'Laila Karimi', city: 'Berlin', country: 'Germany', utcOffset: 'UTC+2', companyId: 'kreis-studio', company: 'Kreis Studio', tenure: '4y', years: 10, status: 'open', timing: 'now', fit: '11101', evidence: "Runs Kreis's prototyping practice", skills: ['Prototyping', 'Interaction design', 'Motion'], prev: ['Interaction Designer', 'Wirkung Mobility'] },
  { index: 21, name: 'Thomas Brandt', city: 'Zurich', country: 'Switzerland', utcOffset: 'UTC+2', companyId: 'ferro', company: 'Ferro', tenure: '3y', years: 13, status: 'open', timing: 'Nov 2026', via: 'Jonas Petersen', fit: '11111', evidence: "Built Ferro's design system from zero", skills: ['DS', 'Data-dense UI', 'Prototyping (code)'], prev: ['Senior Product Designer', 'Ledgerline'] },
]

const seedToPerson = (c: CandidateSeed): Person => ({
  id: slugify(c.name),
  name: c.name,
  initials: initialsOf(c.name),
  hue: hueOf(c.index),
  headline: 'Senior Product Designer',
  companyId: c.companyId,
  company: c.company,
  tenure: c.tenure,
  city: c.city,
  country: c.country,
  utcOffset: c.utcOffset,
  years: c.years,
  availability: availability(c.status, c.timing),
  degree: c.via ? 2 : 3,
  relation: 'In pipeline',
  introVia: c.via,
  fit: fitOf(c.fit),
  evidence: c.evidence,
  skills: c.skills.map((s) => (s === 'DS' ? ds() : sk(s))),
  prev: { role: c.prev[0], company: c.prev[1] },
})

/** req-t114 candidates other than Kwame Asante, as Person records (lane order). */
export const t114CandidatePeople: Person[] = T114_SEEDS.map(seedToPerson)

/** Position of each req-t114 candidate in the full candidate list (0–21), keyed by person id. */
export const t114CandidateIndex: Record<string, number> = Object.fromEntries(
  T114_SEEDS.map((c) => [slugify(c.name), c.index]),
)

// ---------------------------------------------------------------------------------------------
// The viewer as a person (her own profile, "viewed your profile").

export const viewerPerson: Person = {
  id: 'rhea-kovac', name: 'Rhea Kovač', initials: 'RK', hue: 2,
  headline: 'Design Director', companyId: 'tandem', company: 'Tandem', tenure: '3y',
  city: 'Munich', country: 'Germany', utcOffset: 'UTC+2', years: 14,
  availability: availability('not-looking', '—'),
  degree: 'team', relation: 'You',
  fit: fitOf('01110'), evidence: "Leads Tandem's design team of nine",
  skills: [ds(), sk('Design leadership'), sk('Hiring'), sk('Workflow design')],
  prev: { role: 'Design Lead, Approvals', company: 'Sable' },
}

/** Connections, Halden contacts and req-t114 candidates (everyone hand-written outside people.ts). */
export const extraPeople: Person[] = [...connectionPeople, ...t114CandidatePeople]

// ---------------------------------------------------------------------------------------------
// Deterministic candidates for the other requisitions.

export interface GeneratedCandidateSeed {
  personId: string
  requisitionId: string
  stage: HiringStage
  daysInStage: number
  source: 'sourced' | 'referral' | 'applied'
  /** fit against the requisition's own clauses (see hiring.ts `requisitionClauses`). */
  fit: FitVector
  /** position in that requisition's candidate list (hue = position % 6). */
  position: number
}

const FIRST = [
  'Aino', 'Bram', 'Clara', 'Dario', 'Emre', 'Farah', 'Gideon', 'Hanne', 'Idris', 'Johanna',
  'Karim', 'Liv', 'Matteo', 'Nadia', 'Olu', 'Paula', 'Quentin', 'Rania', 'Stefan', 'Tamar',
  'Uma', 'Viktor', 'Wiebke', 'Xavier', 'Yara', 'Zoltán', 'Amina', 'Bastien', 'Chidi', 'Dunja',
  'Esra', 'Filip', 'Greta', 'Hamza', 'Inès', 'Jakub', 'Kofi', 'Lotte', 'Mariam', 'Nils',
]
const LAST = [
  'Virtanen', 'Hoekstra', 'Dubois', 'Ricci', 'Yılmaz', 'Haddou', 'Levi', 'Solberg', 'Bello', 'Weber',
  'Mansour', 'Berg', 'Conti', 'Rahimi', 'Adebayo', 'Novák', 'Garnier', 'Saleh', 'Horváth', 'Cohen',
  'Nair', 'Sokolov', 'Jensen', 'Moreno', 'Aziz', 'Varga', 'Diallo', 'Lefebvre', 'Eze', 'Kovács',
  'Aydın', 'Wójcik', 'Lindgren', 'Khalil', 'Pereira', 'Zieliński', 'Owusu', 'Janssens', 'Farahani', 'Holm',
]
const CITIES: [string, string, string][] = [
  ['Berlin', 'Germany', 'UTC+2'], ['Amsterdam', 'Netherlands', 'UTC+2'], ['Lisbon', 'Portugal', 'UTC+1'],
  ['Warsaw', 'Poland', 'UTC+2'], ['Stockholm', 'Sweden', 'UTC+2'], ['Madrid', 'Spain', 'UTC+2'],
  ['Vienna', 'Austria', 'UTC+2'], ['Prague', 'Czechia', 'UTC+2'], ['London', 'United Kingdom', 'UTC+1'],
  ['Dublin', 'Ireland', 'UTC+1'], ['Helsinki', 'Finland', 'UTC+3'], ['Athens', 'Greece', 'UTC+3'],
  ['Nairobi', 'Kenya', 'UTC+3'], ['Lagos', 'Nigeria', 'UTC+1'], ['Cairo', 'Egypt', 'UTC+3'],
  ['Tallinn', 'Estonia', 'UTC+3'], ['Munich', 'Germany', 'UTC+2'], ['Copenhagen', 'Denmark', 'UTC+2'],
  ['Milan', 'Italy', 'UTC+2'], ['Istanbul', 'Türkiye', 'UTC+3'], ['Dubai', 'United Arab Emirates', 'UTC+4'],
  ['Accra', 'Ghana', 'UTC+0'],
]
const COMPANIES: [string, string][] = [
  ['plinth', 'Plinth'], ['oriel', 'Oriel'], ['halden', 'Halden'], ['northdesk', 'Northdesk'],
  ['ledgerline', 'Ledgerline'], ['sable', 'Sable'], ['mawimbi', 'Mawimbi'], ['tessera', 'Tessera'],
  ['brisa', 'Brisa'], ['quanta-labs', 'Quanta Labs'], ['atlas-maps', 'Atlas Maps'], ['fondo', 'Fondo'],
  ['veski', 'Veski'], ['hekla-health', 'Hekla Health'], ['klarvik', 'Klarvik'], ['movia', 'Movia'],
  ['ferro', 'Ferro'], ['lienzo', 'Lienzo'], ['kreis-studio', 'Kreis Studio'], ['pryvit-bank', 'Pryvit Bank'],
]
const VIA = ['Jonas Petersen', 'Aiko Mori', 'Tove Lindqvist', 'Priya Raman', 'Tomás Rey', 'Élodie Marchand', 'Ana Ruiz', 'Lars Visser']
const TIMINGS = ['now', 'Oct 2026', 'Nov 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027']

interface ReqProfile {
  id: string
  stages: Record<HiringStage, number>
  headlines: [string, string]           // [senior variant, other variant]
  years: [number, number]               // min, max
  skills: string[]                      // pool; 'DS' = matched design systems
  prevRole: string
  evidence: ((co: string) => string)[]
  designer: boolean
}

const REQ_PROFILES: ReqProfile[] = [
  {
    id: 'req-t109', stages: { new: 11, screen: 9, interview: 6, final: 3, offer: 2 },
    headlines: ['Senior Product Designer', 'Product Designer'], years: [6, 12],
    skills: ['Editor UX', 'Interaction design', 'DS', 'Prototyping', 'Collaboration UX'], prevRole: 'Product Designer',
    evidence: [(c) => `Owns ${c}'s editor surfaces`, (c) => `Redesigned ${c}'s comments`, (c) => `Led ${c}'s document editor`],
    designer: true,
  },
  {
    id: 'req-t121', stages: { new: 5, screen: 4, interview: 3, final: 2, offer: 0 },
    headlines: ['Design Engineer', 'Senior Frontend Engineer'], years: [4, 10],
    skills: ['React', 'TypeScript', 'DS', 'Motion', 'Design tokens'], prevRole: 'Frontend Engineer',
    evidence: [(c) => `Builds ${c}'s component library`, (c) => `Ships ${c}'s design tokens`, (c) => `Owns ${c}'s UI kit in React`],
    designer: false,
  },
  {
    id: 'req-t098', stages: { new: 30, screen: 16, interview: 8, final: 4, offer: 0 },
    headlines: ['Junior Product Designer', 'Design Intern'], years: [2, 2],
    skills: ['Prototyping', 'Research', 'Visual design', 'Interaction design'], prevRole: 'Design Intern',
    evidence: [(c) => `Prototyped ${c}'s onboarding`, (c) => `Six months on ${c}'s app team`, (c) => `Redesigned ${c}'s settings`],
    designer: true,
  },
  {
    id: 'req-t117', stages: { new: 16, screen: 12, interview: 7, final: 4, offer: 1 },
    headlines: ['Staff Engineer', 'Senior Software Engineer'], years: [7, 15],
    skills: ['CRDTs', 'TypeScript', 'Rust', 'Distributed systems'], prevRole: 'Senior Software Engineer',
    evidence: [(c) => `Built ${c}'s offline sync`, (c) => `Owns ${c}'s realtime backend`, (c) => `Scaled ${c}'s event pipeline`],
    designer: false,
  },
  {
    id: 'req-t102', stages: { new: 7, screen: 6, interview: 4, final: 2, offer: 0 },
    headlines: ['Engineering Manager', 'Senior Engineering Manager'], years: [9, 16],
    skills: ['Team leadership', 'Hiring', 'Platform', 'Go'], prevRole: 'Engineering Manager',
    evidence: [(c) => `Manages ${c}'s platform team`, (c) => `Leads 2 infra teams at ${c}`, (c) => `Grew ${c}'s platform org to 14`],
    designer: false,
  },
]

const STAGE_ORDER: HiringStage[] = ['new', 'screen', 'interview', 'final', 'offer']

const inRegion = (offset: string) => {
  const m = /UTC([+−-])(\d+)/.exec(offset)
  const h = m ? (m[1] === '+' ? 1 : -1) * Number(m[2]) : 0
  return h >= -1 && h <= 3
}
const soon = (timing: string) => ['now', 'Oct 2026', 'Nov 2026', 'Dec 2026'].includes(timing)

function generate(): { people: Person[]; seeds: GeneratedCandidateSeed[] } {
  const taken = new Set<string>([
    ...connectionPeople.map((p) => p.name),
    ...t114CandidatePeople.map((p) => p.name),
  ])
  const outPeople: Person[] = []
  const seeds: GeneratedCandidateSeed[] = []
  let g = 0
  for (const req of REQ_PROFILES) {
    let position = 0
    for (const stage of STAGE_ORDER) {
      const n = req.stages[stage]
      for (let k = 0; k < n; k++, g++, position++) {
        // A unique name from the pools.
        let name = ''
        for (let bump = 0; ; bump++) {
          const f = FIRST[(g * 7 + 3 + bump) % FIRST.length]!
          const l = LAST[(g * 13 + Math.floor(g / LAST.length) * 7 + 5 + bump * 3) % LAST.length]!
          name = `${f} ${l}`
          if (!taken.has(name)) break
        }
        taken.add(name)
        const h = hash(`${req.id}:${name}`)
        const [city, country, utcOffset] = CITIES[h % CITIES.length]!
        const [companyId, company] = COMPANIES[(h >>> 5) % COMPANIES.length]!
        const [prevId] = COMPANIES[(h >>> 9) % COMPANIES.length]!
        const prevCompany = COMPANIES.find(([id]) => id === prevId && id !== companyId)?.[1] ?? 'Kanto Studio'
        const years = req.years[0] + ((h >>> 3) % (req.years[1] - req.years[0] + 1))
        const tenureYears = Math.max(1, Math.min(years - 1, 1 + ((h >>> 11) % 4)))
        const senior = (h >>> 13) % 3 !== 0
        const headline = senior ? req.headlines[0] : req.headlines[1]
        const status = (h >>> 15) % 3 === 0 ? 'exploring' : 'open'
        const timing = TIMINGS[(h >>> 17) % TIMINGS.length]!
        const pool = req.skills
        const start = (h >>> 19) % pool.length
        const picked = [0, 1, 2].map((i) => pool[(start + i) % pool.length]!)
        const hasDs = picked.includes('DS')
        const skills = [...picked].sort((a, b) => Number(b === 'DS') - Number(a === 'DS')).map((s) => (s === 'DS' ? ds() : sk(s)))
        const via = (h >>> 21) % 3 === 0 ? VIA[(h >>> 23) % VIA.length] : undefined
        const degree: Degree = via ? 2 : 3
        const evidence = req.evidence[(h >>> 25) % req.evidence.length]!(company)

        // Fit against the People clauses (inspector Fit block).
        const peopleFit: FitVector = [
          req.designer && headline.includes('Product Designer'),
          years >= 8 || /Senior|Staff|Principal|Lead/.test(headline),
          inRegion(utcOffset),
          hasDs,
          soon(timing),
        ]
        // Fit against the requisition's own clauses: region and availability are real; the rest lean met
        // as a candidate advances.
        const stageBias = STAGE_ORDER.indexOf(stage)
        const reqFit: FitVector = [
          true,
          (h >>> 27) % 4 !== 0 || stageBias >= 2,
          inRegion(utcOffset),
          (h >>> 29) % 3 !== 0 || stageBias >= 3,
          soon(timing),
        ]
        const id = slugify(name)
        outPeople.push({
          id, name, initials: initialsOf(name), hue: hueOf(position),
          headline, companyId, company, tenure: `${tenureYears}y`,
          city, country, utcOffset, years,
          availability: availability(status, timing),
          degree, relation: 'In pipeline', introVia: via,
          fit: peopleFit, evidence, skills,
          prev: { role: req.prevRole, company: prevCompany },
        })
        seeds.push({
          personId: id, requisitionId: req.id, stage,
          daysInStage: 1 + ((h >>> 7) % 13),
          source: (['sourced', 'referral', 'applied'] as const)[(h >>> 1) % 3]!,
          fit: reqFit, position,
        })
      }
    }
  }
  return { people: outPeople, seeds }
}

const generated = generate()

/** Person records for the generated candidates of req-t109, t121, t098, t117 and t102. */
export const generatedPeople: Person[] = generated.people
/** Pipeline placement of each generated candidate. */
export const generatedCandidateSeeds: GeneratedCandidateSeed[] = generated.seeds
