import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { snap } from '../../lib/motion'
import { cx } from '../../lib/cx'
import s from './Notch.module.css'

export interface NotchProps {
  /** 'v': 2 wide × length tall (separators). 'h': length wide × 2 tall (the segment hairline). */
  orientation: 'v' | 'h'
  /** Length in px (20 for separator notches, 16 for the menu context notch) or any CSS length ('100%'). */
  length: number | string
  /** Shared layout id: the notch slides between owners with the `snap` spring (rail-notch, segment-notch, channel-notch). */
  layoutId?: string
  /** Positioning only (left / top / right / bottom). The notch is absolutely positioned. */
  style?: CSSProperties
  className?: string
}

/** 2px accent notch (§8.7, accent role 1). Mounts settled (`initial={false}`); moves only through `layoutId`. */
export function Notch({ orientation, length, layoutId, style, className }: NotchProps) {
  const size: CSSProperties =
    orientation === 'v' ? { width: 2, height: length } : { width: length, height: 2 }
  return (
    <motion.span
      aria-hidden
      className={cx(s.notch, className)}
      style={{ ...size, ...style }}
      layoutId={layoutId}
      initial={false}
      transition={snap}
    />
  )
}
