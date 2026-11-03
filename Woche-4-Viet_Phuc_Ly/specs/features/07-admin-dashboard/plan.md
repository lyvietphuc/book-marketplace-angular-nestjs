# Feature 07 – Admin-Dashboard – Plan

## Ziel
Administratoren haben einen Überblick über den ganzen Marktplatz:
alle Händler (mit Shops und Umsätzen) und alle Kunden (mit ihren Bestellungen).

## Vorgehen
1. Backend-Modul `admin` (`@Roles('ADMIN')`, nur lesend):
   - `GET /admin/overview` – Anzahl Händler, Kunden, Shops, Bücher, Bestellungen (davon offen), Gesamtumsatz
   - `GET /admin/merchants` – Händler mit Shops, Anzahl Bücher/Bestellungen/offen, Umsatz (per `groupBy`)
   - `GET /admin/customers` – Kunden mit Anzahl Bestellungen, Umsatz, letzter Bestellung
   - `GET /admin/customers/:id/orders` – Bestellungen eines Kunden
2. Frontend: Adminbereich `/admin` (lazy, `roleGuard('ADMIN')`) mit Seiten Übersicht, Händler, Kunden
   (Kunde anklicken → Bestellungen klappen auf).

## Entscheidungen
- Aggregation mit `prisma.order.groupBy` statt alle Bestellungen zu laden.
- Admin hat keinen Warenkorb und keinen Händlerbereich (UI blendet aus, Backend verweigert mit 403).
