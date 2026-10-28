import { useState } from 'react'
import { IMPRINT, PRIVACY_UPDATED } from '../config'
import { useT } from '../i18n'
import { Segmented } from './ui'

function Imprint() {
  const { lang } = useT()
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold">Impressum</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'de' ? 'Angaben gemäß § 5 DDG' : 'Information according to § 5 DDG'}</p>
      <p>
        {IMPRINT.name}
        <br />
        {IMPRINT.address.map((line) => (
          <span key={line}>
            {line}
            <br />
          </span>
        ))}
      </p>
      <p>E-Mail: {IMPRINT.email}</p>
    </div>
  )
}

// Datenschutz in beiden Sprachen, je Abschnitt [Überschrift, Text]
const PRIVACY = {
  de: [
    ['Kurz gesagt', 'Keine Cookies, kein Tracking, keine Analyse-Werkzeuge. Theme, Sprache und Fensterpositionen werden nur in deinem Browser gespeichert (localStorage).'],
    ['Verantwortlich', `${IMPRINT.name}, ${IMPRINT.address.join(', ')}, ${IMPRINT.email}`],
    ['Hosting', 'Diese Seite liegt auf GitHub Pages (GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA). Beim Aufruf übermittelt dein Browser technische Daten wie deine IP-Adresse an GitHub, die GitHub aus Sicherheitsgründen in Logdateien speichern kann. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.'],
    ['Eingebettete Apps', 'Die Apps in den Fenstern sind eigene Webseiten unter Subdomains von tobiaszwilling.me. Sie werden erst geladen, wenn du ein Fenster öffnest. Für sie gilt jeweils ihre eigene Datenschutzerklärung.'],
    ['Deine Rechte', 'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO) sowie auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde.'],
  ],
  en: [
    ['In short', 'No cookies, no tracking, no analytics. Theme, language and window positions are stored only in your browser (localStorage).'],
    ['Who is responsible', `${IMPRINT.name}, ${IMPRINT.address.join(', ')}, ${IMPRINT.email}`],
    ['Hosting', 'This site is hosted on GitHub Pages (GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA). When you visit, your browser transmits technical data such as your IP address to GitHub, which may store it in log files for security purposes. Legal basis: Art. 6 (1) (f) GDPR.'],
    ['Embedded apps', 'The apps inside the windows are separate websites on subdomains of tobiaszwilling.me. They only load when you open a window. Each has its own privacy policy.'],
    ['Your rights', 'You have the right to access, rectification, erasure, restriction, data portability and objection (Art. 15–21 GDPR), and to lodge a complaint with a data protection authority.'],
  ],
}

function Privacy() {
  const { lang } = useT()
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold">{lang === 'de' ? 'Datenschutzerklärung' : 'Privacy policy'}</h3>
      {PRIVACY[lang].map(([title, text]) => (
        <div key={title}>
          <h4 className="font-semibold">{title}</h4>
          <p>{text}</p>
        </div>
      ))}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {lang === 'de' ? 'Stand' : 'Last updated'}: {PRIVACY_UPDATED[lang]}
      </p>
    </div>
  )
}

export default function LegalApp() {
  const { lang } = useT()
  const [tab, setTab] = useState<'imprint' | 'privacy'>('imprint')
  return (
    <div className="flex flex-col gap-4 p-4 text-sm leading-relaxed sm:p-6">
      <Segmented
        label="Document"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'imprint', label: 'Impressum' },
          { value: 'privacy', label: lang === 'de' ? 'Datenschutz' : 'Privacy' },
        ]}
      />
      {tab === 'imprint' ? <Imprint /> : <Privacy />}
    </div>
  )
}
