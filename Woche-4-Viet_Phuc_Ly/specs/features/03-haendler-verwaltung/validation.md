# Feature 03 – Validation

- [ ] Login als `haendler.siegen@amazing.de` → Weiterleitung nach `/haendler/buecher`, 13 Bücher aus 2 Shops.
- [ ] „Buch anbieten“ ohne Eingaben → Fehlermeldungen an Titel, Autor, Preis.
- [ ] Neues Buch „Die Physiker“, 9,90 €, Bestand 7 → erscheint in der Tabelle und in der öffentlichen Suche.
- [ ] Buch ausblenden → verschwindet aus der Suche, bleibt in „Meine Bücher“.
- [ ] Shop mit Namen „Kölner Lesezeichen“ anlegen → Fehlermeldung „existiert bereits“ (409).
- [ ] Mit Kunden-Token: `curl localhost:3000/merchant/shops` → 403; ohne Token → 401.
- [ ] Händler Köln versucht, ein Buch in einem Siegener Shop anzulegen → 404.
- [ ] Login als Kunde und Aufruf von `/haendler` → Umleitung zur Startseite.
