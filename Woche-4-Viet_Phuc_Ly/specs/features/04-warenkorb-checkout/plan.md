# Feature 04 – Warenkorb & Checkout – Plan

## Ziel
Kunden legen Bücher in einen Warenkorb, geben eine Lieferadresse an und bestellen
(ohne Bezahlung). Danach sehen sie ihre Bestellhistorie.

## Vorgehen
1. Backend-Modul `orders` (`@Roles('CUSTOMER')`):
   - `POST /orders` – Checkout in **einer** Transaktion: Bücher laden, Bestand atomar reduzieren,
     pro Shop eine Bestellung mit Snapshot-Positionen anlegen, Bestellnummer `AMZ-JJJJ-<ID>` vergeben.
   - `GET /orders/mine`, `GET /orders/:id` – nur eigene Bestellungen.
2. Frontend:
   - `CartService` (Signals + `localStorage`), Warenkorb gruppiert nach Shop inkl. Versandkosten.
   - Button „In den Warenkorb“ in Suche, Detailseite und Shop-Seite (nicht für Händler/Admin).
   - Seiten `/warenkorb`, `/kasse` (Lieferadresse), `/bestellungen` (Historie mit Dankesmeldung).
   - Gäste dürfen den Warenkorb füllen; an der Kasse kommt der Login, danach geht es zurück zur Kasse.

## Entscheidungen
- **Preise kommen beim Checkout immer aus der Datenbank**, nicht aus dem Browser (sonst könnte man Preise manipulieren).
- Bestand wird mit `updateMany(where: stock >= menge)` reduziert → kein Überverkauf, auch bei gleichzeitigen Bestellungen.
- Schlägt eine Position fehl, wird die ganze Transaktion zurückgerollt.
- Versand: 2,99 € pro Shop, ab 20 € Warenwert kostenlos.
