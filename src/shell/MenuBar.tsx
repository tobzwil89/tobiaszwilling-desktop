import { useEffect, useRef, useState } from 'react'
import { APP_BY_ID } from '../apps/registry'
import { SITE_NAME } from '../config'
import { pick, useT } from '../i18n'
import { useClock, useIsDark } from '../lib/hooks'
import { useUI } from './uiStore'

/** Eigenes Logo: ein „T“ (kein Apple-Logo). */
export function Logo({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M12 14h40M32 14v38" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
    </svg>
  )
}

function LogoMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { openApp, setTheme } = useUI.getState()
  const theme = useUI((s) => s.theme)
  const { t } = useT()

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const item = 'block w-full rounded px-3 py-1 text-left hover:bg-blue-600 hover:text-white focus-visible:bg-blue-600 focus-visible:text-white'
  const run = (fn: () => void) => () => {
    fn()
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t('mainMenu')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid h-7 place-items-center rounded px-2 hover:bg-black/10 dark:hover:bg-white/15"
      >
        <Logo size={14} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-7 w-60 rounded-lg border border-black/10 bg-white/95 p-1 text-[13px] shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-800/95"
        >
          <button role="menuitem" className={item} onClick={run(() => openApp('about'))}>
            {t('about')}
          </button>
          <div className="my-1 h-px bg-black/10 dark:bg-white/10" />
          {(['system', 'light', 'dark'] as const).map((th) => (
            <button key={th} role="menuitemradio" aria-checked={theme === th} className={item} onClick={run(() => setTheme(th))}>
              {theme === th ? '✓ ' : ' '}
              {th === 'system' ? t('themeSystem') : th === 'light' ? t('themeLight') : t('themeDark')}
            </button>
          ))}
          <div className="my-1 h-px bg-black/10 dark:bg-white/10" />
          <button role="menuitem" className={item} onClick={run(() => openApp('legal'))}>
            {t('legal')}
          </button>
        </div>
      )}
    </div>
  )
}

/** Sprachumschalter DE/EN (auch auf dem Handy genutzt). */
export function LangToggle() {
  const { t, lang } = useT()
  return (
    <button
      type="button"
      aria-label={t('switchLang')}
      title={t('switchLang')}
      onClick={() => useUI.getState().setLang(lang === 'de' ? 'en' : 'de')}
      className="grid h-7 place-items-center rounded px-1.5 text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/15"
    >
      {lang === 'de' ? 'EN' : 'DE'}
    </button>
  )
}

function ThemeToggle() {
  const isDark = useIsDark()
  const { t } = useT()
  return (
    <button
      type="button"
      aria-label={isDark ? t('toLight') : t('toDark')}
      onClick={() => useUI.getState().setTheme(isDark ? 'light' : 'dark')}
      className="grid h-7 w-7 place-items-center rounded hover:bg-black/10 dark:hover:bg-white/15"
    >
      {isDark ? '☾' : '☀'}
    </button>
  )
}

function Clock() {
  const now = useClock()
  const { lang } = useT()
  const locale = lang === 'de' ? 'de-DE' : 'en-GB'
  const day = now.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' })
  const time = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  return (
    <time dateTime={now.toISOString()} className="px-1 tabular-nums">
      <span className="hidden lg:inline">{day}&nbsp;&nbsp;</span>
      {time}
    </time>
  )
}

export function MenuBar() {
  const focused = useUI((s) => s.focused)
  const { lang } = useT()
  const app = focused ? APP_BY_ID[focused] : undefined
  return (
    <header className="fixed inset-x-0 top-0 z-[9500] flex h-7 select-none items-center justify-between bg-white/55 px-2 text-[13px] text-slate-900 backdrop-blur-xl dark:bg-slate-950/45 dark:text-white">
      <div className="flex items-center gap-1">
        <LogoMenu />
        <span className="px-2 font-semibold">{app ? pick(app.title, lang) : SITE_NAME}</span>
      </div>
      <div className="flex items-center gap-1">
        <LangToggle />
        <ThemeToggle />
        <Clock />
      </div>
    </header>
  )
}
