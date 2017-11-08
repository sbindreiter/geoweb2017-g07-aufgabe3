# geoweb2017-g07-aufgabe3
geoweb2017

Anleitung (für Windows) um das Projekt geoweb2017-g07-aufgabe3
in einem Openlayer-Workspace anzusehen.

0. Installation des Openlayer-Workspaces und anlegen eines Git-Hub Accounts,
   sowie Installation von Git (kann übersprungen werden, wenn bereits vorhanden):
   - Ansonsten openlayers-workshop-en.zip herunterladen und extrahieren
     Download unter: https://github.com/openlayers/workshop/releases/tag/v4.3.1.en.3
   - Falls node.js nicht installiert ist: Node herunterladen und installieren
     Download unter: https://nodejs.org
   - Auf https://github.com/ einen User-Account anlegen
   - Git herunterladen und installieren
     Download unter: https://desktop.github.com/ und youtube-Tutorial ansehen (https://www.youtube.com/watch?v=0fKg7e37bQE)

1. Openlayer-Workspace installieren und einrichten:
   - Eingabeaufforderung (cmd-window) starten (Windows-Start Button und cmd eintippen)
   - im cmd-window mit 'cd' ins extrahierte "openlayers-workshop-en"-Verzeichnis wechseln
   - dort den Befehl 'npm install' ausführen (installiert alle packages für openlayer)
   - danach den Befehl 'npm start' ausführen (startet server)
2. Git Project Clonen und von Dateien von Server holen:
   - In einer neuen Eingabeaufforderung in das gewünschte Zielverzeichnis wechseln
   - Den Befehl 'git clone https://github.com/sbindreiter/geoweb2017-g07-aufgabe3.git'
     ausführen, um das Projekt auf die Lokale Festplatte zu ziehen.
   - Die enthaltenen Dateien index.html, main.js, package.json, webpack.config.js müssen in den Openlayer-Workspace
     (siehe Schritt 0) kopiert werden. Die Datei map.geojson im Unterverzeichnis data muss auch im Openlayer-Workspace ins Unterverzeichnis 'data' kopiert werden.
3. Testen der Web-Karte im Browser:
   - Internet-Browser starten
   - localhost:3000 in die Adressleiste eingeben

Info: Eine Übersicht der wichtigsten Git-Befehle finden Sie in der Datei 'github_befehle.txt'
