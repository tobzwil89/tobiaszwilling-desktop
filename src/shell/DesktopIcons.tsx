import { useState } from 'react'
import { launchApp, useApps } from '../apps/registry'
import { AppIcon } from '../apps/AppIcon'
import { pick, useT } from '../i18n'

export function DesktopIcons() {
  const apps = useApps()
  const { t, lang } = useT()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <ul
      aria-label="Desktop"
      className="absolute right-4 top-4 flex max-h-[calc(100%-7rem)] select-none flex-col flex-wrap-reverse content-start gap-3"
    >
      {apps.map((app) => (
        <li key={app.id}>
          <button
            type="button"
            aria-label={`${pick(app.title, lang)} (${t('openHint')})`}
            onClick={() => setSelected(app.id)}
            onDoubleClick={() => launchApp(app.id)}
            onPointerUp={(e) => e.pointerType === 'touch' && launchApp(app.id)}
            onKeyDown={(e) => e.key === 'Enter' && launchApp(app.id)}
            onBlur={() => setSelected(null)}
            className={`flex w-24 flex-col items-center gap-1 rounded-lg p-1.5 ${selected === app.id ? 'bg-black/15 dark:bg-white/15' : ''}`}
          >
            <AppIcon app={app} size={54} className="drop-shadow-md" />
            <span
              className={`rounded px-1.5 text-center text-xs leading-snug text-white ${selected === app.id ? 'bg-blue-600' : 'bg-black/55'}`}
            >
              {pick(app.title, lang)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
