# Feature 05 – Requirements

## Rechnung
- Kopf mit Verkäufer (Shop) und Marktplatz, Lieferadresse des Kunden
- Rechnungsnummer `RE-<Bestellnummer>`, Bestellnummer, Bestelldatum, Rechnungsdatum, Kunden-E-Mail
- Tabelle: Position, Titel/Autor, Menge, Einzelpreis, Summe
- Zwischensumme, Versand, **Gesamtbetrag**, davon MwSt. (7 %), Nettobetrag
- Hinweis „Übungsprojekt – keine echte Rechnung“

## Versandlabel
- Format 10 × 15 cm, Absender (Shop), Empfänger groß und gut lesbar, Bestellnummer in eigener Box, Anzahl Bücher

## Zugriff
- Fremde Bestellungen → 404, falsche Rolle → 403, ohne Token → 401
