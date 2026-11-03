# Feature 07 – Requirements

- Nur Rolle ADMIN; Händler/Kunden → 403, ohne Token → 401.
- Übersicht: Kacheln für Händler, Kunden, Bestellungen (offen), Gesamtumsatz; Kacheln verlinken auf die Listen.
- Händlerliste: Name, E-Mail, Registrierungsdatum, Anzahl Shops/Bücher/Bestellungen, offene Bestellungen, Umsatz;
  darunter jeder Shop mit eigenen Zahlen.
- Kundenliste: Name, E-Mail, Registrierung, Anzahl Bestellungen, letzte Bestellung, Umsatz;
  aufklappbar mit allen Bestellungen (Nummer, Datum, Shop, Status, Positionen, Summe).
- Admin, der `/haendler` aufruft, wird auf `/admin` umgeleitet.
