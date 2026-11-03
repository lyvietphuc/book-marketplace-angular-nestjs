# Feature 04 – Validation

- [ ] Als Gast „Der Process“ und „Clean Code“ in den Warenkorb → 2 Gruppen (Siegen, Köln), Badge zeigt 2.
- [ ] Menge „Der Process“ auf 2 → Summe 17,98 €, Versand Siegen 2,99 €, Köln kostenlos.
- [ ] „Zur Kasse“ → Login → zurück auf `/kasse`.
- [ ] „Jetzt bestellen“ ohne Adresse → Fehlermeldungen an den Feldern.
- [ ] Bestellung absenden → 2 neue Bestellungen `AMZ-…`, Warenkorb leer, Bestand in der DB reduziert.
- [ ] `curl` mit Menge > Bestand → 409, Bestand bleibt unverändert (Rollback).
- [ ] Händler-Token auf `POST /orders` → 403.
