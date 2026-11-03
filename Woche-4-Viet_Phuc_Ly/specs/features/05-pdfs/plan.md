# Feature 05 – PDFs: Rechnung & Versandlabel – Plan

## Ziel
- Kunden laden zu jeder Bestellung eine **Rechnung (PDF)** mit Kostenaufschlüsselung und Bestellnummer herunter.
- Händler erzeugen für jede Bestellung ein **Versandlabel (PDF)** mit Kundenadresse und Bestellnummer.

## Vorgehen
1. `PdfService` im Backend mit **pdfkit**: `invoice(order, email)` (A4) und `shippingLabel(order)` (10 × 15 cm).
2. Endpunkte:
   - `GET /orders/:id/invoice` (Rolle CUSTOMER, nur eigene Bestellung)
   - `GET /merchant/orders/:id/label` (Rolle MERCHANT, nur Bestellungen eigener Shops)
   - Antwort als `StreamableFile` mit `Content-Type: application/pdf` und Dateiname.
3. Frontend: Download per `HttpClient` (`responseType: 'blob'`), damit der Interceptor das Token mitschickt;
   Button „Rechnung (PDF)“ in „Meine Bestellungen“. Der Label-Button folgt in Feature 06 (Händler-Bestellungen).

## Entscheidungen
- PDFs **serverseitig**: Berechtigung wird im Backend geprüft, Beträge kommen aus der DB (Snapshot).
- Ein normaler Link (`<a href>`) funktioniert nicht, weil er keinen `Authorization`-Header sendet.
- MwSt.: Preise sind brutto; ausgewiesen wird die enthaltene MwSt. = brutto − brutto / 1,07.
