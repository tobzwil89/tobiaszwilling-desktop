import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, OWNER_NAME, PHOTO_URL } from '../config'
import { pick, useT, type Text } from '../i18n'
import { AppIcon } from './AppIcon'
import { launchApp, useApps } from './registry'

// Texte für „Über mich“ – hier anpassen.
const TAGLINE: Text = { de: 'Platzhalter: Wer du bist, in einem Satz.', en: 'Placeholder: who you are, in one sentence.' }
const INTRO: Text = {
  de: 'Platzhalter: Zwei, drei Sätze über dich, deinen Hintergrund und warum du diese Apps baust.',
  en: 'Placeholder: two or three sentences about you, your background and why you build these apps.',
}

export default function AboutApp() {
  const { t, lang } = useT()
  const projects = useApps().filter((a) => !a.Component)
  const initials = OWNER_NAME.split(' ').map((w) => w[0]).join('')
  const link = 'rounded-xl bg-slate-200 px-3 py-1.5 text-sm font-semibold hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600'

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <header className="flex items-center gap-4">
        {PHOTO_URL ? (
          <img src={PHOTO_URL} alt={OWNER_NAME} className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-full bg-indigo-600 text-2xl font-bold text-white">{initials}</div>
        )}
        <div>
          <h3 className="text-2xl font-bold">{OWNER_NAME}</h3>
          <p className="text-slate-600 dark:text-slate-300">{pick(TAGLINE, lang)}</p>
        </div>
      </header>
      <p className="leading-relaxed">{pick(INTRO, lang)}</p>
      <div className="flex flex-wrap gap-2">
        <a className={link} href={`mailto:${CONTACT_EMAIL}`}>E-Mail</a>
        {LINKEDIN_URL && <a className={link} href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
        {GITHUB_URL && <a className={link} href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
      </div>
      <section>
        <h4 className="mb-2 font-semibold">{t('projects')}</h4>
        <ul className="flex flex-col gap-1">
          {projects.map((app) => (
            <li key={app.id}>
              <button
                type="button"
                onClick={() => launchApp(app.id)}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <AppIcon app={app} size={40} />
                <span className="min-w-0">
                  <span className="block font-semibold">
                    {pick(app.title, lang)}
                    {app.private && <span className="ml-2 text-xs font-normal text-slate-500">({t('private')})</span>}
                  </span>
                  {app.description && <span className="block truncate text-sm text-slate-500 dark:text-slate-400">{pick(app.description, lang)}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
