// The frame (§1–§4): a lattice of full-height columns. Every column has a 40px cap, a body and a
// 28px foot; separators run the full height and nothing crosses them. Selection is drawn on the lines.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { motion } from 'motion/react'
import { Icon } from '../components/icons/Icon'
import { IconButton } from '../components/primitives/IconButton'
import { TextButton } from '../components/primitives/TextButton'
import { Kbd } from '../components/primitives/Kbd'
import { Flag } from '../components/primitives/Flag'
import { QueryHoverProvider } from '../components/workspace/queryHover'
import { panel, snap } from '../lib/motion'
import { cx } from '../lib/cx'
import { snapWidth } from '../lib/geometry'
import { toStageRect, toStagePoint } from '../lib/stage'
import { canGoBack, canGoForward } from '../state/history'
import { useApp, useDispatch, useStore } from '../state/store'
import { useHotkeys } from '../state/useHotkeys'
import { useLayout } from '../state/useLayout'
import { useUrlSync } from '../state/urlSync'
import { Rail } from './Rail'
import { sections } from './sections'
import { useScrollContainer } from './scroll'
import s from './AppShell.module.css'

export function AppShell() {
  useHotkeys()
  useUrlSync()
  const sectionId = useApp((st) => st.section)
  const def = sections[sectionId]
  const layout = useLayout()
  const selection = useApp((st) => st.selection[sectionId])
  const Workspace = def.Workspace
  const Foot = def.WorkspaceFoot
  const Body = def.InspectorBody
  const InspectorFoot = def.InspectorFoot
  const inspectorOn = layout.inspectorVisible && !!Body && !!selection

  return (
    <QueryHoverProvider>
      <div className={s.shell}>
        <Rail />

        <section className={s.workspace} aria-label={def.label}>
          <div className={cx(s.cap, s.edge)} style={{ paddingRight: inspectorOn ? 12 : 124 }}>
            <WorkspaceCap inspectorOn={inspectorOn} />
          </div>
          <div className={cx(s.body, s.surface, inspectorOn && s.edgeBody)}>
            <Workspace />
          </div>
          <div className={cx(s.foot, inspectorOn && s.edgeFoot)}>
            <Foot />
          </div>
        </section>

        <motion.aside
          className={s.inspector}
          initial={false}
          animate={{ width: inspectorOn ? layout.inspectorW : 0 }}
          transition={panel}
          aria-label="Inspector"
        >
          {inspectorOn && selection && (
            <div className={s.inspectorInner} style={{ width: layout.inspectorW }}>
              <div className={s.cap}>
                <InspectorCap id={selection} />
              </div>
              <div className={cx(s.body, s.raised)}>
                <div className={s.scroll}>{Body && <Body id={selection} />}</div>
              </div>
              <div className={s.foot}>{InspectorFoot && <InspectorFoot id={selection} />}</div>
              <ResizeHandle />
            </div>
          )}
        </motion.aside>

        <GlobalZone />
        {inspectorOn && <TetherNotch x={layout.workspaceRight - 1} id={selection!} />}
      </div>
    </QueryHoverProvider>
  )
}

/* ---------------------------------------------------------------- workspace cap */

function WorkspaceCap({ inspectorOn }: { inspectorOn: boolean }) {
  const dispatch = useDispatch()
  const def = useApp((st) => sections[st.section])
  const crumbs = useApp((st) => def.crumbs(st).join('\u0000')).split('\u0000')
  const actions = useApp((st) => (def.capActionsFor?.(st) ?? def.capActions).map((a) => a.label).join('|')).split('|')
  const back = useApp((st) => canGoBack(st.history))
  const forward = useApp((st) => canGoForward(st.history))

  return (
    <>
      <div className={s.history}>
        <IconButton icon="chevron-left" iconSize={12} label="Back" keys={['⌘', '[']} disabled={!back} onClick={() => dispatch({ type: 'back' })} />
        <IconButton icon="chevron-right" iconSize={12} label="Forward" keys={['⌘', ']']} disabled={!forward} onClick={() => dispatch({ type: 'forward' })} />
      </div>
      <span className={s.capTick} aria-hidden />
      <button className={s.address} onClick={() => dispatch({ type: 'openPalette' })} aria-label="Location. Click to search or run a command">
        {crumbs.map((c, i) => (
          <span key={i} className={s.crumb}>
            {i > 0 && <Icon name="chevron-right" size={12} className={s.crumbSep} />}
            <span className={i === crumbs.length - 1 ? s.leaf : s.ancestor}>{c}</span>
          </span>
        ))}
      </button>
      <span className={s.spacer} />
      <div className={s.capActions}>
        {actions.filter(Boolean).map((label) => (
          <TextButton key={label}>{label}</TextButton>
        ))}
        {def.inspector !== 'none' && (
          <>
            <span className={s.capTickInline} aria-hidden />
            <IconButton
              icon="panel-right"
              label="Inspector"
              keys={[']']}
              filled={inspectorOn}
              onClick={() => dispatch({ type: 'toggleInspector' })}
            />
          </>
        )}
      </div>
    </>
  )
}

