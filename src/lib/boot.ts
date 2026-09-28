// readBoot(): the boot state from the URL (§12.4).
//   ?section=<id>   boot section; wins over the hash
//   #<id>           boot section when ?section is absent or invalid
//   (none/invalid)  people
//   ?inspector=0    the boot section's inspector starts closed; its selection is kept (quiet selection)
//   ?palette=1      the palette starts open, empty query, highlight on row 0
//   ?p=<personId>   overrides the People selection
import type { BootParams, SectionId } from '../state/types'

export const SECTION_IDS: readonly SectionId[] = [
  'home', 'people', 'jobs', 'companies', 'projects', 'applications', 'hiring', 'saved', 'activity', 'profile',
] as const

export const isSectionId = (v: unknown): v is SectionId =>
  typeof v === 'string' && (SECTION_IDS as readonly string[]).includes(v)

const ID_RE = /^[a-z0-9][a-z0-9-]{0,80}$/

export function readBoot(loc: Pick<Location, 'search' | 'hash'> | undefined = typeof window !== 'undefined' ? window.location : undefined): BootParams {
  const params = new URLSearchParams(loc?.search ?? '')
  const hash = (loc?.hash ?? '').replace(/^#/, '')
  const q = params.get('section')
  const section: SectionId = isSectionId(q) ? q : isSectionId(hash) ? hash : 'people'
  const insp = params.get('inspector')
  const p = params.get('p')
  return {
    section,
    inspectorOpen: insp === '0' ? false : insp === '1' ? true : null,
    palette: params.get('palette') === '1',
    person: p && ID_RE.test(p) ? p : null,
  }
}
