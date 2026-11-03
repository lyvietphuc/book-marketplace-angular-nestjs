# Feature 03 – Requirements

## API (nur Rolle MERCHANT, sonst 401/403)
| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/merchant/shops` | eigene Shops inkl. Anzahl Bücher und offene Bestellungen |
| POST | `/merchant/shops` | Shop anlegen (Name eindeutig → sonst 409) |
| PATCH | `/merchant/shops/:id` | eigenen Shop bearbeiten |
| GET | `/merchant/books` | eigene Bücher (alle Shops) |
| POST | `/merchant/books` | Buch in eigenem Shop anlegen |
| PATCH | `/merchant/books/:id` | eigenes Buch bearbeiten |
| DELETE | `/merchant/books/:id` | eigenes Buch löschen |

## Validierung
- Titel/Autor Pflicht, Preis > 0, Bestand ≥ 0, ISBN 10 oder 13 Ziffern, Cover-URL gültig.
- Fehler werden im Dialog angezeigt, Erfolg als Snackbar.

## UI
- Händler sehen „Händlerbereich“ in der Toolbar; Kunden/Admins nicht.
- Kunden, die `/haendler` aufrufen, werden zur Startseite umgeleitet.
