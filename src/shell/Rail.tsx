// The rail (§3): a 56px icon column. Groups are separated by space and a small tick, the current
// section carries a 2px orange notch on the x=56 separator, labels appear as flags with their chords.
import { Fragment } from 'react'
import { motion } from 'motion/react'
import { Icon } from '../components/icons/Icon'
import { Flag } from '../components/primitives/Flag'
import { Monogram } from '../components/primitives/Monogram'
import { StatusGlyph } from '../components/primitives/StatusGlyph'
import { snap } from '../lib/motion'
import { cx } from '../lib/cx'
import { useApp, useDispatch } from '../state/store'
import type { SectionId } from '../state/types'
import { sections } from './sections'
import s from './Rail.module.css'

const GROUPS: SectionId[][] = [
  ['home', 'people', 'companies'],
  ['jobs', 'projects'],
  ['applications', 'hiring'],
  ['saved', 'activity'],
]

const COUNTS: Partial<Record<SectionId, number>> = { applications: 2, hiring: 14 }

export function Rail() {
  const dispatch = useDispatch()
  const current = useApp((st) => sections[st.section].railSection)

  return (
    <nav className={s.rail} aria-label="Sections">
      <div className={s.cap}>
        <button className={s.mark} aria-label="STRIVO home" onClick={() => dispatch({ type: 'navigate', section: 'home' })}>
          <Icon name="mark" size={16} />
        </button>
      </div>

      <div className={s.body}>
        {GROUPS.map((group, gi) => (
          <Fragment key={gi}>
            {gi > 0 && <span className={s.tick} aria-hidden />}
            {group.map((id) => {
              const def = sections[id]
              const selected = current === id
              return (
                <Flag key={id} variant="rail" side="right" offset={9} label={def.label} keys={['G', def.chord]}>
                  <button
                    className={cx(s.item, selected && s.selected)}
                    aria-label={def.label}
                    aria-current={selected ? 'page' : undefined}
                    onClick={() => dispatch({ type: 'navigate', section: id })}
                  >
                    <span className={s.square}>
                      <Icon name={def.icon} size={16} />
                    </span>
                    {COUNTS[id] !== undefined && <span className={s.count}>{COUNTS[id]}</span>}
                    {selected && <motion.span layoutId="rail-notch" className={s.notch} transition={snap} initial={false} />}
                  </button>
                </Flag>
              )
            })}
          </Fragment>
        ))}

        <div className={s.bottom}>
          <Flag variant="rail" side="right" offset={9} label="Settings">
            <button className={s.item} aria-label="Settings">
              <span className={s.square}>
                <Icon name="settings" size={16} />
              </span>
            </button>
          </Flag>
          <Flag variant="rail" side="right" offset={15} label="Rhea Kovač · acting as Tandem" keys={['G', 'M']}>
            <button className={s.account} aria-label="Account: Rhea Kovač, acting as Tandem">
              <Monogram initials="RK" hue={2} size={28} badge="T" tone="text-1" />
            </button>
          </Flag>
        </div>
      </div>

      <div className={s.foot}>
        <Flag variant="rail" side="right" offset={20} label="Synced 12s ago">
          <span className={s.sync}>
            <StatusGlyph status="synced" />
          </span>
        </Flag>
      </div>
    </nav>
  )
}
