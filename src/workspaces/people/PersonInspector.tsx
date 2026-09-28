// Person inspector (§7): the dossier used to evaluate one professional.
import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { PersonDetail, TextRun } from '../../data/types'
import { getPersonDetail } from '../../data/personDetail'
import { fitSegmentLabel } from '../../data/peopleQuery'
import { Monogram } from '../../components/primitives/Monogram'
import { StatusGlyph } from '../../components/primitives/StatusGlyph'
import { Button } from '../../components/primitives/Button'
import { IconButton } from '../../components/primitives/IconButton'
import { MenuTrigger } from '../../components/primitives/Menu'
import { SectionHeading } from '../../components/primitives/SectionHeading'
import { SkillToken } from '../../components/primitives/SkillToken'
import { TextButton } from '../../components/primitives/TextButton'
import { Icon } from '../../components/icons/Icon'
import { FootReadout } from '../../components/workspace/FootReadout'
import { useQueryHover } from '../../components/workspace/queryHover'
import { fadeIn, fadeOut } from '../../lib/motion'
import { cx } from '../../lib/cx'
import { useDispatch } from '../../state/store'
import { CareerStrip } from './CareerStrip'
import { WorkThumb } from './WorkThumb'
import { toggleFollow, toggleSaved, useFollowing, useSaved } from './relations'
import s from './PersonInspector.module.css'

function Runs({ runs }: { runs: TextRun[] }) {
  return (
    <>
      {runs.map((r, i) => (
        <span
          key={i}
          className={cx(r.mono && s.fig, r.tone === 'text-1' && s.t1, r.tone === 'text-2' && s.t2, r.tone === 'text-3' && s.t3)}
          style={r.weight ? { fontWeight: r.weight } : undefined}
        >
          {r.text}
        </span>
      ))}
    </>
  )
}

export function PersonInspector({ id, afterFit }: { id: string; afterFit?: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: fadeIn(120) }}
        exit={{ opacity: 0, transition: fadeOut(70) }}
      >
        <Dossier id={id} afterFit={afterFit} />
      </motion.div>
    </AnimatePresence>
  )
}

function Dossier({ id, afterFit }: { id: string; afterFit?: ReactNode }) {
  const d = getPersonDetail(id)
  if (!d) return null
  return (
    <div className={s.dossier}>
      <Identity d={d} />
      <Availability d={d} />
      <Actions d={d} />
      {d.target && (
        <TextButtonLine>
          <Icon name="arrow-right" size={12} />
          <span>
            <span className={s.t3}>for </span>
            <span className={s.t2}>{d.target.label}</span>
            <span className={s.t3}> · {d.target.org}</span>
          </span>
        </TextButtonLine>
      )}
      <Fit d={d} />
      {afterFit}
      <Bio d={d} />
      <Experience d={d} />
      <Work d={d} />
      <Skills d={d} />
      {d.sharedContext.length > 0 && <Context d={d} />}
      {d.recommendations.length > 0 && <Recommendations d={d} />}
      {d.recentActivity.length > 0 && <Recent d={d} />}
    </div>
  )
}

function Identity({ d }: { d: PersonDetail }) {
  return (
    <header className={s.identity}>
      <Monogram initials={d.initials} hue={d.hue} size={56} />
      <div className={s.idText}>
        <h2 className={s.name}>{d.name}</h2>
        <p className={s.headline}>{d.headlineLong}</p>
        <p className={s.meta}>
          <Runs runs={d.meta} />
        </p>
      </div>
    </header>
  )
}

function Availability({ d }: { d: PersonDetail }) {
  return (
    <div className={s.availability}>
      <span className={s.glyph}>
        <StatusGlyph status={d.availability.status} />
      </span>
      <div>
        <p className={s.availLine}>
          <Runs runs={d.availabilityLine} />
        </p>
        <p className={s.availTerms}>{d.availabilityTerms}</p>
      </div>
    </div>
  )
}

function Actions({ d }: { d: PersonDetail }) {
  const following = useFollowing(d.id)
  const saved = useSaved(d.id)
  return (
    <div className={s.actions}>
      <Button variant="primary" flag={d.primaryAction.flag} flagKeys={['M']}>
        {d.primaryAction.label}
      </Button>
      <Button icon={following ? 'following' : 'follow'} tone={following ? 'muted' : 'default'} onClick={() => toggleFollow(d.id)}>
        {following ? 'Following' : 'Follow'}
      </Button>
      <IconButton
        icon={saved ? 'save-filled' : 'save'}
        label={saved ? 'Saved' : 'Save'}
        keys={['S']}
        size={32}
        bordered
        tone={saved ? 'text-1' : 'text-3'}
        onClick={() => toggleSaved(d.id)}
      />
      <MenuTrigger
        align="end"
        items={[
          { id: 'list', label: 'Add to list…' },
          { id: 'attach', label: 'Attach to requisition…', keys: ['P'] },
          { id: 'copy', label: 'Copy link', keys: ['⌘', 'C'] },
          { kind: 'separator' },
          { id: 'hide', label: 'Hide from results' },
          { id: 'report', label: 'Report' },
        ]}
      >
        <IconButton icon="more" label="More" keys={['.']} size={32} bordered />
      </MenuTrigger>
    </div>
  )
}

