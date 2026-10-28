import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, LazyMotion } from 'framer-motion'
import { useApplyTheme, useIsMobile } from './lib/hooks'
import { BootScreen } from './shell/BootScreen'
import { useUI } from './shell/uiStore'

// Desktop und Handy getrennt laden: das Handy braucht keine Fensterverwaltung
const DesktopShell = lazy(() => import('./shell/DesktopShell').then((mod) => ({ default: mod.DesktopShell })))
const MobileShell = lazy(() => import('./shell/MobileShell').then((mod) => ({ default: mod.MobileShell })))
const loadMotionFeatures = () => import('./lib/motionFeatures').then((mod) => mod.default)

export default function App() {
  useApplyTheme()
  const isMobile = useIsMobile()
  const lang = useUI((s) => s.lang)
  const [booted, setBooted] = useState(false)
  const finishBoot = useCallback(() => setBooted(true), [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <Suspense fallback={null}>{isMobile ? <MobileShell /> : <DesktopShell />}</Suspense>
      <AnimatePresence>{!booted && <BootScreen key="boot" onDone={finishBoot} />}</AnimatePresence>
    </LazyMotion>
  )
}
