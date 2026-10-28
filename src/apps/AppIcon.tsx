import type { AppDef } from './registry'

const isImage = (icon: string) => icon.startsWith('/') || icon.startsWith('http')

/**
 * App-Icon: Bild aus public/ oder Emoji/Buchstabe auf farbiger Kachel.
 * Ohne size füllt es das Elternelement und übernimmt dessen Schriftgröße (fürs Dock).
 */
export function AppIcon({ app, size, className = '' }: { app: AppDef; size?: number; className?: string }) {
  const style = size ? { width: size, height: size, fontSize: size * 0.52 } : { width: '100%', height: '100%' }
  if (isImage(app.icon)) {
    return <img src={app.icon} alt="" style={style} className={`shrink-0 rounded-[22%] object-cover ${className}`} draggable={false} />
  }
  return (
    <span
      aria-hidden="true"
      style={{ ...style, background: `linear-gradient(160deg, ${app.color}cc, ${app.color})` }}
      className={`grid shrink-0 place-items-center rounded-[22%] border border-white/25 font-bold leading-none text-white ${className}`}
    >
      {app.icon}
    </span>
  )
}
