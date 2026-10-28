# tobiaszwilling.me – Desktop

Persönlicher Web-Desktop: Fenster, Dock, Menüleiste, auf dem Handy ein Homescreen. Jede App ist eine eigene Webseite und wird im Fenster angezeigt (iframe). Oberfläche auf Deutsch und Englisch, umschaltbar oben rechts.

Grundgerüst übernommen aus `deutsch-desktop`.

## Lokal starten

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install        # einmalig
npm run dev        # Entwicklungsserver, http://localhost:5173
npm run build      # Produktionsversion nach dist/ (prüft auch apps.json auf Tippfehler)
```

## App hinzufügen

Einen Eintrag in `src/apps.json` ergänzen. Mehr ist nicht nötig.

```json
{
  "id": "flugpass",
  "title": "Flugpass",
  "description": { "de": "Was die App macht.", "en": "What the app does." },
  "url": "https://flugpass.tobiaszwilling.me",
  "source": "https://github.com/tobzwil89/flugpass",
  "tech": ["Python", "HTML"],
  "icon": "✈️",
  "color": "#0ea5e9",
  "size": { "w": 900, "h": 650 },
  "dock": true,
  "private": false
}
```

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `id` | ja | Eindeutiger Kurzname, nur Kleinbuchstaben. Nicht `legal` (die gibt es schon). |
| `title` | ja | Name. Entweder `"Text"` (gleich in beiden Sprachen) oder `{ "de": "…", "en": "…" }`. |
| `icon` | ja | Emoji (`"✈️"`), Buchstabe (`"F"`) oder Bild aus `public/` (`"/icons/flugpass.png"`). |
| `description` | nein | Kurzbeschreibung für den Steckbrief (ⓘ-Knopf). Wie `title` ein- oder zweisprachig. |
| `url` | nein | Adresse der App. **Ohne** `url` zeigt das Fenster nur den Steckbrief mit „In Arbeit“. |
| `source` | nein | Link zum Quellcode. |
| `tech` | nein | Technik-Schlagworte als Liste. |
| `color` | nein | Hintergrundfarbe des Icons. |
| `size` | nein | Startgröße des Fensters in Pixeln. Standard 960 × 680. |
| `dock` | nein | `true` = auch im Dock (und in der Handy-Leiste unten). |
| `private` | nein | `true` = ausgeblendet, siehe unten. |
| `embed` | nein | `false` = App öffnet in neuem Tab statt im Fenster (nur mit `url`). Für Apps, die selbst ein Desktop sind oder sich nicht einbetten lassen. |

Reihenfolge in der Datei = Reihenfolge auf dem Desktop.

## App löschen

Den Eintrag aus `src/apps.json` entfernen. Achtung auf die Kommas: Nach dem letzten Eintrag steht keins. `npm run build` meldet Fehler sofort.

## Private Apps

Einträge mit `"private": true` sind normal unsichtbar. Einmal `tobiaszwilling.me/?private=1` aufrufen, dann sieht dieser Browser sie dauerhaft. `?private=0` blendet sie wieder aus.

**Das ist kein Schutz.** `apps.json` ist Teil der öffentlichen Seite, jeder kann die Einträge im Quelltext lesen. Es ist nur zum Aufräumen gedacht. Was geheim bleiben muss, gehört nicht in diese Datei.

## Voraussetzung für eingebettete Apps

Eine App lässt sich nur einbetten, wenn sie das erlaubt. Seiten auf GitHub Pages tun das. Blockiert eine App die Einbettung (Header `X-Frame-Options` oder `Content-Security-Policy: frame-ancestors`), bleibt das Fenster leer. Dann den ↗-Knopf nutzen oder bei der App `frame-ancestors https://tobiaszwilling.me` erlauben.

## Texte anpassen

| Was | Wo |
|---|---|
| Name, E-Mail | `src/config.ts` |
| Impressum, Datenschutz | `src/config.ts` (`IMPRINT`) und `src/apps/LegalApp.tsx` |
| Feste Oberflächentexte (DE/EN) | `src/i18n.ts` |

