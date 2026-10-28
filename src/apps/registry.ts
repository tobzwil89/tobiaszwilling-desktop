import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { Text } from '../i18n'
import { useUI } from '../shell/uiStore'
import appList from '../apps.json'

/** Ein Eintrag in src/apps.json. Pflicht sind nur id, title und icon. */
export type AppEntry = {
  id: string
  title: Text
  description?: Text
  /** Adresse der App. Leer = nur Projektsteckbrief („in Arbeit“). */
  url?: string
  /** Link zum Quellcode (z. B. GitHub). */
  source?: string
  tech?: string[]
  /** Emoji, Buchstabe oder Bildpfad (z. B. "/icons/training.png" aus public/). */
  icon: string
  /** Hintergrundfarbe des Icons. */
  color?: string
  size?: { w: number; h: number }
  /** Auch im Dock anzeigen. */
  dock?: boolean
  /** Nur sichtbar nach Aufruf mit ?private=1 (kein Schutz, nur ausgeblendet). */
  private?: boolean
  /** false = öffnet in neuem Tab statt im Fenster (braucht url). */
  embed?: boolean
}

export type AppDef = AppEntry & {
  color: string
  size: { w: number; h: number }
  /** Nur eingebaute Apps (Über mich, Rechtliches) haben eigenen Code. */
  Component?: LazyExoticComponent<ComponentType>
}

const DEFAULT_SIZE = { w: 960, h: 680 }
export const MIN_SIZE = { w: 340, h: 320 }

const BUILTIN: AppDef[] = [
  {
    id: 'about',
    title: { de: 'Über mich', en: 'About me' },
    icon: '👋',
    color: '#334155',
    size: { w: 620, h: 640 },
    dock: true,
    Component: lazy(() => import('./AboutApp')),
  },
  {
    id: 'legal',
    title: { de: 'Rechtliches', en: 'Legal' },
    icon: '§',
    color: '#64748b',
    size: { w: 540, h: 560 },
    Component: lazy(() => import('./LegalApp')),
  },
]

const entries = (appList as AppEntry[]).map((a) => ({ ...a, color: a.color ?? '#6366f1', size: a.size ?? DEFAULT_SIZE }))

/** Alle Apps: zuerst die aus apps.json, dann die eingebauten. */
export const ALL_APPS: AppDef[] = [...entries, ...BUILTIN]

export const APP_BY_ID: Record<string, AppDef | undefined> = Object.fromEntries(ALL_APPS.map((a) => [a.id, a]))

/** App öffnen: neuer Tab bei embed: false, sonst Fenster öffnen oder nach vorn holen. */
export function launchApp(id: string) {
  const app = APP_BY_ID[id]
  if (app?.embed === false && app.url) {
    window.open(app.url, '_blank', 'noopener,noreferrer')
    return
  }
  const ui = useUI.getState()
  if (ui.windows[id]) ui.focusApp(id)
  else ui.openApp(id)
}

/** Die Apps, die gerade angezeigt werden (private nur, wenn freigeschaltet). */
export function useApps(): AppDef[] {
  const showPrivate = useUI((s) => s.showPrivate)
  return showPrivate ? ALL_APPS : ALL_APPS.filter((a) => !a.private)
}
