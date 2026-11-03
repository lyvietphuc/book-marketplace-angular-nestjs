# Mission – "Amazing" Marktplatz

## Warum gibt es dieses Projekt?
"Amazing" ist ein Online-Marktplatz für Bücher. Unabhängige Buchhandlungen (Händler)
bekommen eine einfache Möglichkeit, ihre Bücher online zu verkaufen, ohne einen
eigenen Webshop betreiben zu müssen. Kundinnen und Kunden finden an einem Ort Bücher
aus vielen Shops und bestellen sie mit einem gemeinsamen Warenkorb.

Das Projekt entsteht im Programmierpraktikum (ProPra) der Universität Siegen und baut
auf der Bücher-/Shop-Anwendung aus Woche 1–3 auf (inkl. Authentifizierung mit JWT).

## Zielgruppen (Rollen)
| Rolle | Wer? | Was will die Person erreichen? |
|---|---|---|
| **Kunde** (`CUSTOMER`) | Privatpersonen | Bücher suchen, in den Warenkorb legen, bestellen, Rechnung erhalten, Bestellhistorie ansehen |
| **Händler** (`MERCHANT`) | Buchhandlungen | Eigene Shops und Bücher verwalten, Bestellungen abwickeln, Versandlabel drucken, Umsätze verfolgen |
| **Administrator** (`ADMIN`) | Betreiber des Marktplatzes | Überblick über alle Händler, alle Kunden und deren Bestellungen |

Jede Rolle sieht und nutzt **nur** die Funktionen, die für sie gedacht sind
(Durchsetzung im Backend, nicht nur im UI).

## Umfang (Scope)
**Im Umfang:**
- Registrierung als Kunde oder Händler, Login (JWT), Rollen
- Buchsuche (Titel, Autor, ISBN) mit Filter und Sortierung
- Händler: Shops anlegen/bearbeiten, Bücher mit Preis und Bestand anbieten
- Warenkorb und Checkout mit Lieferadresse (ohne Bezahlung)
- Pro Shop eine eigene Bestellung (wie bei Marktplätzen üblich)
- Rechnung als PDF (Positionen, Versand, enthaltene MwSt., Bestellnummer)
- Versandlabel als PDF (Kundenadresse, Bestellnummer)
- Händler-Dashboard (Umsatz pro Buch, Umsatz pro Tag), Bestellübersicht offen/versendet
- Admin-Dashboard (Händler, Kunden, Bestellungen)
- Sinnvolle Testdaten (Seed)

**Nicht im Umfang:**
- Echte Bezahlung, Retouren, Gutscheine, Bewertungen
- E-Mail-Versand, Passwort-Reset
- Bild-Upload (Cover werden per URL oder Platzhalter angezeigt)

## Erfolgskriterien
- Eine Kundin kann in < 2 Minuten ein Buch finden, bestellen und die Rechnung herunterladen.
- Ein Händler sieht neue Bestellungen sofort und kann ein Versandlabel drucken.
- Kein Endpunkt liefert Daten einer anderen Rolle oder eines anderen Händlers aus.
- Die Oberfläche wirkt aufgeräumt und professionell (Angular Material, einheitliches Design).
