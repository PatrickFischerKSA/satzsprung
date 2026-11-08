# Satzsprung

Ein deutschsprachiges Browser-Lernspiel. Auf einer beschädigten Orbitalstation lassen sich Grammatikregeln als Schalterstellungen, Frachtschilder und Flugmanöver ausprobieren.

**Lokal spielen** · `index.html` direkt im Browser öffnen. Das Spiel benötigt keine Installation und funktioniert offline.

**GitHub Pages** · Den Inhalt dieses Ordners in ein GitHub-Repository übernehmen. Unter **Settings → Pages** den Branch auswählen, der die Dateien enthält, und als Ordner **/ (root)** setzen. Alle Assets verwenden relative Pfade.

## Stationen

- **Zeitmaschine** · Sechs Indikativzeiten, jeweils in Aktiv, Vorgangspassiv und Zustandspassiv. Die Schalter verändern den Funkspruch und die Ansicht des Schiffs.
- **Formlabor** · Beispiele zu Konjunktiv I und II, Imperativ, Infinitiven, Partizipien, Stammwechsel und Hilfsverbwahl.
- **Frachtkammer** · Alle vier Fälle, drei Genera und Plural, starke, schwache und gemischte Adjektivflexion sowie ausgewählte Nomenflexionen.
- **Raumschleuse** · Alle neun Wechselpräpositionen sowie Beispiele für Präpositionen mit festem Kasus und für verschiedene Bedeutungsbeziehungen.

Alle Stationen sind frei anwählbar. Richtige Lösungen bleiben lokal im Browser gespeichert. Bei Fehlern zeigt das Spiel, welche Schalter oder Kartenfelder überprüft werden sollen. Hinweise und Erklärungen ergänzen die Manöver.

Die Missionen stehen in `missions.js`. Darstellung und Interaktion sind in `style.css` und `game.js` getrennt.
