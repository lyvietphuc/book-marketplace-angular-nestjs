# Feature 01 – Datenmodell, Rollen & Testdaten – Plan

## Ziel
Fundament für den Marktplatz: Rollen für Benutzer, Shops gehören Händlern, Bücher haben
Preis und Bestand, Bestellungen mit Positionen. Dazu ein `RolesGuard` und realistische Testdaten.

## Vorgehen (Reihenfolge)
1. Prisma-Schema erweitern (Enums `Role`, `OrderStatus`; Modelle `User`, `Shop`, `Book`, `Order`, `OrderItem`).
2. Migration `marketplace` erzeugen. Da die DB `amazing-marketplace` nur Testdaten enthält,
   wird sie mit `prisma migrate reset` neu aufgebaut.
3. Auth erweitern: Rolle bei der Registrierung (`CUSTOMER` oder `MERCHANT`), Rolle im JWT
   und in `GET /auth/me`.
4. `@Roles(...)`-Decorator + `RolesGuard` (prüft `req.user.role`, läuft nach dem `AuthGuard`).
5. Seed-Skript mit Admin, Händlern, Shops, Büchern, Kunden und Bestellungen der letzten 30 Tage.
6. Alte Endpunkte `/books` und `/shops` an das neue Schema anpassen.

## Entscheidungen
- Eine Tabelle `User` mit Spalte `role` statt getrennter Tabellen → ein Login für alle.
- Admin kann sich nicht selbst registrieren (nur per Seed).
- Ein Buch gehört genau **einem** Shop (Angebot des Händlers). Gleiches Buch in zwei Shops = zwei Angebote.
- Geld in Cent (`Int`), Bestellungen speichern Titel/Preis als Snapshot.
- `OrderItem.bookId` ist optional (`onDelete: SetNull`) → Händler können Bücher löschen,
  alte Bestellungen bleiben vollständig.