function TextButtonLine({ children }: { children: ReactNode }) {
  return (
    <MenuTrigger
      width={280}
      items={[
        { kind: 'group', label: 'Tandem · open requisitions' },
        { id: 'canvas', label: 'Staff Designer, Canvas', hint: '22', selected: true },
        { id: 'systems', label: 'Senior Designer, Systems', hint: '9' },
        { id: 'growth', label: 'Product Designer, Growth', hint: '14' },
        { kind: 'separator' },
        { id: 'none', label: 'No requisition (personal)' },
      ]}
    >
      <button className={s.target}>{children}</button>
    </MenuTrigger>
  )
}

function Fit({ d }: { d: PersonDetail }) {
  const { hovered, setHovered } = useQueryHover()
  return (
    <section className={s.section}>
      <SectionHeading label={`Fit · ${fitSegmentLabel}`} readout={d.fitReadout} />
      <ul className={s.fitList}>
        {d.fitLines.map((l, i) => (
          <li
            key={l.index}
            className={cx(s.fitLine, hovered !== null && hovered !== i && s.dimmed, !l.met && s.unmet)}
            onPointerEnter={() => setHovered(i, 'fit')}
            onPointerLeave={() => setHovered(null)}
          >
            <span className={l.met ? s.tickOn : s.tickOff} />
            <span className={s.index}>{l.index}</span>
            <span className={s.clause}>{l.clause}</span>
            <span className={s.evidence}>{l.evidence}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Bio({ d }: { d: PersonDetail }) {
  const [open, setOpen] = useState(false)
  return (
    <section className={s.section}>
      <p className={cx(s.bio, !open && s.clamp)}>
        {open ? d.bioLong.split('\n\n')[0] : d.bio}
        {!open && (
          <button className={s.more} onClick={() => setOpen(true)}>
            &nbsp;More
          </button>
        )}
      </p>
    </section>
  )
}

function Experience({ d }: { d: PersonDetail }) {
  return (
    <section className={s.section}>
      <SectionHeading label="Experience" readout={d.totalExperience} />
      <div className={s.career}>
        <CareerStrip
          axis={d.careerAxis}
          entries={d.experience.map((e) => ({ from: e.start, to: e.end ?? undefined, current: e.end === null }))}
        />
      </div>
      <ol className={s.entries}>
        {d.experience.map((e) => (
          <li key={e.start} className={s.entry}>
            <span className={s.years}>{e.yearsLabel}</span>
            <span className={s.role}>{e.role}</span>
            <span className={s.duration}>{e.duration}</span>
            <span className={s.org}>
              {e.company}
              {e.context && <span className={s.t3}> · {e.context}</span>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Work({ d }: { d: PersonDetail }) {
  const items = d.work.slice(0, d.inspectorWorkCount || 2)
  return (
    <section className={s.section}>
      <SectionHeading label="Selected work" readout={String(items.length)} />
      <div className={s.work}>
        {items.map((w) => (
          <a key={w.id} className={s.workItem} href={`#work-${w.id}`} onClick={(e) => e.preventDefault()}>
            <WorkThumb kind={w.thumb} width={170} height={96} />
            <span className={s.workTitle}>{w.title}</span>
            <span className={s.workMeta}>
              {w.year} · {w.kind} · {w.minutes} min
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

function Skills({ d }: { d: PersonDetail }) {
  return (
    <section className={s.section}>
      <SectionHeading label="Skills" readout={d.skillsReadout} />
      <div className={s.skills}>
        {d.skillsDetail.map((k) => (
          <SkillToken key={k.name} name={k.name} matched={k.matched} years={k.years} size={12} block />
        ))}
      </div>
    </section>
  )
}

function Context({ d }: { d: PersonDetail }) {
  return (
    <section className={s.section}>
      <SectionHeading label="Shared context" readout={String(d.sharedContext.length)} />
      <ul className={s.context}>
        {d.sharedContext.map((c, i) => (
          <li key={i}>
            <Icon name={c.icon} size={12} className={s.contextIcon} />
            <span>
              <Runs runs={c.runs} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Recommendations({ d }: { d: PersonDetail }) {
  return (
    <section className={s.section}>
      <SectionHeading label="Recommendations" readout={String(d.recommendations.length)} />
      <div className={s.quotes}>
        {d.recommendations.map((r) => (
          <figure key={r.author} className={s.quote}>
            <blockquote>{r.quote}</blockquote>
            <figcaption>
              <span className={s.t2}>{r.author}</span>, {r.authorRole}, <span className={s.fig}>{r.year}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function Recent({ d }: { d: PersonDetail }) {
  return (
    <section className={cx(s.section, s.last)}>
      <SectionHeading label="Recent activity" readout={String(d.recentActivity.length)} />
      <ul className={s.recent}>
        {d.recentActivity.map((a) => (
          <li key={a.title}>
            <span className={s.recentTitle}>{a.title}</span>
            <span className={s.fig}>{a.date}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function PersonInspectorFoot({ id }: { id: string }) {
  const dispatch = useDispatch()
  const d = getPersonDetail(id)
  if (!d) return null
  return (
    <FootReadout
      inset={20}
      items={[<Runs key="p" runs={d.provenance} />]}
      right={
        <TextButton variant="foot" keys={['↵']} keysPosition="start" onClick={() => dispatch({ type: 'openObject', section: 'profile', id })}>
          Full profile
        </TextButton>
      }
    />
  )
}
