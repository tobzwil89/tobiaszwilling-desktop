import { AnimatePresence } from 'framer-motion'
import { APP_BY_ID } from '../apps/registry'
import { useUI } from './uiStore'
import { Wallpaper } from './Wallpaper'
import { MenuBar } from './MenuBar'
import { Dock } from './Dock'
import { DesktopIcons } from './DesktopIcons'
import { Window } from './Window'

export function DesktopShell() {
  const windows = useUI((s) => s.windows)
  const openApps = Object.keys(windows).flatMap((id) => APP_BY_ID[id] ?? [])
  return (
    <div className="fixed inset-0 overflow-hidden">
      <Wallpaper />
      <MenuBar />
      <main className="absolute inset-x-0 bottom-0 top-7" aria-label="Desktop">
        <DesktopIcons />
        <AnimatePresence>
          {openApps.map((app, i) => (
            <Window key={app.id} app={app} index={i} />
          ))}
        </AnimatePresence>
      </main>
      <Dock />
    </div>
  )
}
