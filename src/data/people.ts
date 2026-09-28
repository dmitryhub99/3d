// §13.4 The People result set: exactly 22 people, in display order (fit desc, then years in matched skill).
// Row city is `city` only; the country appears only in the inspector.

import type { Degree, Person } from './types'
import { availability, fitCount, fitFraction, fitOf, matchedSkill as ds, skill as sk } from './helpers'
import { extraPeople, generatedPeople, viewerPerson } from './extraPeople'

export { availability, fitCount, fitFraction, fitOf }

const row = (r: Person): Person => r
const deg = (d: Degree) => d

export const people: Person[] = [
  row({
    id: 'aurelien-duclos', name: 'Aurélien Duclos', initials: 'AD', hue: 2,
    headline: 'Principal Designer, Editor', companyId: 'oriel', company: 'Oriel', tenure: '6y',
    city: 'Paris', country: 'France', utcOffset: 'UTC+2', years: 14,
    availability: availability('open', 'Nov 2026'),
    degree: deg(2), relation: '5 mutual', introVia: 'Élodie Marchand',
    fit: fitOf('11111'), evidence: "Built Oriel's token pipeline",
    skills: [ds(), sk('Design tokens'), sk('Editor UX'), sk('Prototyping')],
    prev: { role: 'Senior Designer', company: 'Mosaic Health' },
    saved: true,
  }),
  row({
    id: 'tove-lindqvist', name: 'Tove Lindqvist', initials: 'TL', hue: 3,
    headline: 'Staff Product Designer', companyId: 'northdesk', company: 'Northdesk', tenure: '3y',
    city: 'Stockholm', country: 'Sweden', utcOffset: 'UTC+2', years: 12,
    availability: availability('exploring', 'Dec 2026'),
    degree: deg(1), relation: 'Follows you',
    fit: fitOf('11111'), evidence: "Leads Northdesk's system, 4 teams",
    skills: [ds(), sk('Accessibility'), sk('Design tooling'), sk('Figma API')],
    prev: { role: 'Senior Product Designer', company: 'Klarvik' },
    following: true, saved: true,
  }),
  row({
    id: 'kwame-asante', name: 'Kwame Asante', initials: 'KA', hue: 1,
    headline: 'Senior Product Designer, Platform', companyId: 'halden', company: 'Halden', tenure: '2y',
    city: 'Amsterdam', country: 'Netherlands', utcOffset: 'UTC+2', years: 9,
    availability: availability('open', 'Oct 2026'),
    degree: deg(2), relation: 'In pipeline', introVia: 'Aiko Mori',
    fit: fitOf('11111'), evidence: "Rebuilt Halden's library in code",
    skills: [ds(), sk('React'), sk('Figma API'), sk('Motion')],
    prev: { role: 'Product Designer', company: 'Tessera' },
    saved: true,
  }),
  row({
    id: 'maren-aaltonen', name: 'Maren Aaltonen', initials: 'MA', hue: 0,
    headline: 'Senior Product Designer', companyId: 'plinth', company: 'Plinth', tenure: '3y',
    city: 'Berlin', country: 'Germany', utcOffset: 'UTC+2', years: 11,
    availability: availability('open', 'Jan 2027'),
    degree: deg(2), relation: '3 mutual', introVia: 'Jonas Petersen',
    fit: fitOf('11110'), evidence: "Leads Plinth's design system",
    skills: [ds(), sk('Editor / canvas UX'), sk('Prototyping (code)'), sk('Multiplayer UX')],
    prev: { role: 'Product Designer, Console', company: 'Ledgerline' },
    saved: true,
  }),
  row({
    id: 'wanjiru-kamau', name: 'Wanjiru Kamau', initials: 'WK', hue: 4,
    headline: 'Lead Product Designer', companyId: 'mawimbi', company: 'Mawimbi', tenure: '4y',
    city: 'Nairobi', country: 'Kenya', utcOffset: 'UTC+3', years: 10,
    availability: availability('exploring', 'Feb 2027'),
    degree: deg(2), relation: '1 mutual', introVia: 'Tomás Rey',
    fit: fitOf('11110'), evidence: "Runs Mawimbi's design system guild",
    skills: [ds(), sk('Mobile money UX'), sk('Research'), sk('Facilitation')],
    prev: { role: 'Senior Designer', company: 'Safiri Labs' },
    saved: true,
  }),
  row({
    id: 'mateusz-krol', name: 'Mateusz Król', initials: 'MK', hue: 5,
    headline: 'Senior UX Engineer', companyId: 'ledgerline', company: 'Ledgerline', tenure: '2y',
    city: 'Warsaw', country: 'Poland', utcOffset: 'UTC+2', years: 8,
    availability: availability('freelance', '2 d/wk'),
    degree: deg(2), relation: '1 mutual', introVia: 'Jonas Petersen',
    fit: fitOf('01111'), evidence: "Maintains Ledgerline's React kit",
    skills: [ds(), sk('React'), sk('Prototyping'), sk('Accessibility')],
    prev: { role: 'Frontend Engineer', company: 'Kanto Studio' },
    saved: true,
  }),
  row({
    id: 'aiko-mori', name: 'Aiko Mori', initials: 'AM', hue: 2,
    headline: 'Staff Designer, Systems', companyId: 'quanta-labs', company: 'Quanta Labs', tenure: '4y',
    city: 'Berlin', country: 'Germany', utcOffset: 'UTC+2', years: 13,
    availability: availability('exploring', 'Mar 2027'),
    degree: deg(1), relation: 'Replied',
    fit: fitOf('11110'), evidence: "Co-authored Quanta's token spec",
    skills: [ds(), sk('Design tokens'), sk('Documentation'), sk('Figma API')],
    prev: { role: 'Senior Designer', company: 'Tandem' },
    following: true, saved: true,
  }),
  row({
    id: 'priya-raman', name: 'Priya Raman', initials: 'PR', hue: 0,
    headline: 'Lead Designer, Workflows', companyId: 'sable', company: 'Sable', tenure: '4y',
    city: 'London', country: 'United Kingdom', utcOffset: 'UTC+1', years: 12,
    availability: availability('not-looking', '—'),
    degree: deg(1), relation: 'Follows you',
    fit: fitOf('11110'), evidence: "Owns Sable's workflow patterns",
    skills: [ds(), sk('Workflow design'), sk('Research'), sk('Service design')],
    prev: { role: 'Senior Product Designer', company: 'Brisa' },
    following: true,
  }),
  row({
    id: 'eleni-papadaki', name: 'Eleni Papadaki', initials: 'EP', hue: 3,
    headline: 'Principal Designer', companyId: 'atlas-maps', company: 'Atlas Maps', tenure: '5y',
    city: 'Athens', country: 'Greece', utcOffset: 'UTC+3', years: 15,
    availability: availability('exploring', 'Jan 2027'),
    degree: deg(2), relation: '2 mutual', introVia: 'Tove Lindqvist',
    fit: fitOf('11110'), evidence: "Built Atlas's map UI system",
    skills: [ds(), sk('Cartography UI'), sk('Data visualisation')],
    prev: { role: 'Senior Designer', company: 'Periptero' },
    saved: true,
  }),
  row({
    id: 'amara-okafor', name: 'Amara Okafor', initials: 'AO', hue: 3,
    headline: 'Principal Product Designer', companyId: 'tessera', company: 'Tessera', tenure: '5y',
    city: 'Lagos', country: 'Nigeria', utcOffset: 'UTC+1', years: 12,
    availability: availability('open', 'Dec 2026'),
    degree: deg(3), relation: 'Viewed job',
    fit: fitOf('11101'), evidence: "Took Tessera's merchant app to 2M",
    skills: [sk('Fintech UX'), sk('Design leadership'), sk('Research'), sk('Mobile')],
    prev: { role: 'Senior Product Designer', company: 'Paylane' },
  }),
  row({
    id: 'lucia-ferrer', name: 'Lucía Ferrer', initials: 'LF', hue: 1,
    headline: 'Design Lead, Growth', companyId: 'brisa', company: 'Brisa', tenure: '2y',
    city: 'Barcelona', country: 'Spain', utcOffset: 'UTC+2', years: 10,
    availability: availability('open', 'now'),
    degree: deg(2), relation: '4 mutual', introVia: 'Priya Raman',
    fit: fitOf('11101'), evidence: 'Leads growth design, 3 squads',
    skills: [sk('Growth design'), sk('Experimentation'), sk('Onboarding')],
    prev: { role: 'Senior Product Designer', company: 'Movia' },
  }),
  row({
    id: 'samir-benali', name: 'Samir Benali', initials: 'SB', hue: 5,
    headline: 'Senior Product Designer', companyId: 'orbit-freight', company: 'Orbit Freight', tenure: '3y',
    city: 'Casablanca', country: 'Morocco', utcOffset: 'UTC+1', years: 9,
    availability: availability('open', 'now'),
    degree: deg(3), relation: 'Replied',
    fit: fitOf('11101'), evidence: "Designed Orbit's dispatch console",
    skills: [sk('Data-dense UI'), sk('Logistics UX'), sk('Prototyping')],
    prev: { role: 'Product Designer', company: 'Ferro' },
  }),
  row({
    id: 'dmytro-shevchenko', name: 'Dmytro Shevchenko', initials: 'DS', hue: 2,
    headline: 'Senior Product Designer', companyId: 'pryvit-bank', company: 'Pryvit Bank', tenure: '3y',
    city: 'Kyiv', country: 'Ukraine', utcOffset: 'UTC+3', years: 8,
    availability: availability('open', 'now'),
    degree: deg(3), relation: 'Follows you',
    fit: fitOf('11101'), evidence: "Designed Pryvit's card controls",
    skills: [sk('Mobile banking'), sk('Interaction design'), sk('Prototyping')],
    prev: { role: 'Product Designer', company: 'Hromada' },
  }),
  row({
    id: 'giulia-romano', name: 'Giulia Romano', initials: 'GR', hue: 4,
    headline: 'Design Manager', companyId: 'fondo', company: 'Fondo', tenure: '3y',
    city: 'Milan', country: 'Italy', utcOffset: 'UTC+2', years: 13,
    availability: availability('open', 'Nov 2026'),
    degree: deg(2), relation: '2 mutual', introVia: 'Ana Ruiz',
    fit: fitOf('01111'), evidence: "Runs Fondo's 7-person design team",
    skills: [ds(), sk('Design leadership'), sk('Hiring'), sk('Design ops')],
    prev: { role: 'Design Lead', company: 'Brisa' },
    saved: true,
  }),
  row({
    id: 'omar-farouk', name: 'Omar Farouk', initials: 'OF', hue: 1,
    headline: 'Staff Product Designer', companyId: 'dunes-cloud', company: 'Dunes Cloud', tenure: '2y',
    city: 'Dubai', country: 'United Arab Emirates', utcOffset: 'UTC+4', years: 11,
    availability: availability('open', 'Nov 2026'),
    degree: deg(3), relation: 'Viewed job',
    fit: fitOf('11001'), evidence: 'Leads console UX at Dunes Cloud',
    skills: [sk('Developer tools'), sk('Data-dense UI'), sk('Prototyping')],
    prev: { role: 'Senior Designer', company: 'Qanat Systems' },
  }),
  row({
    id: 'beatriz-costa', name: 'Beatriz Costa', initials: 'BC', hue: 0,
    headline: 'Senior Product Designer', companyId: 'mercado-nuvem', company: 'Mercado Nuvem', tenure: '3y',
    city: 'São Paulo', country: 'Brazil', utcOffset: 'UTC−3', years: 9,
    availability: availability('open', 'now'),
    degree: deg(3), relation: 'Follows you',
    fit: fitOf('11001'), evidence: 'Led checkout for 40k merchants',
    skills: [sk('Commerce UX'), sk('Research'), sk('Prototyping')],
    prev: { role: 'Product Designer', company: 'Lojinha' },
  }),
  row({
    id: 'sigridur-jonsdottir', name: 'Sigríður Jónsdóttir', initials: 'SJ', hue: 3,
    headline: 'Lead UX Researcher', companyId: 'hekla-health', company: 'Hekla Health', tenure: '4y',
    city: 'Reykjavík', country: 'Iceland', utcOffset: 'UTC+0', years: 12,
    availability: availability('open', 'Dec 2026'),
    degree: deg(2), relation: '1 mutual', introVia: 'Tove Lindqvist',
    fit: fitOf('01101'), evidence: "Ran Hekla's clinician research",
    skills: [sk('Research'), sk('Service design'), sk('Workshops')],
    prev: { role: 'UX Researcher', company: 'Kvarnir' },
  }),
  row({
    id: 'kristjan-tamm', name: 'Kristjan Tamm', initials: 'KT', hue: 2,
    headline: 'Design Technologist', companyId: 'veski', company: 'Veski', tenure: '2y',
    city: 'Tallinn', country: 'Estonia', utcOffset: 'UTC+3', years: 7,
    availability: availability('freelance', '3 d/wk'),
    degree: deg(2), relation: '2 mutual', introVia: 'Jonas Petersen',
    fit: fitOf('00111'), evidence: "Ships Veski's token sync to code",
    skills: [ds(), sk('TypeScript'), sk('Design tokens')],
    prev: { role: 'Frontend Developer', company: 'Lumo' },
  }),
  row({
    id: 'felix-braun', name: 'Felix Braun', initials: 'FB', hue: 4,
    headline: 'Product Designer II', companyId: 'tandem', company: 'Tandem', tenure: '1y',
    city: 'Munich', country: 'Germany', utcOffset: 'UTC+2', years: 4,
    availability: availability('not-looking', '—'),
    degree: 'team', relation: 'Your team',
    fit: fitOf('10110'), evidence: "Maintains Tandem's icon set",
    skills: [ds(), sk('Iconography'), sk('Motion')],
    prev: { role: 'Junior Designer', company: 'Wirkung Mobility' },
    following: true,
  }),
  row({
    id: 'hana-nguyen', name: 'Hana Nguyen', initials: 'HN', hue: 5,
    headline: 'Senior Interaction Designer', companyId: 'wirkung-mobility', company: 'Wirkung Mobility', tenure: '4y',
    city: 'Hamburg', country: 'Germany', utcOffset: 'UTC+2', years: 10,
    availability: availability('not-looking', '—'),
    degree: deg(2), relation: '1 mutual', introVia: 'Felix Braun',
    fit: fitOf('11100'), evidence: 'Designed in-car HMI, 2 models',
    skills: [sk('Automotive HMI'), sk('Motion'), sk('Prototyping')],
    prev: { role: 'Interaction Designer', company: 'Kreis Studio' },
  }),
  row({
    id: 'lea-moreau', name: 'Léa Moreau', initials: 'LM', hue: 3,
    headline: 'Senior Product Designer', companyId: 'oriel', company: 'Oriel', tenure: '1y',
    city: 'Paris', country: 'France', utcOffset: 'UTC+2', years: 8,
    availability: availability('not-looking', '—'),
    degree: deg(2), relation: '3 mutual', introVia: 'Élodie Marchand',
    fit: fitOf('11100'), evidence: "Designs Oriel's review flow",
    skills: [sk('Collaboration UX'), sk('Interaction design'), sk('UX writing')],
    prev: { role: 'Product Designer', company: 'Mosaic Health' },
  }),
  row({
    id: 'yusuf-adeyemi', name: 'Yusuf Adeyemi', initials: 'YA', hue: 1,
    headline: 'Product Designer', companyId: 'tessera', company: 'Tessera', tenure: '2y',
    city: 'Accra', country: 'Ghana', utcOffset: 'UTC+0', years: 5,
    availability: availability('exploring', 'Feb 2027'),
    degree: deg(3), relation: 'Follows you',
    fit: fitOf('10110'), evidence: "Keeps Tessera's Android kit",
    skills: [ds(), sk('Android'), sk('Accessibility')],
    prev: { role: 'Product Designer', company: 'Paylane' },
  }),
]

