import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { browserLang, type Lang } from '../i18n'

export type Geometry = { x: number; y: number; w: number; h: number }
export type WindowState = { minimized: boolean; maximized: boolean; z: number }
export type Theme = 'system' | 'light' | 'dark'

type UIState = {
  theme: Theme
  lang: Lang
  showPrivate: boolean
  windows: Record<string, WindowState>
  geometry: Record<string, Geometry>
  topZ: number
  focused: string | null
  openApp: (id: string) => void
  closeApp: (id: string) => void
  minimizeApp: (id: string) => void
  toggleMaximize: (id: string) => void
  focusApp: (id: string) => void
  setGeometry: (id: string, g: Geometry) => void
  setTheme: (t: Theme) => void
  setLang: (l: Lang) => void
}

/** Oberstes sichtbares Fenster (für den Fokus nach Schließen/Minimieren). */
function topVisible(windows: UIState['windows'], except: string): string | null {
  let best: string | null = null
  let bestZ = -1
  for (const [id, w] of Object.entries(windows)) {
    if (id !== except && !w.minimized && w.z > bestZ) {
      best = id
      bestZ = w.z
    }
  }
  return best
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      lang: browserLang(),
      showPrivate: false,
      windows: {},
      geometry: {},
      topZ: 10,
      focused: null,
      openApp: (id) =>
        set((s) => {
          const z = s.topZ + 1
          const prev = s.windows[id]
          return {
            topZ: z,
            focused: id,
            windows: { ...s.windows, [id]: { minimized: false, maximized: prev?.maximized ?? false, z } },
          }
        }),
      closeApp: (id) =>
        set((s) => {
          const windows = { ...s.windows }
          delete windows[id]
          return { windows, focused: s.focused === id ? topVisible(windows, id) : s.focused }
        }),
      minimizeApp: (id) =>
        set((s) => {
          const w = s.windows[id]
          if (!w) return s
          const windows = { ...s.windows, [id]: { ...w, minimized: true } }
          return { windows, focused: topVisible(windows, id) }
        }),
      toggleMaximize: (id) =>
        set((s) => {
          const w = s.windows[id]
          if (!w) return s
          return { windows: { ...s.windows, [id]: { ...w, maximized: !w.maximized } } }
        }),
      focusApp: (id) =>
        set((s) => {
          const w = s.windows[id]
          if (!w || (s.focused === id && !w.minimized)) return s
          const z = s.topZ + 1
          return { topZ: z, focused: id, windows: { ...s.windows, [id]: { ...w, minimized: false, z } } }
        }),
      setGeometry: (id, g) => set((s) => ({ geometry: { ...s.geometry, [id]: g } })),
      setTheme: (theme) => set({ theme }),
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'tz-desktop-ui',
      // Nur Einstellungen und Fensterpositionen merken, nicht welche Fenster offen sind
      partialize: (s) => ({ theme: s.theme, lang: s.lang, showPrivate: s.showPrivate, geometry: s.geometry }),
    },
  ),
)

/** ?private=1 blendet private Apps ein, ?private=0 wieder aus (wird gemerkt). */
const flag = new URLSearchParams(window.location.search).get('private')
if (flag !== null) {
  useUI.setState({ showPrivate: flag === '1' })
  window.history.replaceState(null, '', window.location.pathname)
}
