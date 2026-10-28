# Ideensammlung: tobiaszwilling.me – Desktop

> **Hinweis für Claude Code:** Diese Datei ist eine Ideensammlung, **kein Bauauftrag**. Nichts hiervon ohne ausdrückliche Anweisung umsetzen. Verbindlich für den Code sind `CLAUDE.md` und die Aufträge im Chat.

Stand: 23. Oktober 2026

---

## 1. Offene Punkte nach dem ersten Bau

- [ ] Texte „Über mich“ füllen (`TAGLINE`, `INTRO` oben in `src/apps/AboutApp.tsx`) und Foto in `src/config.ts` (LinkedIn ist seit 28.10.2026 eingetragen)
- [ ] Ersten Commit machen, Repository `tobiaszwilling-desktop` auf GitHub anlegen, pushen
- [ ] DNS: vier A-Einträge für `tobiaszwilling.me` (Schritte in `README.md`), danach HTTPS erzwingen
- [ ] Impressum und Datenschutz gegenlesen (übernommen und angepasst aus `deutsch-desktop`)
- [ ] Roleplay: `url` in `apps.json` eintragen, sobald `roleplay.tobiaszwilling.me` online ist
- [ ] Training: als Beispiel für eine private App eingetragen. Behalten oder löschen?
- [x] Insider-Monitor eingetragen (28.10.2026)
- [ ] Weitere Projekte eintragen (Flugpass, StockPulse, Steuer Wrapped, BizPraktika …), sofern online

---

## 2. Ideen, nach Nutzen für die Jobsuche sortiert

1. **Steckbrief als Mini-Fallstudie:** Problem → Lösung → Ergebnis, möglichst mit einer Zahl. Genau das Format, das Beratungen sehen wollen. Größter Nutzen, vor allem Schreibarbeit (neue Felder in `apps.json`).
2. **Direktlinks:** `tobiaszwilling.me/?app=deutsch` öffnet die App sofort. In Bewerbungen gezielt auf ein Projekt verlinken. Etwa zehn Zeilen Code.
3. **Projekte ohne Web-Oberfläche zeigen:** Insider-Tracker, Strategie-Labor, StockPulse als Steckbrief mit Screenshot oder Beispielbericht. Das sind die stärksten Analyse-Projekte, bisher unsichtbar.
4. **Lebenslauf als Fenster** mit PDF zum Herunterladen.
5. ~~**Feld `"embed": false`**~~ – umgesetzt am 28.10.2026.

## 3. Zur Diskussion

- **Startbildschirm streichen oder nur beim ersten Besuch zeigen.** Recruiter entscheiden in Sekunden; 1,2 Sekunden Ladebalken sind für sie reine Wartezeit. Bisher unverändert aus `deutsch-desktop` übernommen.
