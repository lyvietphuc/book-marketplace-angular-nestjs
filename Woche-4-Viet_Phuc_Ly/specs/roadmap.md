# Roadmap – "Amazing" Marktplatz

Jede Phase ist ein eigenes Feature und durchläuft den SDD-Zyklus
**Plan → Implement → Validate** (Spec unter `specs/features/<nr>-<name>/`
mit `plan.md`, `requirements.md`, `validation.md`). Nach jeder Phase: Diff lesen,
testen, committen, ggf. Roadmap anpassen (Replanning).

| Phase | Feature | Ergebnis | Status |
|---|---|---|---|
| 0 | Setup & Constitution | Ordner `Woche-4`, eigene DB, `mission.md`, `tech-stack.md`, `roadmap.md` | ✅ |
| 1 | Datenmodell, Rollen & Testdaten | Prisma-Schema (Rollen, Shop-Besitzer, Preis/Bestand, Bestellungen), `RolesGuard`, Seed | ✅ |
| 2 | Katalog & Suche | Öffentliche Buchsuche mit Filter/Sortierung, Buchdetailseite | ✅ |
| 3 | Händler: Shops & Bücher verwalten | CRUD für eigene Shops und Bücher | ✅ |
| 4 | Warenkorb & Checkout | Warenkorb, Lieferadresse, Bestellung (pro Shop), Bestellhistorie | ✅ |
| 5 | PDFs | Rechnung (Kunde) und Versandlabel (Händler) | ✅ |
| 6 | Händler: Bestellungen & Dashboard | Bestellübersicht offen/versendet, Umsatz pro Buch/Tag mit Diagrammen | ✅ |
| 7 | Admin-Dashboard | Übersicht Händler, Kunden und Bestellungen | ✅ |
| 8 | UI-Politur & Abgabe | Einheitliches Layout, Screenshots, README | ✅ |

## Replanning-Notizen (Änderungen während der Umsetzung)
- **Phase 1:** Die Migration wurde von Hand geschrieben, weil die Prisma-Engine in der
  Entwicklungsumgebung nicht verfügbar war. Prüfung: `npx prisma migrate dev` darf danach **keine** neue Migration erzeugen (kein Drift).
- **Phase 2:** Schriften (Roboto, Material Icons) per npm statt Google Fonts eingebunden → App funktioniert offline.
- **Phase 2:** Händler- und Adminbereich werden per **Lazy Loading** geladen (kleineres Start-Bundle).
- **Phase 4:** Warenkorb ist auch für Gäste nutzbar; Login wird erst an der Kasse verlangt.
- **Phase 5:** Der Button für das Versandlabel wurde in Phase 6 verschoben, weil er auf die
  Händler-Bestellübersicht gehört; der Endpunkt entstand bereits in Phase 5.
- **Phase 6:** Seed erweitert: jeder Shop hat mindestens eine offene Bestellung von heute,
  damit die Bestellabwicklung sofort testbar ist.
- **Phase 8:** Suchfeld in der Toolbar zeigt den aktuellen Suchbegriff aus der URL.

## Backlog / Ideen (nicht geplant)
- Händler-Freigabe durch Admin
- Bewertungen, Wunschliste
- HttpOnly-Cookies statt `localStorage` für das Token
