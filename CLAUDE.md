# Projekt: tobiaszwilling.me – Desktop

Persönlicher Web-Desktop unter `tobiaszwilling.me`, der alle webbasierten Programme von Tobias in Fenstern zeigt. Zweck: Portfolio für die Jobsuche (Recruiter, Beratungen) und zugleich persönlicher Starter für eigene Apps. Bedienung, Felder und Veröffentlichen stehen in `README.md`. `IDEEN.md` ist eine Ideensammlung, **kein Bauauftrag**.

Stand: 23. Oktober 2026

## Arbeitsweise

- Mit Tobias auf Deutsch, einfach und direkt. Code, Bezeichner und Schlüssel in `apps.json` auf Englisch, Code-Kommentare auf Deutsch (wie im Ursprungsprojekt).
- Nur ändern, was zur Aufgabe gehört. Ideen aus `IDEEN.md` nur auf ausdrückliche Anweisung umsetzen.
- Nach jeder Änderung `npm run build` (prüft auch Typen und `apps.json`) und im Browser ansehen, Desktop und Handybreite.
- Commit und Push nur auf Anweisung.

## Grundentscheidungen (mit Begründung)

1. **Eigenes Projekt, kopiert aus `../deutsch-desktop`.** Übernommen wurde nur die Desktop-Hülle (Fenster, Dock, Menüleiste, Handy-Homescreen, Theme). Alles Deutsch-spezifische (Lerninhalte, XP, Streaks, Preply) ist entfernt. Änderungen an der Hülle fließen **nicht** automatisch zurück; die beiden Projekte sind unabhängig.
2. **Apps werden per iframe eingebettet, nicht in den Code eingebaut.** Tobias' Projekte sind technisch verschieden (reines HTML, Vite, Next.js) und liegen auf eigenen Subdomains. So muss an den Apps nichts geändert werden, und der Desktop bleibt klein.
3. **`src/apps.json` ist die einzige Liste der Apps.** Hinzufügen und Löschen geschieht nur dort, ohne Code. Neue Felder nur einführen, wenn eine konkrete Aufgabe sie verlangt, und dann in `AppEntry` (`src/apps/registry.ts`) und in der Feldtabelle der README ergänzen.
4. **Eingebaute App** `legal` ist die einzige mit eigenem React-Code. Sie steht in `BUILTIN` in `registry.ts`; ihre ID ist für `apps.json` gesperrt. („Über mich“ am 28.10.2026 auf Tobias' Wunsch entfernt.)
5. **Zweisprachig (DE/EN).** Feste Oberflächentexte in `src/i18n.ts` (`STRINGS`), Inhalte als `Text` = `string | { de, en }`. Jeder neue sichtbare Text braucht beide Sprachen. Standard beim ersten Besuch: Browsersprache.
6. **„Privat“ ist nur Ausblenden, kein Schutz.** `apps.json` wird mit ausgeliefert. Freischalten per `?private=1`, gespeichert im localStorage. Nichts Geheimes in `apps.json`.
7. **Kein Backend, kein Tracking, keine Cookies.** Der Datenschutztext in `LegalApp.tsx` verspricht das. Wer etwas davon ändert, muss den Text mit anpassen.
8. **Hosting:** GitHub Pages über `.github/workflows/deploy.yml`, Domain `tobiaszwilling.me` (Hauptdomain, A-Einträge). Subdomains (`lernen.`, `training.`) sind eigene Repositories.

## Technische Fallstricke

- **iframes schlucken Mausereignisse.** `Window.tsx` legt deshalb beim Ziehen/Größe-Ändern und über Hintergrundfenstern eine durchsichtige Fläche über den Inhalt. Sonst ruckelt das Ziehen und ein Klick in ein Hintergrundfenster holt es nicht nach vorn.
- **Einbettung muss erlaubt sein.** Sendet eine App `X-Frame-Options` oder `frame-ancestors`, bleibt das Fenster leer. GitHub Pages sendet keins (geprüft für `lernen.` und `training.` am 23.10.2026).
- **localStorage eingebetteter Apps** funktioniert, weil alle Apps unter derselben Hauptdomain liegen (same-site). Bei Apps auf fremden Domains können Browser den Speicher im iframe abtrennen.
- **Deutsch Desktop ist selbst ein Desktop.** Eingebettet ergibt das einen Desktop im Desktop: funktioniert, wirkt verschachtelt (siehe `IDEEN.md`).

## Technik

React 19, TypeScript, Vite, Tailwind 4, framer-motion (Animationen), react-rnd (Fenster ziehen/Größe), zustand (Zustand). Paketmanager: npm.

## Verlauf

- 28.10.2026: Insider-Monitor in `apps.json` eingetragen (erste Stelle, im Dock). Neues Feld `embed: false` → App öffnet
  in neuem Tab; alle Öffnen-Knöpfe laufen über `launchApp()` in `registry.ts`. Deutsch Desktop nutzt das.
  LinkedIn in `config.ts`. Geprüft per Playwright (Desktop + Handy). Sicherung vorher: `../.sicherung-desktop-20261028/`.

## Offen

- 28.10.2026: Erster Commit gepusht nach github.com/tobzwil89/tobiaszwilling-desktop (`main` überschrieben; alte
  Portfolio-Seite vom April 2026 gesichert im Zweig `alte-website`, enthält Über-mich-Text, Profilbild, Screenshots).
- Offen: Pages-Quelle „GitHub Actions“ einstellen, Repository öffentlich?, DNS-A-Einträge für `tobiaszwilling.me`.