/* ---------------------------------------------------------------- inspector cap */

function InspectorCap({ id }: { id: string }) {
  const dispatch = useDispatch()
  const def = useApp((st) => sections[st.section])
  const position = useApp((st) => {
    const order = def.objectOrder(st)
    const i = order.indexOf(id)
    return i >= 0 ? `${i + 1}/${order.length}` : ''
  })
  const resize = useApp((st) => st.resize)

  return (
    <div className={s.inspectorCap}>
      <span className={s.joint} aria-hidden>
        <Icon name="chevron-right" size={12} />
      </span>
      <span className={s.objectCrumb}>{def.objectLabel(id)}</span>
      <span className={s.readout}>{resize ? `${resize.from} → ${resize.to}` : position}</span>
      <IconButton icon="chevron-up" label="Previous" keys={['K']} onClick={() => dispatch({ type: 'step', delta: -1 })} />
      <IconButton icon="chevron-down" label="Next" keys={['J']} onClick={() => dispatch({ type: 'step', delta: 1 })} />
      <IconButton icon="close" label="Close" keys={['esc']} onClick={() => dispatch({ type: 'toggleInspector', open: false })} />
    </div>
  )
}

/* ---------------------------------------------------------------- global zone */

function GlobalZone() {
  const dispatch = useDispatch()
  return (
    <div className={s.global}>
      <span className={s.globalTick} aria-hidden />
      <Flag label="Search or run a command" keys={['⌘', 'K']}>
        <button className={s.trigger} onClick={() => dispatch({ type: 'openPalette' })} aria-label="Search or run a command">
          <Icon name="search" size={12} />
          <Kbd keys={['⌘', 'K']} />
        </button>
      </Flag>
      <Flag label="Notifications · 6 unread">
        <button className={s.bell} aria-label="Notifications, 6 unread" onClick={() => dispatch({ type: 'openDrop', drop: 'notifications' })}>
          <Icon name="bell" size={16} />
          <span className={s.unread} />
        </button>
      </Flag>
    </div>
  )
}

/* ---------------------------------------------------------------- tether notch */

/** 2 × 20 orange notch on the inspector separator, centered on the object the inspector is reading. */
function TetherNotch({ x, id }: { x: number; id: string }) {
  const container = useScrollContainer()
  const [y, setY] = useState<{ top: number; h: number } | null>(null)

  const measure = useCallback(() => {
    if (!container) return setY(null)
    const el = container.querySelector<HTMLElement>(`[data-object-id="${CSS.escape(id)}"]`)
    if (!el) return setY(null)
    const box = toStageRect(container.getBoundingClientRect())
    const r = toStageRect(el.getBoundingClientRect())
    const center = r.top + r.height / 2
    const next =
      r.bottom <= box.top ? { top: box.top, h: 8 } : r.top >= box.bottom ? { top: box.bottom - 8, h: 8 } : { top: center - 10, h: 20 }
    setY((cur) => (cur && cur.top === next.top && cur.h === next.h ? cur : next))
  }, [container, id])

  useLayoutEffect(() => {
    measure()
  })
  useEffect(() => {
    if (!container) return
    container.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      container.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [container, measure])

  if (!y) return null
  return (
    <motion.span
      className={s.tether}
      style={{ left: x }}
      initial={false}
      animate={{ top: y.top, height: y.h }}
      transition={snap}
    />
  )
}

/* ---------------------------------------------------------------- resize handle */

function ResizeHandle() {
  const dispatch = useDispatch()
  const store = useStore()
  const layout = useLayout()
  const [hover, setHover] = useState<number | null>(null)
  const drag = useRef<{ startX: number; startW: number } | null>(null)

  const onDown = (e: RPointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const st = store.getState()
    drag.current = { startX: toStagePoint(e.clientX, e.clientY).x, startW: layout.inspectorW }
    dispatch({ type: 'resize', value: { from: layout.inspectorW, to: layout.inspectorW } })
    void st
  }
  const onMove = (e: RPointerEvent) => {
    const p = toStagePoint(e.clientX, e.clientY)
    setHover(p.y)
    if (!drag.current) return
    const w = Math.round(Math.max(360, Math.min(layout.inspectorMax, drag.current.startW - (p.x - drag.current.startX))))
    dispatch({ type: 'setInspectorWidth', section: store.getState().section, width: w })
    dispatch({ type: 'resize', value: { from: drag.current.startW, to: w } })
  }
  const onUp = () => {
    if (!drag.current) return
    const section = store.getState().section
    dispatch({ type: 'setInspectorWidth', section, width: snapWidth(store.getState().inspectorWidth[section], layout.inspectorMax) })
    dispatch({ type: 'resize', value: null })
    drag.current = null
  }

  return (
    <div
      className={s.handle}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={() => !drag.current && setHover(null)}
      onDoubleClick={() => dispatch({ type: 'setInspectorWidth', section: store.getState().section, width: 400 })}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize inspector"
    >
      <span className={s.handleLine} />
      {hover !== null && <span className={s.grip} style={{ top: hover - 5 }} />}
    </div>
  )
}
