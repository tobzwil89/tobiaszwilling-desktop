import { useRef, useState } from 'react'
import { m, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { launchApp, useApps, type AppDef } from '../apps/registry'
import { AppIcon } from '../apps/AppIcon'
import { pick, useT } from '../i18n'
import { useUI } from './uiStore'

const BASE = 48
const MAX = 76

function DockIcon({ app, mouseX, magnify }: { app: AppDef; mouseX: MotionValue<number>; magnify: boolean }) {
  const ref = useRef<HTMLButtonElement>(null)
  const running = useUI((s) => !!s.windows[app.id])
  const { t, lang } = useT()
  const [hover, setHover] = useState(false)
  const title = pick(app.title, lang)

  const distance = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect()
    return b ? x - b.left - b.width / 2 : Infinity
  })
  const target = useTransform(distance, [-140, 0, 140], [BASE, MAX, BASE])
  const size = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 })
  // Emoji-Größe wächst mit dem Icon mit
  const fontSize = useTransform(size, (s) => s * 0.52)

  return (
    <div className="relative flex flex-col items-center">
      {hover && (
        <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-slate-900/85 px-2 py-1 text-xs text-white">
          {title}
        </span>
      )}
      <m.button
        ref={ref}
        id={`dock-${app.id}`}
        type="button"
        aria-label={`${t('open')}: ${title}`}
        onClick={() => launchApp(app.id)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        style={magnify ? { width: size, height: size, fontSize } : { width: BASE, height: BASE, fontSize: BASE * 0.52 }}
        className="rounded-[22%]"
      >
        <AppIcon app={app} className="drop-shadow-md" />
      </m.button>
      <span
        aria-hidden="true"
        className={`mt-1 h-1 w-1 rounded-full ${running ? 'bg-slate-800 dark:bg-white' : 'bg-transparent'}`}
      />
    </div>
  )
}

export function Dock() {
  const apps = useApps().filter((a) => a.dock)
  const mouseX = useMotionValue(Infinity)
  const reduce = useReducedMotion()
  if (apps.length === 0) return null
  return (
    <nav
      aria-label="Dock"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-2 left-1/2 z-[9000] flex -translate-x-1/2 select-none items-end gap-2 rounded-2xl border border-white/40 bg-white/35 px-2.5 pt-2 pb-1 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40"
    >
      {apps.map((app) => (
        <DockIcon key={app.id} app={app} mouseX={mouseX} magnify={!reduce} />
      ))}
    </nav>
  )
}
