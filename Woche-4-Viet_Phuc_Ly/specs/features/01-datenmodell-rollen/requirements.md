# Feature 01 – Requirements

## Datenmodell
- `User`: `id`, `email` (unique), `passwordHash`, `name?`, `role` (`CUSTOMER` | `MERCHANT` | `ADMIN`, Default `CUSTOMER`)
- `Shop`: `id`, `name` (unique), `city`, `description?`, `ownerId` → `User` (Händler)
- `Book`: `id`, `title`, `author`, `isbn?`, `description?`, `coverUrl?`, `priceCents`, `stock`, `published`, `shopId`
- `Order`: `id`, `orderNumber` (unique, `AMZ-JJJJ-NNNNNN`), `checkoutId`, `customerId`, `shopId`,
  `status` (`OPEN` | `SHIPPED`), Lieferadresse (Name, Straße, PLZ, Ort, Land),
  `subtotalCents`, `shippingCents`, `totalCents`, `createdAt`, `shippedAt?`
- `OrderItem`: `orderId`, `bookId?`, `title`, `author`, `unitPriceCents`, `quantity`, `lineTotalCents`

## Auth & Rollen
- `POST /auth/register` akzeptiert optional `role` = `CUSTOMER` | `MERCHANT`; `ADMIN` wird mit 400 abgelehnt.
- JWT-Payload: `{ sub, role }` – weiterhin keine sensiblen Daten.
- `GET /auth/me` liefert zusätzlich `role`.
- `RolesGuard`: falsche Rolle → **403 Forbidden**; kein/ungültiges Token → **401**.

## Testdaten (Seed)
- 1 Admin, 3 Händler, 4 Shops, ≥ 24 Bücher mit Preisen/Bestand, 4 Kunden
- Bestellungen der letzten 30 Tage (offen und versendet), damit Dashboards Daten zeigen
- Alle Testkonten haben das Passwort `Passwort123!` (nur Testdaten, in README dokumentiert)
