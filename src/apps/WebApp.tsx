import { useState } from 'react'
import { pick, useT } from '../i18n'
import { AppIcon } from './AppIcon'
import type { AppDef } from './registry'
import { Spinner } from '../shell/Spinner'

/** Projektsteckbrief: Beschreibung, Technik, Links. */
export function AppInfo({ app }: { app: AppDef }) {
  const { t, lang } = useT()
  const link = 'rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600'
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 p-6 text-center">
      <AppIcon app={app} size={88} className="drop-shadow-md" />
      <h3 className="text-xl font-bold">{pick(app.title, lang)}</h3>
      {app.description && <p className="leading-relaxed text-slate-600 dark:text-slate-300">{pick(app.description, lang)}</p>}
      {!app.url && <p className="text-sm font-medium text-amber-600 dark:text-amber-400">{t('inProgress')}</p>}
      {app.tech && (
        <ul className="flex flex-wrap justify-center gap-1.5">
          {app.tech.map((tech) => (
            <li key={tech} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium dark:bg-slate-800">
              {tech}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {app.url && (
          <a className={link} href={app.url} target="_blank" rel="noopener noreferrer">
            {t('openNewTab')} ↗
          </a>
        )}
        {app.source && (
          <a className={link} href={app.source} target="_blank" rel="noopener noreferrer">
            {t('sourceCode')} ↗
          </a>
        )}
      </div>
    </div>
  )
}

/** Inhalt eines Fensters für eine App aus apps.json: die Webseite im iframe, umschaltbar auf den Steckbrief. */
export function WebApp({ app, showInfo }: { app: AppDef; showInfo: boolean }) {
  const { lang } = useT()
  const [loaded, setLoaded] = useState(false)
  if (!app.url) return <AppInfo app={app} />
  return (
    <div className="relative h-full">
      <iframe
        src={app.url}
        title={pick(app.title, lang)}
        onLoad={() => setLoaded(true)}
        allow="fullscreen; clipboard-write"
        className="h-full w-full border-0 bg-white"
      />
      {!loaded && (
        <div className="absolute inset-0 bg-white dark:bg-slate-900">
          <Spinner />
        </div>
      )}
      {showInfo && <div className="absolute inset-0 overflow-auto bg-white dark:bg-slate-900"><AppInfo app={app} /></div>}
    </div>
  )
}
