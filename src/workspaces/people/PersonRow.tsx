import { memo, type MouseEvent } from 'react'
import { motion } from 'motion/react'
import type { Person } from '../../data/types'
import { Monogram } from '../../components/primitives/Monogram'
import { CompanyGlyph } from '../../components/primitives/CompanyGlyph'
import { Checkbox } from '../../components/primitives/Checkbox'
import { FitTicks } from '../../components/primitives/FitTicks'
import { StatusGlyph } from '../../components/primitives/StatusGlyph'
import { IconButton } from '../../components/primitives/IconButton'
import { companyHue } from '../../data/companies'
import { snap } from '../../lib/motion'
import { cx } from '../../lib/cx'
import type { PeopleColumns } from './columns'
import { toggleFollow, toggleSaved, useFollowing, useSaved } from './relations'
import s from './PersonRow.module.css'

export interface PersonRowProps {
  person: Person
  index: number
  fit: boolean[]
  clauseLabels: string[]
  selected: boolean
  seam: boolean
  checked: boolean
  showCheckbox: boolean
  cols: PeopleColumns
  onSelect(id: string): void
  onCheck(id: string): void
  onContextMenu(id: string, e: MouseEvent): void
}

const degreeLabel = (d: Person['degree']) => (d === 'team' ? 'Team' : `${d}°`)

export const PersonRow = memo(function PersonRow({
  person: p,
  index,
  fit,
  clauseLabels,
  selected,
  seam,
  checked,
  showCheckbox,
  cols,
  onSelect,
  onCheck,
  onContextMenu,
}: PersonRowProps) {
  const met = fit.filter(Boolean).length
  const full = met === fit.length && fit.length > 0
  const following = useFollowing(p.id)
  const saved = useSaved(p.id)
  const [top, second] = p.skills
  const more = p.skills.length - 2

  return (
    <div
      role="row"
      aria-selected={selected}
      data-row-index={index}
      data-object-id={p.id}
      className={cx(s.row, selected && s.selected, checked && s.checked, showCheckbox && s.withChecks)}
      onClick={() => onSelect(p.id)}
      onContextMenu={(e) => {
        e.preventDefault()
        onContextMenu(p.id, e)
      }}
    >
      {selected && (
        <motion.div
          layoutId="selection-people"
          className={cx(s.fill, seam && s.fillSeam)}
          transition={snap}
          initial={false}
        />
      )}

      {/* Person */}
      <div className={s.cell} style={{ left: cols.person.x, width: cols.person.w }}>
        <span className={s.avatar}>
          <span className={s.mono}>
            <Monogram initials={p.initials} hue={p.hue} size={28} />
          </span>
          <span className={s.check}>
            <Checkbox checked={checked} onChange={() => onCheck(p.id)} label={`Select ${p.name}`} tabIndex={-1} />
          </span>
        </span>
        <span className={s.l1} style={{ left: 40 }}>
          <span className={s.name}>{p.name}</span>
        </span>
        <span className={cx(s.l2, s.headline)} style={{ left: 40, maxWidth: Math.min(200, cols.person.w - 52) }}>
          {p.headline}
        </span>
      </div>

      {/* Company */}
      {cols.company && (
        <div className={s.cell} style={{ left: cols.company.x, width: cols.company.w }}>
          <span className={s.l1}>
            <CompanyGlyph name={p.company} hue={companyHue(p.companyId)} size={14} />
            <span className={s.company}>{p.company}</span>
            <span className={s.fig}>{p.tenure}</span>
          </span>
          <span className={s.l2}>
            <span className={s.dim}>{p.city}</span>
            <span className={s.dim}>&nbsp;·&nbsp;</span>
            <span className={s.fig}>{p.utcOffset}</span>
          </span>
        </div>
      )}

      {/* Fit */}
      <div className={s.cell} style={{ left: cols.fit.x, width: cols.fit.w }}>
        <span className={s.l1}>
          <FitTicks
            values={fit}
            full={full}
            label={`${met} of ${fit.length} clauses met`}
            tickFlag={(i) => `${i + 1} ${clauseLabels[i] ?? ''} — ${fit[i] ? 'met' : 'not met'}`}
          />
          <span className={cx(s.fig, s.fraction, full && s.fractionFull)}>
            {met}/{fit.length}
          </span>
        </span>
        <span className={cx(s.l2, s.dim)} style={{ maxWidth: Math.min(220, cols.fit.w - 12) }}>
          {p.evidence}
        </span>
      </div>

      {/* Skills */}
      {cols.skills && (
        <div className={s.cell} style={{ left: cols.skills.x, width: cols.skills.w }}>
          <span className={cx(s.l1, top?.matched ? s.t1 : s.t2)}>{top?.name}</span>
          <span className={s.l2}>
            <span className={s.dim}>{second?.name}</span>
            {more > 0 && <span className={s.fig}>&nbsp;+{more}</span>}
          </span>
        </div>
      )}

      {/* Availability */}
      <div className={s.cell} style={{ left: cols.availability.x, width: cols.availability.w }}>
        <span className={s.l1}>
          <StatusGlyph status={p.availability.status} />
          <span className={s.avail}>{p.availability.label}</span>
        </span>
        <span className={cx(s.l2, s.fig)} style={{ left: 13 }}>
          {p.availability.timing}
        </span>
      </div>

      {/* Relation, replaced by actions on hover */}
      {cols.relation && (
        <div className={cx(s.cell, s.relation)} style={{ left: cols.relation.x, width: cols.relation.w }}>
          <span className={s.relInfo}>
            <span className={s.l1}>
              <span className={p.degree === 'team' ? s.team : s.degree}>{degreeLabel(p.degree)}</span>
            </span>
            <span className={cx(s.l2, s.dim)}>{p.relation}</span>
          </span>
          <span className={s.actions} onClick={(e) => e.stopPropagation()}>
            <IconButton
              icon={following ? 'following' : 'follow'}
              label={following ? 'Following' : 'Follow'}
              keys={['F']}
              tone={following ? 'text-1' : 'text-3'}
              onClick={() => toggleFollow(p.id)}
            />
            <IconButton
              icon={saved ? 'save-filled' : 'save'}
              label={saved ? 'Saved' : 'Save'}
              keys={['S']}
              tone={saved ? 'text-1' : 'text-3'}
              onClick={() => toggleSaved(p.id)}
            />
            <IconButton
              icon="more"
              label="More"
              keys={['.']}
              onClick={(e) => onContextMenu(p.id, e as unknown as MouseEvent)}
            />
          </span>
        </div>
      )}
    </div>
  )
})
