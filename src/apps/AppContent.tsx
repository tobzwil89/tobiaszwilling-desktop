import { Suspense } from 'react'
import { Spinner } from '../shell/Spinner'
import type { AppDef } from './registry'
import { WebApp } from './WebApp'

/** Was in einem Fenster steht: eingebaute App oder Webseite aus apps.json. */
export function AppContent({ app, showInfo }: { app: AppDef; showInfo: boolean }) {
  if (app.Component) {
    return (
      <Suspense fallback={<Spinner />}>
        <app.Component />
      </Suspense>
    )
  }
  return <WebApp app={app} showInfo={showInfo} />
}

/** Nur Web-Apps mit Adresse haben einen Infoknopf (ohne Adresse ist der Steckbrief schon der Inhalt). */
export const hasInfo = (app: AppDef) => !app.Component && !!app.url
