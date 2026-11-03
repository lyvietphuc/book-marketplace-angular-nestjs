# Feature 02 – Requirements

- Suche ist ohne Login nutzbar und findet Treffer in Titel, Autor und ISBN (Groß-/Kleinschreibung egal).
- Es werden nur veröffentlichte Bücher (`published = true`) angezeigt.
- Sortierung: Empfehlung, Preis auf-/absteigend, Neueste, Titel A–Z.
- Filter: Shop, Preisbereich (in €), „nur verfügbare Bücher“ (Bestand > 0).
- Paginierung: 12 Bücher pro Seite, deutsche Beschriftung.
- Buchkarte zeigt Cover, Titel, Autor, Shop, Preis und Verfügbarkeit („Nur noch 2 auf Lager“).
- Detailseite zeigt Beschreibung, ISBN, Verkäufer, Preis inkl. MwSt.-Hinweis.
- Registrierung: Auswahl „Kaufen (Kunde)“ oder „Verkaufen (Händler)“.
- Nach dem Login: Kunde → Startseite, Händler → `/haendler`, Admin → `/admin`.
