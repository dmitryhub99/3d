// §13.1 data types, verbatim, plus additive extensions marked "extension".
// Every field and union from the spec keeps its exact shape unless the note on it says otherwise.

import type { SectionId } from '../state/types'

export type { SectionId }

export type HueIndex = 0 | 1 | 2 | 3 | 4 | 5
export type AvailabilityStatus = 'open' | 'exploring' | 'not-looking' | 'freelance'
export type Degree = 1 | 2 | 3 | 'team'
export type FitVector = [boolean, boolean, boolean, boolean, boolean]   // clause 1..5

export type ClauseKey =
  | 'role' | 'seniority' | 'region' | 'skill' | 'availability' | 'company' | 'degree' | 'keyword'
  | 'level' | 'discipline' | 'remote' | 'comp' | 'budget' | 'duration' | 'size' | 'hiring'

export interface Clause { index: number; key: ClauseKey; lead?: string; value: string }
export interface Query { clauses: Clause[]; sort: { lead: '— by'; value: string } }

/**
 * A tab in a segment strip (or an item in a channel list).
 * extension: `count` is optional. Home (`Following`, `Your field`, `Companies`) and Activity (`All`) tabs are
 * specified without a count (§5.4); render the count only when it is a number.
 */
export interface Segment { id: string; label: string; count?: number; delta?: number }

export interface Skill { name: string; matched: boolean; years?: number }
export interface Availability {
  status: AvailabilityStatus
  label: 'Open' | 'Exploring' | 'Not looking' | 'Freelance'
  timing: string                      // row line 2: 'Nov 2026' | 'now' | '2 d/wk' | '—'
}

export interface Person {
  id: string                          // kebab-case of the name, ASCII-folded (e.g. 'sigridur-jonsdottir')
  name: string
  initials: string
  hue: HueIndex
  headline: string                    // role title (row line 2, inspector headline prefix)
  companyId: string
  company: string
  tenure: string                      // '3y'
  city: string
  country: string
  utcOffset: string                   // 'UTC+2' (U+2212 for minus)
  years: number                       // total years of experience
  availability: Availability
  degree: Degree
  relation: string                    // Relation line 2
  introVia?: string                   // viewer's 1° who can introduce (degree 2 only)
  fit: FitVector
  evidence: string                    // ≤ 36 chars; Fit line 2
  skills: Skill[]                     // 3–4, matched first
  prev: { role: string; company: string }   // previous role (for derived detail)
  /** extension: initial Follow state (inspector "Follow" / "Following", row hover follow button). */
  following?: boolean
  /** extension: initial Save state (inspector save / save-filled). */
  saved?: boolean
}

export interface ExperienceEntry {
  role: string
  company: string
  note: string
  start: string                       // 'YYYY-MM'
  end: string | null                  // 'YYYY-MM', null = present
  duration: string                    // '3y 1m'
  /** extension: descriptor after the company in the inspector ("Plinth · collaborative canvas"). */
  context?: string
  /** extension: hanging-column years label ('2023–', '2020–23'). */
  yearsLabel?: string
  /** extension: set when the company exists in companies.ts / otherCompanies. */
  companyId?: string
}
export type ThumbKind = 'selection-model' | 'disputes-flow' | 'token-pipeline' | 'component-grid' | 'map-style' | 'dispatch-table' | 'stepper' | 'phone-flow'
export interface WorkItem { id: string; title: string; year: number; kind: 'case study' | 'essay' | 'talk'; minutes: number; thumb: ThumbKind; summary?: string }
export interface FitLine { index: number; clause: string; evidence: string; met: boolean }
export interface TextRun { text: string; tone?: 'text-1' | 'text-2' | 'text-3'; mono?: boolean; weight?: 500 }
export interface ContextLine { icon: 'worked-with' | 'people' | 'view' | 'saved' | 'follow'; runs: TextRun[] }
export interface Recommendation { quote: string; author: string; authorRole: string; year: number }

