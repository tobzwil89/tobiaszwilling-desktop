import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { APP_BY_ID, launchApp, useApps, type AppDef } from '../apps/registry'
import { AppContent, hasInfo } from '../apps/AppContent'
import { AppIcon } from '../apps/AppIcon'
import { SITE_NAME } from '../config'
import { pick, useT } from '../i18n'
import { useClock } from '../lib/hooks'
import { LangToggle } from './MenuBar'
import { useUI } from './uiStore'
import { Wallpaper } from './Wallpaper'

/** Zurück: über den Browser-Verlauf, damit auch die System-Zurück-Geste funktioniert. */
function goBack() {
  const ui = useUI.getState()
  if (window.history.state?.app) window.history.back()
  else if (ui.focused) ui.closeApp(ui.focused)
}

function MobileAppView({ app }: { app: AppDef }) {
  const { t, lang } = useT()
  const reduce = useReducedMotion()
  const startX = useRef<number | null>(null)
  const [dx, setDx] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const title = pick(app.title, lang)
  const headerButton = 'grid h-12 min-w-10 place-items-center px-2 text-lg text-blue-600 dark:text-blue-400'

  return (
    <m.div
      role="dialog"
      aria-label={title}
      className="fixed inset-0 z-50 flex flex-col bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
      initial={reduce ? false : { x: '100%' }}
      animate={{ x: 0 }}
      exit={reduce ? { opacity: 0 } : { x: '100%' }}
      transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
      style={dx ? { translateX: dx } : undefined}
      // Wischgeste vom linken Rand = zurück
      onTouchStart={(e) => {
        const x = e.touches[0].clientX
        startX.current = x < 28 ? x : null
      }}
      onTouchMove={(e) => {
        if (startX.current !== null) setDx(Math.max(0, e.touches[0].clientX - startX.current))
      }}
      onTouchEnd={() => {
        if (startX.current !== null && dx > 90) goBack()
        startX.current = null
        setDx(0)
      }}
    >
      <header className="flex shrink-0 items-center border-b border-black/10 bg-slate-50/90 px-2 pt-[env(safe-area-inset-top)] dark:border-white/10 dark:bg-slate-800/90">
        <button
          type="button"
          onClick={goBack}
          aria-label={t('backHome')}
          className="flex h-12 min-w-20 items-center gap-1 px-2 text-[15px] font-medium text-blue-600 dark:text-blue-400"
        >
          <span aria-hidden="true" className="text-2xl leading-none">‹</span> {t('home')}
        </button>
        <h1 className="flex-1 truncate text-center text-[15px] font-semibold">{title}</h1>
        <div className="flex min-w-20 justify-end">
          {hasInfo(app) && (
            <>
              <button
                type="button"
                className={headerButton}
                aria-pressed={showInfo}
                aria-label={showInfo ? t('backToApp') : t('info')}
                onClick={() => setShowInfo((v) => !v)}
              >
                {showInfo ? '←' : 'ⓘ'}
              </button>
              <a className={headerButton} href={app.url} target="_blank" rel="noopener noreferrer" aria-label={t('openNewTab')}>
                ↗
              </a>
            </>
          )}
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <AppContent app={app} showInfo={showInfo} />
      </div>
    </m.div>
  )
}

function AppButton({ app, size = 60, showLabel = true }: { app: AppDef; size?: number; showLabel?: boolean }) {
  const { t, lang } = useT()
  const title = pick(app.title, lang)
  return (
    <button
      type="button"
      onClick={() => launchApp(app.id)}
      aria-label={`${t('open')}: ${title}`}
      className="flex w-full flex-col items-center gap-1.5 active:scale-95 transition-transform"
    >
      <AppIcon app={app} size={size} className="drop-shadow-md" />
      {showLabel && (
        <span className="w-full truncate text-center text-xs font-medium text-slate-900 dark:text-white dark:[text-shadow:0_1px_3px_rgba(0,0,0,.7)]">
          {title}
        </span>
      )}
    </button>
  )
}

export function MobileShell() {
  const apps = useApps()
  const focused = useUI((s) => s.focused)
  const windows = useUI((s) => s.windows)
  const current = focused && windows[focused] ? APP_BY_ID[focused] : undefined
  const { t, lang } = useT()
  const now = useClock()
  const dockApps = apps.filter((a) => a.dock)

  // Jede geöffnete App bekommt einen Verlaufseintrag → Browser-Zurück schließt sie
  useEffect(() => {
    if (current && window.history.state?.app !== current.id) window.history.pushState({ app: current.id }, '')
  }, [current])

  useEffect(() => {
    const onPop = () => {
      const ui = useUI.getState()
      if (ui.focused) ui.closeApp(ui.focused)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <Wallpaper />
      <div className="relative flex h-11 shrink-0 items-center justify-between px-5 pt-[env(safe-area-inset-top)] text-sm font-semibold text-slate-900 dark:text-white">
        <time>{now.toLocaleTimeString(lang === 'de' ? 'de-DE' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}</time>
        <LangToggle />
      </div>
      <main className="relative min-h-0 flex-1 overflow-y-auto px-5 pb-32 pt-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{SITE_NAME}</h1>
        <ul className="mt-5 grid grid-cols-4 gap-x-2 gap-y-6">
          {apps.map((a) => (
            <li key={a.id} className="flex min-w-0 justify-center">
              <AppButton app={a} />
            </li>
          ))}
        </ul>
      </main>
      {dockApps.length > 0 && (
        <nav
          aria-label={t('favourites')}
          className="absolute inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] flex justify-around rounded-[28px] border border-white/30 bg-white/30 p-3 backdrop-blur-xl dark:bg-slate-900/40"
        >
          {dockApps.map((a) => (
            <div key={a.id} className="w-14">
              <AppButton app={a} size={56} showLabel={false} />
            </div>
          ))}
        </nav>
      )}
      <AnimatePresence>{current && <MobileAppView key={current.id} app={current} />}</AnimatePresence>
    </div>
  )
}