## Projektaufbau

```
src/
  apps.json            Liste aller Apps – die einzige Datei, die man im Alltag anfasst
  config.ts            Name, Kontakt, Links, Foto, Impressumsdaten
  i18n.ts              Sprachen (DE/EN): feste Oberflächentexte und Hilfsfunktionen
  App.tsx              Einstieg: wählt Desktop- oder Handy-Ansicht, zeigt den Startbildschirm
  apps/
    registry.ts        Liest apps.json, ergänzt Standardwerte, fügt die eingebauten Apps hinzu
    AppContent.tsx     Entscheidet, was im Fenster steht: eingebaute App oder Webseite
    WebApp.tsx         Webseite im iframe plus Projektsteckbrief (ⓘ)
    AppIcon.tsx        Icon aus Emoji/Buchstabe auf Farbkachel oder aus Bilddatei
    LegalApp.tsx       Eingebaute App „Rechtliches“ (Impressum, Datenschutz)
    ui.tsx             Umschalter (Segmented) für die eingebauten Apps
  shell/               Die Desktop-Oberfläche, unabhängig von einzelnen Apps
    DesktopShell.tsx   Desktop: Hintergrund, Menüleiste, Icons, Fenster, Dock
    Window.tsx         Ein Fenster: ziehen, Größe ändern, minimieren, maximieren
    Dock.tsx           Dock mit Vergrößerungseffekt (Apps mit "dock": true)
    DesktopIcons.tsx   Icons rechts auf dem Desktop (Doppelklick öffnet)
    MenuBar.tsx        Menüleiste: Logo-Menü, Sprache, Hell/Dunkel, Uhr
    MobileShell.tsx    Handy: Homescreen mit Icon-Raster, Apps im Vollbild
    BootScreen.tsx     Startbildschirm (überspringbar)
    uiStore.ts         Zustand: offene Fenster, Positionen, Theme, Sprache, private Apps
    Wallpaper.tsx, Spinner.tsx
  lib/hooks.ts         Kleine Helfer: Handy erkennen, Dunkelmodus, Uhr
public/                Dateien, die unverändert ausgeliefert werden (Favicon, CNAME, eigene Icons)
.github/workflows/     Automatisches Veröffentlichen auf GitHub Pages
```

Im Browser gespeichert (localStorage, Schlüssel `tz-desktop-ui`): Theme, Sprache, Fensterpositionen und ob private Apps sichtbar sind. Welche Fenster offen sind, wird nicht gespeichert.

Weitere Unterlagen: `CLAUDE.md` (Entscheidungen und Regeln für die Arbeit am Code), `IDEEN.md` (Ideen und offene Punkte, kein Bauauftrag).

## Veröffentlichen auf GitHub Pages

Bei jedem Push auf `main` baut GitHub Actions die Seite (`.github/workflows/deploy.yml`).

1. Auf github.com ein **öffentliches**, leeres Repository `tobiaszwilling-desktop` unter `tobzwil89` anlegen.
2. Im Projektordner:
   ```bash
   git add -A && git commit -m "Erste Version"
   git remote add origin https://github.com/tobzwil89/tobiaszwilling-desktop.git
   git push -u origin main
   ```
3. Im Repository: **Settings → Pages → Source: „GitHub Actions“**.
4. Beim Domain-Anbieter für `tobiaszwilling.me` (die Hauptdomain, kein CNAME möglich) vier **A-Einträge** anlegen:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   Optional: `CNAME` `www` → `tobzwil89.github.io`.
5. **Settings → Pages → Custom domain:** `tobiaszwilling.me` eintragen. Sobald das Zertifikat da ist (bis zu 24 h), **„Enforce HTTPS“** anhaken.

Die Subdomains `lernen.` und `training.` laufen unabhängig davon weiter.