export interface PersonDetail extends Person {
  headlineLong: string
  localTime: string                   // '14:32'
  activeAgo: string                   // '3h'
  availabilityLine: TextRun[]
  availabilityTerms: string
  /** extension: kind 'edit' is used only for the viewer's own record (Edit profile). */
  primaryAction: { kind: 'intro' | 'message' | 'open-pipeline' | 'edit'; label: string; flag?: string }
  target: { label: string; org: string } | null
  fitLines: FitLine[]
  bio: string                         // ≤ 160 chars (inspector, 3 lines)
  bioLong: string                     // Profile overview (paragraphs joined with a blank line)
  experience: ExperienceEntry[]
  totalExperience: string             // '11y'
  careerAxis: { from: string; to: string }
  work: WorkItem[]
  skillsDetail: Skill[]               // 8, with years
  sharedContext: ContextLine[]
  recommendations: Recommendation[]
  recentActivity: { title: string; date: string }[]
  provenance: TextRun[]

  // ---- extensions ----
  /** Meta line runs: "Plinth · Berlin, Germany · " (text-3) then mono "14:32 UTC+2". */
  meta: TextRun[]
  /** bioLong split into paragraphs (Profile overview). */
  bioParagraphs: string[]
  /** Fit block readout, e.g. '4/5'. */
  fitReadout: string
  /** Skills heading readout, e.g. '1 of 8 match'. */
  skillsReadout: string
  /** Number of work items the inspector shows (2). The Profile shows all of `work`. */
  inspectorWorkCount: number
  /** Profile "Writing" (Maren only; empty for derived records). Dates in full: '14 Sep 2026'. */
  writing: { title: string; date: string; postId?: string }[]
  /** Profile margin readouts (SHEET). Empty for derived records except the fit line. */
  profileReadouts: { label: string; value: string; kind: 'figure' | 'fit' }[]
  /** Whether this record is hand-written (Maren) or derived by the §13.5 rules. */
  source: 'hand-written' | 'derived'
}

export interface Company {
  id: string; name: string; hue: HueIndex; sector: string; hq: string; founded: number
  headcount: number; openRoles: number; youKnow: number; thesis: string; following: boolean
}

/** extension: the company Peek (§5.4 Companies, §13.6 Halden Peek). */
export interface CompanyDetail extends Company {
  facts: { label: string; value: string; mono: boolean }[]
  growth: string                      // '+18%'
  designTeam: number
  remotePolicy: string
  roles: { title: string; comp: string; posted: string; jobId?: string }[]
  peopleYouKnow: { personId: string; name: string; initials: string; hue: HueIndex; degree: Degree; headline: string }[]
}