/** The 22 ids in display order (§13.4); also the People `objectOrder`. */
export const peopleIds: string[] = people.map((p) => p.id)

const byId = new Map<string, Person>()
for (const p of [...people, ...extraPeople, ...generatedPeople, viewerPerson]) {
  if (!byId.has(p.id)) byId.set(p.id, p)
}

/**
 * Any person in the data: the 22 results, the extra people (viewer's connections, Halden contacts,
 * req-t114 candidates), the generated candidates of the other requisitions, and the viewer herself.
 */
export function getPersonById(id: string | null | undefined): Person | undefined {
  return id ? byId.get(id) : undefined
}

/** Every person record, results first. */
export const allPeople: Person[] = [...byId.values()]

/** Index of a person in the People result set (−1 when not a result). */
export const peopleIndex = (id: string) => peopleIds.indexOf(id)

/** Sort by clauses met (desc), stable otherwise (§6.3 soft clauses). */
export function sortByFit<T extends { fit: readonly boolean[] }>(list: readonly T[]): T[] {
  return list
    .map((p, i) => ({ p, i }))
    .sort((a, b) => fitCount(b.p.fit) - fitCount(a.p.fit) || a.i - b.i)
    .map(({ p }) => p)
}

export { extraPeople, generatedPeople, viewerPerson }
