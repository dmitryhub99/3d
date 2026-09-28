// §6.5 column geometry. x is measured from the workspace's left edge (content starts at 16).
import type { ColumnDef } from '../../components/workspace/ColumnHeader'

export interface PeopleColumns {
  person: { x: number; w: number }
  company: { x: number; w: number } | null
  fit: { x: number; w: number }
  skills: { x: number; w: number } | null
  availability: { x: number; w: number }
  relation: { x: number; w: number } | null
  header: ColumnDef[]
}

export function peopleColumns(workspaceW: number): PeopleColumns {
  const C = workspaceW - 32
  const extra = C - 952
  const showSkills = C >= 952
  const showRelation = C >= 792
  const showCompany = C >= 720

  let person = 248
  let fit = 232
  if (extra > 0) {
    person = 248 + Math.min(extra / 2, 112)
    fit = 232 + (extra - (person - 248))
  } else {
    // hidden columns hand their width to Fit, the evidence column
    const used = person + 96 + (showCompany ? 144 : 0) + (showSkills ? 160 : 0) + (showRelation ? 72 : 0)
    fit = Math.max(160, C - used)
  }

  let x = 16
  const at = (w: number) => {
    const col = { x, w }
    x += w
    return col
  }
  const cPerson = at(person)
  const cCompany = showCompany ? at(144) : null
  const cFit = at(fit)
  const cSkills = showSkills ? at(160) : null
  const cAvail = at(96)
  const cRel = showRelation ? at(72) : null

  const header: ColumnDef[] = [
    { id: 'person', label: 'Person', x: cPerson.x, width: cPerson.w },
    ...(cCompany ? [{ id: 'company', label: 'Company', x: cCompany.x, width: cCompany.w }] : []),
    { id: 'fit', label: 'Fit', x: cFit.x, width: cFit.w },
    ...(cSkills ? [{ id: 'skills', label: 'Skills', x: cSkills.x, width: cSkills.w }] : []),
    { id: 'availability', label: 'Availability', x: cAvail.x, width: cAvail.w },
    ...(cRel ? [{ id: 'relation', label: 'Relation', x: cRel.x, width: cRel.w }] : []),
  ]
  return { person: cPerson, company: cCompany, fit: cFit, skills: cSkills, availability: cAvail, relation: cRel, header }
}