export interface JobBodySection { heading: string; paragraphs?: string[]; lines?: string[] }
export interface Job {
  id: string; title: string; companyId: string; company: string; location: string
  comp: string; compNote: string; posted: string; applicants: number; fit: [boolean, boolean, boolean, boolean]
  level?: string; team?: string; reportsTo?: string; process?: string; body?: JobBodySection[]
  /** extension: 'Full-time' (Reader company line). */
  employment: string
  /** extension: Reader fact grid, in order (Comp, Level, Team, Reports to, Posted, Process). */
  facts: { label: string; runs: TextRun[] }[]
  /** extension: hue of the company glyph. */
  hue: HueIndex
}
export interface Project {
  id: string; title: string; clientId: string; client: string; budget: string; duration: string
  proposals: number; remote: boolean; skills: string[]; posted: string
  summary?: string; scope?: string[]; start?: string; clientNote?: string
  /** extension */
  budgetType: 'fixed' | 'hourly'
  /** extension: 'Remote, EMEA hours' */
  location: string
  /** extension: hue of the client glyph. */
  hue: HueIndex
  /** extension: Peek fact grid in order (Budget, Timeline, Proposals, Location). */
  facts: { label: string; runs: TextRun[] }[]
  /** extension: 'marketplace' for §13.8 briefs, 'mine' for the viewer's own briefs (My briefs). */
  list: 'marketplace' | 'mine'
}
export type AppStage = 'applied' | 'screen' | 'interview' | 'offer' | 'closed'
export interface Application {
  id: string; role: string; companyId: string; company: string; stage: AppStage
  next: { label: string; when: string | null }; updated: string
  timeline?: { date: string; text: string }[]; contacts?: { name: string; role: string }[]
  /** extension: the Peek's long next-step line. */
  nextDetail: string
  /** extension: the Peek's primary action label. */
  primaryAction: string
  /** extension: linked job, when it is in jobs.ts. */
  jobId?: string
  /** extension: company glyph hue. */
  hue: HueIndex
  /** extension: location line under the role. */
  location: string
}
export type HiringStage = 'new' | 'screen' | 'interview' | 'final' | 'offer'
export interface Requisition {
  id: string; title: string; team: string; count: number
  /** extension: candidates per stage (sums to count). */
  stageCounts: Record<HiringStage, number>
  /** extension: 'Opened 12 Aug · hiring manager Rhea Kovač' style line. */
  opened: string
  hiringManager: string
}
export interface Candidate {
  id: string; personId?: string; name: string; initials: string; hue: HueIndex; headline: string
  stage: HiringStage; daysInStage: number; fit: FitVector; source: 'sourced' | 'referral' | 'applied'
  next?: { label: string; when: string }
  scorecards?: { reviewer: string; verdict: 'Strong yes' | 'Yes' | 'No' | 'Pending' }[]
  /** extension */
  requisitionId: string
  /** extension: '4/5' */
  fitReadout: string
  /** extension: mono slab line '4/5 · 2d in stage'. */
  slabLine: string
  /** extension: referral source name when source is 'referral'. */
  referredBy?: string
}
export interface FeedItem {
  id: string; authorKind: 'person' | 'company'; authorId: string; author: string; initials: string; hue: HueIndex
  byline: string; time: string; body: string
  attachment?: FeedAttachment
  counts: { replies: number; reposts: number }; marginNote: TextRun[]
  /** extension: short title used by Saved, Activity and Profile writing. */
  title: string
  /** extension: 'today' | 'yesterday' | an ISO date 'YYYY-MM-DD' for older posts. */
  day: string
}
/** extension of FeedItem['attachment'] (§13.1 keeps kind / caption / jobId; data for the SVG is added). */
export interface FeedAttachment {
  kind: 'bars' | 'diff' | 'job'
  caption: string
  jobId?: string
  /** bars: one value per bar, with its axis label. */
  series?: { label: string; value: number }[]
  /** diff: the lines of a small diff. */
  lines?: { sign: '+' | '-' | ' '; text: string }[]
}
export interface ActivityItem {
  id: string; day: 'today' | 'yesterday'; time: string
  kind: 'view' | 'pipeline' | 'reply' | 'segment' | 'job' | 'application' | 'mention' | 'profile-views' | 'proposal' | 'share' | 'scorecard'
  runs: TextRun[]; objectRef: { section: SectionId; id: string }; unread: boolean
}
export interface SavedItem {
  id: string; type: 'Person' | 'Job' | 'Project' | 'Company' | 'Post'; refId: string
  title: string; subtitle: string; collection: string; saved: string; note?: string
  /** extension: id of the collection (channel item). */
  collectionId: string
  /** extension: monogram initials (Person, Post) or company initial (Job, Project, Company). */
  initials: string
  hue: HueIndex
  /** extension: 'monogram' for Person and Post, 'company' for Job, Project and Company. */
  glyph: 'monogram' | 'company'
  /** extension: section whose inspector shows this object (Post → 'home'). */
  opens: SectionId
}
export interface Viewer {
  name: 'Rhea Kovač'; initials: 'RK'; hue: 2; role: 'Design Director'; company: 'Tandem'
  actingAs: { kind: 'employer'; org: 'Tandem'; badge: 'T' }; employerSeat: true
  // ---- extensions ----
  id: 'rhea-kovac'
  companyId: 'tandem'
  city: 'Munich'
  country: 'Germany'
  utcOffset: 'UTC+2'
  /** Person ids of the viewer's 1° connections that appear in the data. */
  connections: string[]
  /** Person ids on the viewer's team. */
  team: string[]
  /** The requisition used as the inspector target line. */
  targetRequisitionId: 'req-t114'
  target: { label: 'Staff Designer, Canvas'; org: 'Tandem' }
  /** Account menu contexts. */
  contexts: { id: 'personal' | 'tandem-hiring'; label: string; active: boolean }[]
  /** Account flag: 'Rhea Kovač · acting as Tandem'. */
  flag: string
  /** Rail foot sync flag: 'Synced 12s ago'. */
  syncFlag: string
  /** Personal-context target line after "as": Jobs Reader and Applications ("as Rhea Kovač · personal"). */
  personalTarget: { name: 'Rhea Kovač'; context: 'personal' }
  savedSearches: { id: string; label: string; section: SectionId }[]
}
