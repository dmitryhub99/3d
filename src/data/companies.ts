// §13.6 Companies, in tile order (strip: Hiring now). Hue = index % 6; companies not in this list use hue 5.

import type { Company, HueIndex, Query, Segment } from './types'
import { hueOf } from './helpers'

type Row = Omit<Company, 'hue'>

const ROWS: Row[] = [
  { id: 'plinth', name: 'Plinth', sector: 'Collaborative canvas', hq: 'Berlin', founded: 2019, headcount: 180, openRoles: 3, youKnow: 6, thesis: 'A canvas that teams can actually think on.', following: true },
  { id: 'oriel', name: 'Oriel', sector: 'Editor tools', hq: 'Paris', founded: 2018, headcount: 95, openRoles: 2, youKnow: 3, thesis: 'Open editing primitives for serious writing tools.', following: true },
  { id: 'halden', name: 'Halden', sector: 'Developer platform', hq: 'Amsterdam', founded: 2017, headcount: 420, openRoles: 6, youKnow: 4, thesis: 'Build pipelines that explain themselves.', following: false },
  { id: 'northdesk', name: 'Northdesk', sector: 'Support software', hq: 'Stockholm', founded: 2016, headcount: 260, openRoles: 4, youKnow: 5, thesis: "Support queues designed around the agent's day.", following: true },
  { id: 'ledgerline', name: 'Ledgerline', sector: 'Payments infrastructure', hq: 'Warsaw', founded: 2015, headcount: 610, openRoles: 9, youKnow: 7, thesis: 'Reconciliation you never have to think about.', following: false },
  { id: 'sable', name: 'Sable', sector: 'Workflow automation', hq: 'London', founded: 2018, headcount: 340, openRoles: 5, youKnow: 3, thesis: 'Approvals and handoffs as a product, not a form.', following: true },
  { id: 'mawimbi', name: 'Mawimbi', sector: 'Mobile money', hq: 'Nairobi', founded: 2016, headcount: 510, openRoles: 7, youKnow: 2, thesis: 'Wallets for small merchants across East Africa.', following: false },
  { id: 'tessera', name: 'Tessera', sector: 'Merchant banking', hq: 'Lagos', founded: 2019, headcount: 380, openRoles: 4, youKnow: 3, thesis: 'Business accounts for West African merchants.', following: false },
  { id: 'brisa', name: 'Brisa', sector: 'Consumer mobility', hq: 'Barcelona', founded: 2017, headcount: 290, openRoles: 3, youKnow: 4, thesis: 'Shared e-bikes priced like public transport.', following: false },
  { id: 'quanta-labs', name: 'Quanta Labs', sector: 'Design infrastructure', hq: 'Berlin', founded: 2021, headcount: 70, openRoles: 2, youKnow: 3, thesis: 'Design tokens as a build artifact.', following: true },
  { id: 'atlas-maps', name: 'Atlas Maps', sector: 'Mapping platform', hq: 'Athens', founded: 2014, headcount: 150, openRoles: 3, youKnow: 2, thesis: 'Map styles that read at every zoom.', following: false },
  { id: 'fondo', name: 'Fondo', sector: 'Fund administration', hq: 'Milan', founded: 2020, headcount: 220, openRoles: 2, youKnow: 2, thesis: 'Back-office software for small funds.', following: false },
]

/** The 12 tiles of Companies › Hiring now, in order. */
export const companies: Company[] = ROWS.map((r, i) => ({ ...r, hue: hueOf(i) }))

const other = (r: Row): Company => ({ ...r, hue: 5 })

