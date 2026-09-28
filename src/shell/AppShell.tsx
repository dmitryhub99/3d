// TEMPORARY minimal shell (core). The shell owner rewrites this file with Rail, WorkspaceCap, Inspector,
// GlobalZone, TetherNotch, CommandPalette, NotificationDrop and KeyboardSheet. It only proves the lattice,
// the registry wiring, the layout math, hotkeys and URL sync.
import type { CSSProperties, ReactNode } from 'react'
import { sections } from './sections'
import { useApp, useDispatch } from '../state/store'
import { useHotkeys } from '../state/useHotkeys'
import { useLayout } from '../state/useLayout'
import { useUrlSync } from '../state/urlSync'
import { CAP_H, FOOT_H, GLOBAL_ZONE_W } from '../lib/geometry'

const edgeRight = 'inset -1px 0 0 var(--line-1)'
const edgeBottom = 'inset 0 -1px 0 var(--line-1)'
const edgeTop = 'inset 0 1px 0 var(--line-1)'

function Column(props: { width?: number; cap: ReactNode; foot: ReactNode; children?: ReactNode; surface: string; edge: boolean; grow?: boolean }) {
  const col: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: props.width,
    flex: props.grow ? '1 1 0' : '0 0 auto',
    minWidth: 0,
    height: '100%',
  }
  const shadow = (extra?: string) => [props.edge ? edgeRight : null, extra].filter(Boolean).join(', ') || undefined
  return (
    <div style={col}>
      <div style={{ height: CAP_H, flex: '0 0 auto', background: 'var(--frame)', boxShadow: shadow(edgeBottom), display: 'flex', alignItems: 'center', minWidth: 0 }}>
        {props.cap}
      </div>
      <div style={{ flex: '1 1 0', minHeight: 0, background: props.surface, boxShadow: shadow(), overflow: 'hidden', position: 'relative' }}>
        {props.children}
      </div>
      <div style={{ height: FOOT_H, flex: '0 0 auto', background: 'var(--frame)', boxShadow: shadow(edgeTop), display: 'flex', alignItems: 'center', minWidth: 0 }}>
        {props.foot}
      </div>
    </div>
  )
}

export function AppShell() {
  useHotkeys()
  useUrlSync()
  const dispatch = useDispatch()
  const sectionId = useApp((s) => s.section)
  const def = sections[sectionId]
  const layout = useLayout()
  const crumbs = useApp((s) => def.crumbs(s).join(' › '))
  const selection = useApp((s) => s.selection[sectionId])
  const position = useApp((s) => {
    const order = def.objectOrder(s)
    const i = selection ? order.indexOf(selection) : -1
    return i >= 0 ? `${i + 1}/${order.length}` : ''
  })
  const capLabels = useApp((s) => (def.capActionsFor?.(s) ?? def.capActions).map((a) => a.label).join('|'))
  const Workspace = def.Workspace
  const Foot = def.WorkspaceFoot
  const Channel = def.Channel
  const Body = def.InspectorBody
  const InspectorFoot = def.InspectorFoot

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', background: 'var(--frame)' }}>
      <Column width={layout.railW} surface="var(--frame)" edge cap={null} foot={null}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 8, alignItems: 'center' }}>
          {(Object.keys(sections) as (keyof typeof sections)[])
            .filter((id) => sections[id].railGroup)
            .map((id) => (
              <button
                key={id}
                onClick={() => dispatch({ type: 'navigate', section: id })}
                title={sections[id].label}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 4,
                  font: 'var(--t-10m)',
                  color: def.railSection === id ? 'var(--text-1)' : 'var(--text-3)',
                  background: def.railSection === id ? 'var(--active)' : 'transparent',
                  textAlign: 'center',
                }}
              >
                {sections[id].chord}
              </button>
            ))}
        </nav>
      </Column>

      {layout.channelVisible && Channel && (
        <Column width={layout.channelW} surface="var(--frame)" edge cap={<span style={{ paddingLeft: 16, font: 'var(--t-13)', fontWeight: 500, color: 'var(--text-1)' }}>{def.channelTitle}</span>} foot={null}>
          <Channel />
        </Column>
      )}

      <Column
        grow
        surface="var(--surface)"
        edge={layout.inspectorVisible}
        cap={
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingLeft: 88, paddingRight: layout.inspectorVisible ? 12 : GLOBAL_ZONE_W + 12, gap: 8 }}>
            <span style={{ font: 'var(--t-13)', fontWeight: 500, color: 'var(--text-1)', whiteSpace: 'nowrap' }}>{crumbs}</span>
            <span style={{ flex: 1 }} />
            {capLabels.split('|').map((label) => (
              <span key={label} style={{ font: 'var(--t-12)', fontWeight: 500, color: 'var(--text-2)', padding: '0 8px' }}>
                {label}
              </span>
            ))}
          </div>
        }
        foot={<Foot />}
      >
        <Workspace />
      </Column>

      {layout.inspectorVisible && Body && selection && (
        <Column
          width={layout.inspectorW}
          surface="var(--raised)"
          edge={false}
          cap={
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingLeft: 16, paddingRight: GLOBAL_ZONE_W + 12, gap: 8 }}>
              <span style={{ font: 'var(--t-13)', fontWeight: 500, color: 'var(--text-1)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {def.objectLabel(selection)}
              </span>
              <span style={{ font: 'var(--t-11m)', color: 'var(--text-3)' }}>{position}</span>
            </div>
          }
          foot={InspectorFoot ? <InspectorFoot id={selection} /> : null}
        >
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <Body id={selection} />
          </div>
        </Column>
      )}

      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: GLOBAL_ZONE_W,
          height: CAP_H,
          zIndex: 'var(--z-global)' as unknown as number,
          background: 'var(--frame)',
          boxShadow: `${edgeBottom}, inset 1px 0 0 transparent`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => dispatch({ type: 'openPalette' })}
          style={{ width: 64, height: 24, borderRadius: 4, boxShadow: 'inset 0 0 0 1px var(--line-2)', font: 'var(--t-10m)', color: 'var(--text-3)' }}
        >
          K
        </button>
      </div>
    </div>
  )
}
