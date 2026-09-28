// The section registry (§12.2): Record<SectionId, SectionDef>, one module per section.
// Each src/workspaces/<id>/section.tsx default-exports its SectionDef.
import type { SectionId } from '../state/types'
import type { RailGroup, SectionDef, SectionRegistry } from './types'
import home from '../workspaces/home/section'
import people from '../workspaces/people/section'
import jobs from '../workspaces/jobs/section'
import companies from '../workspaces/companies/section'
import projects from '../workspaces/projects/section'
import applications from '../workspaces/applications/section'
import hiring from '../workspaces/hiring/section'
import saved from '../workspaces/saved/section'
import activity from '../workspaces/activity/section'
import profile from '../workspaces/profile/section'

export const sections: SectionRegistry = { home, people, jobs, companies, projects, applications, hiring, saved, activity, profile }

/** Rail order (§3): groups top to bottom, items within a group top to bottom. Profile is not a rail item. */
export const RAIL_GROUPS: { group: RailGroup; items: SectionId[] }[] = [
  { group: 'network', items: ['home', 'people', 'companies'] },
  { group: 'work', items: ['jobs', 'projects'] },
  { group: 'pipeline', items: ['applications', 'hiring'] },
  { group: 'you', items: ['saved', 'activity'] },
]

export const getSection = (id: SectionId): SectionDef => sections[id]
