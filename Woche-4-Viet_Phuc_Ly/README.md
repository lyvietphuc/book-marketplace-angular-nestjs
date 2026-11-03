# Woche 4 – „Amazing“ Marktplatz

Bücher-Marktplatz mit drei Rollen (Kunde, Händler, Administrator), entwickelt mit
**Spec-Driven Development (SDD)**. Baut auf der Anwendung aus Woche 1–3 auf
(Angular + NestJS + Prisma + PostgreSQL, Login mit JWT).

## Ordnerstruktur

```
Woche-4-Viet_Phuc_Ly/
├── specs/                     ← SDD-Dokumente (Teil der Abgabe)
│   ├── mission.md             ← Warum? Für wen? Umfang
│   ├── tech-stack.md          ← Womit? Konventionen
│   ├── roadmap.md             ← Was in welcher Reihenfolge? (+ Replanning-Notizen)
│   └── features/<nr>-<name>/  ← pro Feature: plan.md, requirements.md, validation.md
├── backend/                   ← NestJS-API (Port 3000)
├── frontend/                  ← Angular-App (Port 4200)
└── Screenshots/               ← Bilder vom Marktplatz
```

## Starten

Voraussetzung: PostgreSQL läuft lokal, `backend/.env` enthält `DATABASE_URL` (Datenbank
`amazing-marketplace`) und `JWT_SECRET` – siehe `backend/.env.example`.

```bash
# Backend
cd backend
npm install
npx prisma migrate reset     # DB neu aufbauen – löscht alle Daten!
npx prisma generate          # Prisma Client erzeugen (Prisma 7 macht das nicht mehr automatisch)
npx prisma db seed           # Testdaten laden
npm run start:dev

# Frontend (zweites Terminal)
cd frontend
npm install
npm start                    # http://localhost:4200
```

Testdaten erneut laden (ohne Migration): `npx prisma db seed`.

## Testkonten (nur Entwicklung)

Passwort für alle Konten: **`Passwort123!`**

| Rolle | E-Mail | Besonderheit |
|---|---|---|
| Administrator | `admin@amazing.de` | nur über Seed anlegbar |
| Händler | `haendler.siegen@amazing.de` | 2 Shops (Siegener Bücherstube, Antiquariat am Schloss) |
| Händler | `haendler.koeln@amazing.de` | Kölner Lesezeichen (Informatik) |
| Händler | `haendler.frankfurt@amazing.de` | Mainufer Bücher |
| Kunde | `anna@example.de`, `ben@example.de`, `clara@example.de`, `david@example.de` | Bestellungen der letzten 30 Tage |

## Funktionen

| Bereich | Funktion | Wo? |
|---|---|---|
| Kunde | Buchsuche (Titel, Autor, ISBN) mit Filtern, Sortierung, Paginierung | `/` |
| Kunde | Warenkorb (auch als Gast), Checkout mit Lieferadresse, Aufteilung pro Shop | `/warenkorb`, `/kasse` |
| Kunde | Bestellhistorie, Rechnung als PDF | `/bestellungen` |
| Händler | Shops anlegen/bearbeiten, Bücher mit Preis/Bestand verwalten | `/haendler/shops`, `/haendler/buecher` |
| Händler | Bestellungen offen/versendet, Status ändern, Versandlabel als PDF | `/haendler/bestellungen` |
| Händler | Dashboard: Umsatz pro Tag und pro Buch (7/30/90 Tage) | `/haendler/dashboard` |
| Admin | Übersicht, alle Händler mit Shops/Umsätzen, alle Kunden mit Bestellungen | `/admin` |

## Sicherheit / Rollen

- Backend: `AuthGuard` (JWT prüfen → sonst **401**) + `RolesGuard` mit `@Roles(...)` (falsche Rolle → **403**).
- Händler sehen und ändern nur Daten ihrer eigenen Shops (fremde IDs → **404**).
- Checkout rechnet immer mit Preisen und Bestand **aus der Datenbank**, in einer Transaktion (kein Überverkauf).
- Frontend: Route Guards und ausgeblendete Menüs pro Rolle (nur UX – geschützt wird im Backend).
- Passwörter mit bcrypt gehasht, JWT enthält nur `sub` und `role`.

## SDD-Vorgehen

1. **Constitution** schreiben: `mission.md`, `tech-stack.md`, `roadmap.md` (Phase 0).
2. Für jede Roadmap-Phase den Zyklus **Plan → Implement → Validate**:
   Spec (`plan.md`, `requirements.md`, `validation.md`) → Umsetzung → Prüfung anhand `validation.md` → Commit.
3. **Replanning** zwischen den Phasen (siehe Abschnitt in `roadmap.md`).

Jede Phase ist ein eigener Commit („Woche 4 Phase N: …“).
