// Schematic work thumbnails (§7.1 Selected work): grayscale line drawings in a sunken well.
// Every kind is drawn on a 170 × 96 grid and scaled to the requested size.
import type { ReactNode } from 'react'
import s from './WorkThumb.module.css'

const W = 170
const H = 96

const handles = (x: number, y: number, w: number, h: number) =>
  [
    [x, y],
    [x + w, y],
    [x, y + h],
    [x + w, y + h],
  ].map(([cx, cy], i) => <rect key={i} className={s.handle} x={cx - 2} y={cy - 2} width={4} height={4} />)

const DRAW: Record<string, ReactNode> = {
  // Three overlapping frames, one selected with handles, a dashed marquee sweeping across them.
  'selection-model': (
    <>
      <rect className={s.line} x={22} y={18} width={58} height={40} />
      <rect className={s.line} x={64} y={34} width={52} height={36} />
      <rect className={s.line} x={100} y={16} width={46} height={30} />
      <rect className={s.selected} x={64} y={34} width={52} height={36} />
      {handles(64, 34, 52, 36)}
      <rect className={s.marquee} x={54} y={27} width={70} height={52} />
      <path className={s.cursor} d="M124 79 L124 89 L127 86 L130 91 L132 90 L129 85 L133 85 Z" />
    </>
  ),
  // Five steps joined by right-angle connectors; the fourth is the pivot.
  'disputes-flow': (
    <>
      <path className={s.line} d="M29 30 H56 M64 30 H80 V62 H88 M96 62 H112 V30 H120 M128 30 H141" />
      <rect className={s.line} x={21} y={26} width={8} height={8} />
      <rect className={s.line} x={56} y={26} width={8} height={8} />
      <rect className={s.line} x={88} y={58} width={8} height={8} />
      <rect className={s.fill} x={120} y={26} width={8} height={8} />
      <rect className={s.line} x={141} y={26} width={8} height={8} />
      <path className={s.faint} d="M21 78 H69 M21 84 H55" />
    </>
  ),
  // One source file compiled to three platform targets.
  'token-pipeline': (
    <>
      <rect className={s.line} x={20} y={34} width={36} height={28} />
      <path className={s.faint} d="M26 42 H48 M26 48 H44 M26 54 H40" />
      <path className={s.line} d="M56 48 H78 M78 22 V74 M78 22 H96 M78 48 H96 M78 74 H96" />
      <rect className={s.line} x={96} y={15} width={52} height={14} />
      <rect className={s.selected} x={96} y={41} width={52} height={14} />
      <rect className={s.line} x={96} y={67} width={52} height={14} />
    </>
  ),
  'component-grid': (
    <>
      {[0, 1, 2, 3].map((c) =>
        [0, 1].map((r) => <rect key={`${c}${r}`} className={c === 1 && r === 0 ? s.selected : s.line} x={20 + c * 34} y={20 + r * 30} width={26} height={22} />),
      )}
      <path className={s.faint} d="M20 82 H86" />
    </>
  ),
  'map-style': (
    <>
      <path className={s.faint} d="M14 70 L48 52 L80 60 L118 34 L156 42" />
      <path className={s.line} d="M14 30 L60 36 L96 22 L156 28 M40 88 L64 58 L70 12 M120 90 L110 56 L136 12" />
      <rect className={s.fill} x={92} y={50} width={6} height={6} />
    </>
  ),
  'dispatch-table': (
    <>
      {[0, 1, 2, 3, 4].map((r) => (
        <path key={r} className={r === 2 ? s.selectedLine : s.faint} d={`M20 ${22 + r * 13} H64 M76 ${22 + r * 13} H112 M124 ${22 + r * 13} H150`} />
      ))}
    </>
  ),
  stepper: (
    <>
      <path className={s.line} d="M28 48 H142" />
      {[28, 66, 104, 142].map((x, i) => (
        <rect key={x} className={i < 2 ? s.fill : s.lineBg} x={x - 5} y={43} width={10} height={10} />
      ))}
      <path className={s.faint} d="M20 72 H60 M58 72 H84" />
    </>
  ),
  'phone-flow': (
    <>
      {[34, 76, 118].map((x, i) => (
        <g key={x}>
          <rect className={i === 1 ? s.selected : s.line} x={x} y={16} width={30} height={64} />
          <path className={s.faint} d={`M${x + 6} 30 H${x + 24} M${x + 6} 38 H${x + 18}`} />
        </g>
      ))}
      <path className={s.line} d="M64 48 H76 M106 48 H118" />
    </>
  ),
}

export function WorkThumb({ kind, width, height }: { kind: string; width: number; height: number }) {
  return (
    <svg className={s.thumb} width={width} height={height} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" data-kind={kind} aria-hidden>
      {DRAW[kind] ?? DRAW['component-grid']}
    </svg>
  )
}
