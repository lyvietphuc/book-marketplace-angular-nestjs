# Feature 04 – Requirements

- Warenkorb: Menge ändern (1 … Bestand, max. 20), entfernen, Summe, Versand, Gesamt, Hinweis auf Aufteilung pro Shop.
- Warenkorb bleibt nach Neuladen der Seite erhalten.
- Kasse nur für Rolle CUSTOMER; Gäste → Login → zurück zur Kasse.
- Lieferadresse: Name, Straße + Hausnummer, PLZ (5 Ziffern), Ort, Land (Deutschland).
- Fehlerfälle:
  - leerer Warenkorb / ungültige Adresse → 400 mit verständlicher Meldung
  - Bestand reicht nicht → 409 „„Titel“: nur noch X Stück auf Lager.“
  - Händler/Admin bestellt → 403
- Nach erfolgreicher Bestellung: Warenkorb leer, Weiterleitung zu „Meine Bestellungen“ mit Bestellnummer(n).
- Bestellhistorie: Bestellnummer, Datum, Shop, Status (Offen/Versendet), Positionen, Summen, Lieferadresse.
