Ausbesserungsbedarf:
Login-System verbessern​

Passwörter hashen und salten -> bereits implementiert, aber nicht genutzt​

AuthKey-/ Cookie-System überarbeiten (oder durch besseres System ersetzen)​

Datenbankstruktur überprüfen und ggf. anpassen:​
-Unique Nutzername (z.B. von den Computern) statt SID als Primary Key​
-Manchmal zählt erst 3 mal Aktivität x als eine Leistung -> derzeit als Stufe "0" vermerkt​
-Spezialfälle wie Camp in den Sommerferien zwischen Klasse 9 und 10 -> SEK I oder SEK II​
-Wieoft ein Wettbewerb per Schuljahr speichern​
-Klasse wiederholen -> Zwei Eintragungen für selben Wettbewerb und Klassenstufe​
-Das alles auch im Backend prüfen sowie Nutzer nur valide Auswahlmöglichkeiten geben​

Klassenstufe am Jahresende ändern und bei Eintragung für Aktivitäten prüfen​

Darstellung von Fehler- und Statusmeldungen auf allen Seiten ermöglichen​

CSS und HTML:​
-Mit Forms Input bereits im Frontend validieren (aber nicht nur!)​
-Elemente ordentlich benennen, gut strukturieren und ungenutzte entfernen​
-Nutzerfreundlich und schöner machen​
-Optimierung auf unsere Schulbildschirme (muss nicht sehr flexibel sein)​

Und mehr​

fehlende Features:
Auswertungsscript schreiben und einbinden​
-Berechnung der Stufe mit Angabe was in welchem Bereich eingebracht wird und was fehlt​

Rückgängig machen von Aktionen​
-Beim Ausfüllen der Informationen​
-Zurücknehmen der Anfragen bzw. der Validierung auf Lehrkraftseite​

Was passiert, wenn Lehrer Schule verlässt, etc.​​

Adminseite hinzufügen: ​
-neue Personen und Aktivitäten hinzufügen​
-Passwörter und personenbezogene Daten für Schüler und Lehrer ändern​
-neue Aktivitäten und Fächer sowie Leistungskategorienhinzufügen​
-Verknüpfung zwischen Aktivitäten und Leistungskategorien hinzufügen  ​
-Liste der Auswertung ausdrucken​

Und mehr

Tipps:
Nicht gleichzeitig an dem gleichen Teil einer Datei arbeiten wie wer anders​

Sprecht die Struktur "Dateienarten" ab​

Alle ähnlichen Dateien sollten selben Aufbau haben​

Trennt euch sinnvoll in Gruppen auf​
-Evtl. Je eine Gruppe für ein Feature (Backend und grobe Frontendstruktur)​
-Schön machen der UI getrennt von der Programmierung​

Versucht vllt. erst das Minimalvalueprodukt fertig zu kriegen​
-Aber vergesst dabei nicht, was noch wie angepasst werden muss​

Schreibt Kommentare/ Dokumentation​
