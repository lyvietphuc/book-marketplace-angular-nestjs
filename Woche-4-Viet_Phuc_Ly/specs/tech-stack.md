# Tech-Stack – "Amazing" Marktplatz

## Überblick
```
Angular (Frontend, Port 4200)  --HTTP/JSON + JWT-->  NestJS (Backend, Port 3000)  --Prisma-->  PostgreSQL
```

## Frontend – `frontend/`
- **Angular 21** (Standalone Components, Signals, neue Control-Flow-Syntax `@if/@for`)
- **Angular Material 21** für ein einheitliches, professionelles UI
- **Reactive Forms** für Formulare und Validierung
- **ng2-charts / Chart.js** für Diagramme im Händler-Dashboard
- Auth: `AuthService`, funktionaler `HttpInterceptor` (Bearer-Token), Route Guards pro Rolle
- Warenkorb: clientseitig (Signal + `localStorage`); Preise und Bestand werden beim Checkout
  **immer im Backend** neu geprüft

## Backend – `backend/`
- **NestJS 12** (Module, Controller, Services, Guards, `ValidationPipe` mit `class-validator`)
- **Prisma 7** mit `@prisma/adapter-pg` als ORM
- **PostgreSQL** (lokale Datenbank `amazing-marketplace`)
- **Auth:** `bcrypt` (Passwort-Hashing), `@nestjs/jwt` (Token, 1 h gültig)
- **Autorisierung:** `AuthGuard` (Token prüfen) + `RolesGuard` mit `@Roles(...)`-Decorator
- **PDF:** `pdfkit` erzeugt Rechnung und Versandlabel serverseitig (Download-Endpunkte)

## Konventionen
- **Geldbeträge** als ganze Zahlen in **Cent** (`priceCents`), nie als Float → keine Rundungsfehler
- **Bestellnummer** im Format `AMZ-JJJJ-NNNNNN`
- In Bestellungen werden Titel und Preis als **Snapshot** gespeichert (spätere Preisänderungen
  verändern alte Rechnungen nicht)
- Bücher sind in Deutschland mit **7 % MwSt.** belegt; Preise sind Bruttopreise, die Rechnung
  weist die enthaltene MwSt. aus
- API-Fehlermeldungen auf Deutsch, Code und Kommentare auf Deutsch/Englisch
- Secrets nur in `.env` (nicht im Git), Beispielwerte in `.env.example`

## Lokale Entwicklung
```bash
# Backend
cd backend && npm install && npx prisma migrate dev && npx prisma db seed && npm run start:dev
# Frontend
cd frontend && npm install && npm start
```

## Tests / Validierung
- Backend: `npm run build`, manuelle API-Tests mit `curl`
- Frontend: `ng build` / Angular-Compiler, manuelle Tests im Browser pro Rolle
- Jede Feature-Spezifikation enthält eine `validation.md` mit konkreten Prüfschritten
