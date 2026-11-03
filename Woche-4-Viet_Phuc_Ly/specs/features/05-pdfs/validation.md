# Feature 05 – Validation

- [ ] Als `anna@example.de` in „Meine Bestellungen“ → „Rechnung (PDF)“ lädt `Rechnung-AMZ-….pdf`.
- [ ] Rechnung: Summen stimmen mit der Bestellung überein (z. B. 17,98 € + 2,99 € = 20,97 €, MwSt. 1,37 €).
- [ ] `ben@example.de` ruft Annas Rechnung per `curl` ab → 404.
- [ ] Händler Siegen: `GET /merchant/orders/<id>/label` einer Siegener Bestellung → PDF mit Annas Adresse.
- [ ] Händler Köln: gleiche Bestellung → 404.