/** Companies referenced elsewhere (current employers, clients, the viewer's company). Hue 5 (§13.4). */
export const otherCompanies: Company[] = [
  other({ id: 'tandem', name: 'Tandem', sector: 'Shared workspace', hq: 'Munich', founded: 2018, headcount: 240, openRoles: 6, youKnow: 31, thesis: 'One canvas for how engineering teams plan.', following: true }),
  other({ id: 'veski', name: 'Veski', sector: 'Accounting software', hq: 'Tallinn', founded: 2018, headcount: 130, openRoles: 2, youKnow: 2, thesis: 'Bookkeeping that closes itself at month end.', following: false }),
  other({ id: 'orbit-freight', name: 'Orbit Freight', sector: 'Freight logistics', hq: 'Casablanca', founded: 2017, headcount: 460, openRoles: 5, youKnow: 1, thesis: 'Dispatch software for regional carriers.', following: false }),
  other({ id: 'pryvit-bank', name: 'Pryvit Bank', sector: 'Retail banking', hq: 'Kyiv', founded: 2019, headcount: 700, openRoles: 8, youKnow: 1, thesis: 'A bank that works through power cuts.', following: false }),
  other({ id: 'dunes-cloud', name: 'Dunes Cloud', sector: 'Cloud infrastructure', hq: 'Dubai', founded: 2018, headcount: 540, openRoles: 6, youKnow: 2, thesis: 'Regional cloud with a console people can read.', following: false }),
  other({ id: 'mercado-nuvem', name: 'Mercado Nuvem', sector: 'Commerce platform', hq: 'São Paulo', founded: 2015, headcount: 880, openRoles: 11, youKnow: 1, thesis: 'Online stores for 40,000 small merchants.', following: false }),
  other({ id: 'hekla-health', name: 'Hekla Health', sector: 'Clinical software', hq: 'Reykjavík', founded: 2016, headcount: 190, openRoles: 3, youKnow: 1, thesis: 'Scheduling and notes built with clinicians.', following: false }),
  other({ id: 'wirkung-mobility', name: 'Wirkung Mobility', sector: 'Automotive software', hq: 'Hamburg', founded: 2012, headcount: 1400, openRoles: 14, youKnow: 3, thesis: 'In-car interfaces for two European carmakers.', following: false }),
  other({ id: 'mosaic-health', name: 'Mosaic Health', sector: 'Health records', hq: 'Paris', founded: 2013, headcount: 520, openRoles: 4, youKnow: 4, thesis: 'Patient records that clinics share.', following: false }),
  other({ id: 'qanat-systems', name: 'Qanat Systems', sector: 'Cloud tooling', hq: 'Dubai', founded: 2016, headcount: 210, openRoles: 3, youKnow: 1, thesis: 'Observability for Gulf enterprises.', following: false }),
  other({ id: 'movia', name: 'Movia', sector: 'Transit apps', hq: 'Lisbon', founded: 2015, headcount: 160, openRoles: 2, youKnow: 2, thesis: 'One ticket for every Iberian city.', following: false }),
  other({ id: 'klarvik', name: 'Klarvik', sector: 'Consumer banking', hq: 'Stockholm', founded: 2014, headcount: 450, openRoles: 5, youKnow: 2, thesis: 'Savings accounts that explain themselves.', following: false }),
  other({ id: 'lienzo', name: 'Lienzo', sector: 'Whiteboarding', hq: 'Madrid', founded: 2020, headcount: 60, openRoles: 1, youKnow: 1, thesis: 'A whiteboard for classrooms and studios.', following: false }),
  other({ id: 'kreis-studio', name: 'Kreis Studio', sector: 'Design studio', hq: 'Berlin', founded: 2011, headcount: 35, openRoles: 1, youKnow: 2, thesis: 'Prototypes for hardware and mobility clients.', following: false }),
  other({ id: 'ferro', name: 'Ferro', sector: 'Rail logistics', hq: 'Zurich', founded: 2014, headcount: 310, openRoles: 3, youKnow: 1, thesis: 'Capacity planning for European rail freight.', following: false }),
]

const byId = new Map<string, Company>([...companies, ...otherCompanies].map((c) => [c.id, c]))

/** Any company in the data (the 12 tiles, then the others). */
export const allCompanies: Company[] = [...companies, ...otherCompanies]

export function getCompanyById(id: string | null | undefined): Company | undefined {
  return id ? byId.get(id) : undefined
}

/** Glyph hue for a company id: its tile index % 6, or 5 when it is not in companies.ts. */
export function companyHue(id: string | null | undefined): HueIndex {
  const i = companies.findIndex((c) => c.id === id)
  return i >= 0 ? hueOf(i) : 5
}

/** Companies strip (§5.4). */
export const companiesSegments: Segment[] = [
  { id: 'following', label: 'Following', count: 64 },
  { id: 'hiring-now', label: 'Hiring now', count: 23 },
  { id: 'design-led', label: 'Design-led', count: 41 },
  { id: 'fintech-emea', label: 'Fintech · EMEA', count: 18 },
]

/** Companies query line (§5.4): [1] hiring designers [2] in EMEA [3] 50–500 people — by open roles. */
export const companiesQuery: Query = {
  clauses: [
    { index: 1, key: 'hiring', value: 'hiring designers' },
    { index: 2, key: 'region', lead: 'in', value: 'EMEA' },
    { index: 3, key: 'size', value: '50–500 people' },
  ],
  sort: { lead: '— by', value: 'open roles' },
}

/** Tiles shown for each Companies segment (the strip counts are totals; these are the loaded tiles). */
export function companiesForSegment(segmentId: string): Company[] {
  switch (segmentId) {
    case 'following':
      return allCompanies.filter((c) => c.following && c.id !== 'tandem')
    case 'design-led':
      return companies.filter((c) => ['plinth', 'oriel', 'quanta-labs', 'northdesk', 'atlas-maps', 'sable'].includes(c.id))
    case 'fintech-emea':
      return allCompanies.filter((c) => ['ledgerline', 'mawimbi', 'tessera', 'fondo', 'veski', 'pryvit-bank', 'klarvik'].includes(c.id))
    case 'hiring-now':
    default:
      return companies
  }
}

/** Company ids of the Hiring now tiles, in order (Companies `objectOrder`). */
export const companyIds: string[] = companies.map((c) => c.id)
