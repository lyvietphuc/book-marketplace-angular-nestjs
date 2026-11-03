# Feature 02 – Katalog & Suche – Plan

## Ziel
Kundinnen und Kunden (auch ohne Login) finden Bücher schnell: Suche nach Titel, Autor oder ISBN,
Filter, Sortierung, Detailseite und Shop-Seiten. Neues, professionelles Layout für die ganze App.

## Vorgehen
1. Backend: `GET /books` mit Query-Parametern (`q`, `shopId`, `minPrice`, `maxPrice`, `inStock`, `sort`, `page`, `pageSize`)
   und Paginierung `{ items, total, page, pageSize }`; `GET /books/:id`; `GET /shops`, `GET /shops/:id`.
2. Frontend-Grundgerüst: Toolbar mit Logo, Suchfeld und Benutzermenü, Footer, Theme, lokale Schriften.
3. `CatalogService`, `EuroPipe` (Cent → „19,99 €“), `BookCover` (generiertes Cover, falls keine `coverUrl`).
4. Seiten: Katalog (Startseite) mit Filterleiste, Buchdetail, Shop-Liste, Shop-Detail.
5. Registrierung mit Auswahl Kunde/Händler; nach dem Login Weiterleitung je nach Rolle.

## Entscheidungen
- Filter stehen in der **URL** (`/?q=kafka&sort=price_asc`) → Ergebnisse sind verlinkbar, Zurück-Button funktioniert.
- Paginierung im Backend (nicht alle Bücher auf einmal laden).
- Schriften (Roboto, Material Icons) per npm statt Google Fonts → funktioniert auch offline.
