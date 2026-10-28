import { useUI } from './shell/uiStore'

export type Lang = 'de' | 'en'

/** Text in beiden Sprachen – oder ein einfacher String, wenn er in beiden gleich ist. */
export type Text = string | Record<Lang, string>

export function pick(text: Text, lang: Lang): string {
  return typeof text === 'string' ? text : text[lang]
}

export function browserLang(): Lang {
  return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en'
}

// Alle festen Texte der Oberfläche
const STRINGS = {
  legal: { de: 'Impressum & Datenschutz', en: 'Legal & Privacy' },
  legalShort: { de: 'Rechtliches', en: 'Legal' },
  themeSystem: { de: 'Wie das System', en: 'Match system theme' },
  themeLight: { de: 'Heller Modus', en: 'Light mode' },
  themeDark: { de: 'Dunkler Modus', en: 'Dark mode' },
  toLight: { de: 'Zu hellem Modus wechseln', en: 'Switch to light mode' },
  toDark: { de: 'Zu dunklem Modus wechseln', en: 'Switch to dark mode' },
  switchLang: { de: 'Switch to English', en: 'Auf Deutsch umschalten' },
  mainMenu: { de: 'Hauptmenü', en: 'Main menu' },
  open: { de: 'Öffnen', en: 'Open' },
  openHint: { de: 'Doppelklick oder Enter zum Öffnen', en: 'double-click or Enter to open' },
  openNewTab: { de: 'In neuem Tab öffnen', en: 'Open in new tab' },
  sourceCode: { de: 'Quellcode', en: 'Source code' },
  info: { de: 'Infos zum Projekt', en: 'About this project' },
  backToApp: { de: 'Zurück zur App', en: 'Back to the app' },
  inProgress: { de: 'In Arbeit – noch nicht online.', en: 'Work in progress – not online yet.' },
  close: { de: 'Schließen', en: 'Close' },
  minimize: { de: 'Minimieren', en: 'Minimize' },
  maximize: { de: 'Maximieren', en: 'Maximize' },
  restore: { de: 'Wiederherstellen', en: 'Restore' },
  home: { de: 'Home', en: 'Home' },
  backHome: { de: 'Zurück zum Homescreen', en: 'Back to home screen' },
  favourites: { de: 'Favoriten', en: 'Favourite apps' },
  loading: { de: 'Lädt', en: 'Loading' },
  starting: { de: 'Startet', en: 'Starting' },
  skip: { de: 'Klicken oder Taste drücken zum Überspringen', en: 'Click or press any key to skip' },
  private: { de: 'privat', en: 'private' },
} satisfies Record<string, Record<Lang, string>>

export type StringKey = keyof typeof STRINGS

/** Hook: liefert t('key') in der aktuellen Sprache plus die Sprache selbst. */
export function useT() {
  const lang = useUI((s) => s.lang)
  const t = (key: StringKey) => STRINGS[key][lang]
  return { t, lang }
}
