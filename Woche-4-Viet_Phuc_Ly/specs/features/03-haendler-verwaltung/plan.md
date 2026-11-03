# Feature 03 – Händler: Shops & Bücher verwalten – Plan

## Ziel
Händler verwalten ihre eigenen Shops und bieten darin Bücher mit Preis und Bestand an.

## Vorgehen
1. Backend-Modul `merchant` mit `@Roles('MERCHANT')` auf dem ganzen Controller.
2. DTOs mit `class-validator` (Shop: Name, Stadt, Beschreibung; Buch: Shop, Titel, Autor, ISBN, Preis in Cent, Bestand, sichtbar).
3. Service filtert **jede** Abfrage nach `ownerId` des eingeloggten Händlers.
4. Frontend: Händlerbereich `/haendler` (Lazy Loading) mit Seitennavigation,
   Tabelle „Meine Bücher“ (Filter, Bearbeiten, Löschen), Karten „Meine Shops“, Formulare als Dialoge.
5. `roleGuard('MERCHANT')` für die Routen, Menüeinträge nur für Händler.

## Entscheidungen
- Fremde Shop-/Buch-IDs liefern **404** statt 403 → man kann nicht erraten, welche IDs existieren.
- Preis wird im Formular in Euro eingegeben („12,99“) und als Cent an das Backend geschickt.
- Löschen eines Buchs ist erlaubt: Bestellpositionen behalten ihren Snapshot (`bookId` → `null`).
- „Ausblenden“ (`published = false`) als Alternative zum Löschen.
