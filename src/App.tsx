import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { readBoot } from './lib/boot'
import { OVERLAY_ROOT_ID } from './lib/overlay'
import { useStage } from './lib/stage'
import { AppShell } from './shell/AppShell'
import { ScrollContainerProvider } from './shell/scroll'
import { StoreProvider } from './state/store'
import s from './styles/stage.module.css'

const boot = readBoot()

export function App() {
  return (
    <StoreProvider initial={boot}>
      <MotionConfig reducedMotion="user">
        <Stage>
          <ScrollContainerProvider>
            <AppShell />
          </ScrollContainerProvider>
        </Stage>
      </MotionConfig>
    </StoreProvider>
  )
}

/**
 * At >= 1200px the app fills the viewport (position fixed, inset 0).
 * Below 1200px (phones, narrow previews) it renders in a fixed 1440 × 1024 box scaled by innerWidth / 1440,
 * so the whole design is visible without horizontal scroll. The overlay root lives inside the stage box.
 */
function Stage({ children }: { children: ReactNode }) {
  const { scaled, width, height, scale } = useStage()
  // One tree for both modes, so crossing the breakpoint never remounts the app.
  return (
    <div className={scaled ? s.scroller : s.full}>
      <div
        className={s.sizer}
        style={scaled ? { width: width * scale, height: height * scale } : { width: '100%', height: '100%' }}
      >
        <div
          id="strivo-stage"
          className={s.box}
          style={scaled ? { width, height, transform: `scale(${scale})` } : { width: '100%', height: '100%' }}
        >
          <div className={s.fill}>{children}</div>
          <div id={OVERLAY_ROOT_ID} className={s.overlays} />
        </div>
      </div>
    </div>
  )
}
