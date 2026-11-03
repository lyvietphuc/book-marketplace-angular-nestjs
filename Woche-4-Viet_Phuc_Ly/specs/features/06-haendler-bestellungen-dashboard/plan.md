# Feature 06 – Händler: Bestellungen & Dashboard – Plan

## Ziel
- Händler sehen alle Bestellungen ihrer Shops getrennt nach **offen** und **versendet**,
  können den Status ändern und das Versandlabel drucken.
- Ein Dashboard zeigt Verkaufsstatistiken: **Umsatz pro Tag** und **Umsatz pro Buch**.

## Vorgehen
1. Backend (`/merchant`, Rolle MERCHANT):
   - `GET /merchant/orders?status=OPEN|SHIPPED`
   - `PATCH /merchant/orders/:id/status` (`OPEN` ↔ `SHIPPED`, setzt/entfernt `shippedAt`)
   - `GET /merchant/stats?days=7|30|90` → Kennzahlen, `perDay[]`, `perBook[]`
2. Frontend:
   - Seite „Bestellungen“ mit Tabs „Offen (n)“ / „Versendet (n)“, aufklappbare Bestellungen,
     Buttons „Versandlabel (PDF)“ und „Als versendet markieren“ / „Wieder öffnen“.
   - Seite „Dashboard“ mit Kennzahl-Kacheln, Säulendiagramm (Umsatz/Tag), Balkendiagramm (Top-10-Bücher)
     und Tabelle mit allen Werten.
   - Diagramme mit **ng2-charts / Chart.js**, nur im lazy geladenen Händlerbereich registriert.
3. Seed: jeder Shop erhält mindestens eine offene Bestellung von heute.

## Entscheidungen
- Statistik wird im Backend berechnet (Gruppierung pro Tag in Zeitzone Europe/Berlin); Tage ohne Umsatz erscheinen mit 0 €.
- Umsatz pro Tag = Bestellsumme inkl. Versand; Umsatz pro Buch = Summe der Positionen (ohne Versand).
- Ein Datensatz pro Diagramm → eine Farbe, keine Legende; Tooltips mit Euro-Beträgen; Tabelle zum Nachlesen.
- Offene Bestellungen werden **älteste zuerst** angezeigt (wer zuerst bestellt, wird zuerst bedient).
