// src/pdf/pdf.service.ts
import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { formatEuro, includedVat, VAT_RATE_BOOKS } from '../common/money';

/** Die Daten, die für Rechnung und Versandlabel gebraucht werden */
export type PdfOrder = {
  orderNumber: string;
  createdAt: Date;
  shippingName: string;
  shippingStreet: string;
  shippingZip: string;
  shippingCity: string;
  shippingCountry: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shop: { name: string; city: string };
  items: {
    title: string;
    author: string;
    quantity: number;
    unitPriceCents: number;
    lineTotalCents: number;
  }[];
};

const DARK = '#1f2937';
const ACCENT = '#f59e0b';
const GREY = '#6b7280';

function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** Sammelt den PDF-Stream in einem Buffer */
function toBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

/**
 * Erzeugt PDFs serverseitig mit pdfkit.
 * Vorteil gegenüber dem Browser: Die Berechtigung wird im Backend geprüft und
 * die Beträge kommen direkt aus der Datenbank.
 */
@Injectable()
export class PdfService {
  /** Rechnung (A4) mit Kostenaufschlüsselung und Bestellnummer */
  invoice(order: PdfOrder, customerEmail: string): Promise<Buffer> {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Rechnung ${order.orderNumber}`,
        Author: 'Amazing Marktplatz',
      },
    });
    const left = 50;
    const right = 545;

    // Kopfzeile
    doc.rect(0, 0, 595, 80).fill(DARK);
    doc
      .fillColor(ACCENT)
      .font('Helvetica-Bold')
      .fontSize(26)
      .text('amazing', left, 26);
    doc
      .fillColor('#ffffff')
      .font('Helvetica')
      .fontSize(10)
      .text('Bücher-Marktplatz', left, 56);
    doc
      .fillColor('#ffffff')
      .fontSize(10)
      .text(`Verkauft von: ${order.shop.name}, ${order.shop.city}`, 300, 34, {
        width: right - 300,
        align: 'right',
      })
      .text('über den Amazing Marktplatz', 300, 50, {
        width: right - 300,
        align: 'right',
      });

    // Empfänger + Rechnungsdaten
    doc
      .fillColor(GREY)
      .fontSize(8)
      .text(`${order.shop.name} · ${order.shop.city}`, left, 110);
    doc
      .fillColor(DARK)
      .fontSize(11)
      .text(order.shippingName, left, 126)
      .text(order.shippingStreet)
      .text(`${order.shippingZip} ${order.shippingCity}`)
      .text(order.shippingCountry);

    const metaX = 340;
    const meta: [string, string][] = [
      ['Rechnungsnummer', `RE-${order.orderNumber}`],
      ['Bestellnummer', order.orderNumber],
      ['Bestelldatum', formatDate(order.createdAt)],
      ['Rechnungsdatum', formatDate(new Date())],
      ['Kunde', customerEmail],
    ];
    meta.forEach(([label, value], i) => {
      const y = 112 + i * 16;
      doc.fillColor(GREY).fontSize(9).text(label, metaX, y, { width: 90 });
      doc
        .fillColor(DARK)
        .fontSize(9)
        .text(value, metaX + 90, y, {
          width: right - metaX - 90,
          align: 'right',
        });
    });

    doc
      .fillColor(DARK)
      .font('Helvetica-Bold')
      .fontSize(20)
      .text('Rechnung', left, 230);

    // Tabelle
    const cols = { pos: left, title: left + 30, qty: 330, unit: 390, sum: 470 };
    let y = 270;
    doc.rect(left, y - 6, right - left, 22).fill('#f3f4f6');
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(9);
    doc.text('Pos.', cols.pos + 4, y);
    doc.text('Artikel', cols.title, y);
    doc.text('Menge', cols.qty, y, { width: 50, align: 'right' });
    doc.text('Einzelpreis', cols.unit, y, { width: 70, align: 'right' });
    doc.text('Summe', cols.sum, y, { width: right - cols.sum, align: 'right' });
    y += 26;

    doc.font('Helvetica').fontSize(10);
    order.items.forEach((item, index) => {
      if (y > 700) {
        doc.addPage();
        y = 60;
      }
      doc.fillColor(DARK).text(String(index + 1), cols.pos + 4, y);
      doc.text(item.title, cols.title, y, {
        width: cols.qty - cols.title - 10,
      });
      const titleHeight = doc.heightOfString(item.title, {
        width: cols.qty - cols.title - 10,
      });
      doc
        .fillColor(GREY)
        .fontSize(8)
        .text(item.author, cols.title, y + titleHeight + 1, {
          width: cols.qty - cols.title - 10,
        });
      doc.fillColor(DARK).fontSize(10);
      doc.text(String(item.quantity), cols.qty, y, {
        width: 50,
        align: 'right',
      });
      doc.text(formatEuro(item.unitPriceCents), cols.unit, y, {
        width: 70,
        align: 'right',
      });
      doc.text(formatEuro(item.lineTotalCents), cols.sum, y, {
        width: right - cols.sum,
        align: 'right',
      });
      y += Math.max(titleHeight + 16, 30);
      doc
        .moveTo(left, y - 6)
        .lineTo(right, y - 6)
        .strokeColor('#e5e7eb')
        .lineWidth(0.5)
        .stroke();
    });

    // Summen
    const vat = includedVat(order.totalCents);
    const sums: [string, string, boolean][] = [
      ['Zwischensumme', formatEuro(order.subtotalCents), false],
      [
        'Versand',
        order.shippingCents === 0
          ? 'kostenlos'
          : formatEuro(order.shippingCents),
        false,
      ],
      ['Gesamtbetrag', formatEuro(order.totalCents), true],
      [
        `davon MwSt. (${Math.round(VAT_RATE_BOOKS * 100)} %)`,
        formatEuro(vat),
        false,
      ],
      ['Nettobetrag', formatEuro(order.totalCents - vat), false],
    ];
    y += 8;
    for (const [label, value, bold] of sums) {
      doc
        .font(bold ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(bold ? 12 : 10)
        .fillColor(DARK);
      if (bold) {
        doc
          .moveTo(330, y - 4)
          .lineTo(right, y - 4)
          .strokeColor(DARK)
          .lineWidth(1)
          .stroke();
      }
      doc.text(label, 330, y, { width: 130 });
      doc.text(value, 460, y, { width: right - 460, align: 'right' });
      y += bold ? 22 : 18;
    }

    // Hinweise
    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor(GREY)
      .text(
        'Der Betrag wurde beim Kauf beglichen. Bücher unterliegen dem ermäßigten Umsatzsteuersatz von 7 %. ' +
          'Die Versandkosten teilen als Nebenleistung den Steuersatz der Hauptleistung.',
        left,
        y + 20,
        { width: right - left },
      );

    doc
      .fontSize(8)
      .text(
        'Amazing Marktplatz · Übungsprojekt im Programmierpraktikum der Universität Siegen · keine echte Rechnung',
        left,
        780,
        { width: right - left, align: 'center' },
      );

    return toBuffer(doc);
  }

  /** Versandlabel (10 × 15 cm) mit Kundenadresse und Bestellnummer */
  shippingLabel(order: PdfOrder): Promise<Buffer> {
    // 10 x 15 cm = 283 x 425 pt
    const doc = new PDFDocument({
      size: [425, 283],
      margin: 16,
      info: {
        Title: `Versandlabel ${order.orderNumber}`,
        Author: 'Amazing Marktplatz',
      },
    });
    const w = 425;
    const h = 283;

    doc
      .rect(8, 8, w - 16, h - 16)
      .lineWidth(2)
      .strokeColor(DARK)
      .stroke();

    // Kopf
    doc.rect(8, 8, w - 16, 34).fill(DARK);
    doc
      .fillColor(ACCENT)
      .font('Helvetica-Bold')
      .fontSize(16)
      .text('amazing', 20, 17);
    doc
      .fillColor('#ffffff')
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('PAKET · STANDARD', 200, 20, { width: w - 220, align: 'right' });

    // Absender
    doc.fillColor(GREY).font('Helvetica').fontSize(7).text('ABSENDER', 20, 52);
    doc
      .fillColor(DARK)
      .fontSize(9)
      .text(`${order.shop.name}`, 20, 62)
      .text(`${order.shop.city}, Deutschland`);

    // Empfänger
    doc.fillColor(GREY).fontSize(7).text('EMPFÄNGER', 20, 100);
    doc
      .fillColor(DARK)
      .font('Helvetica-Bold')
      .fontSize(15)
      .text(order.shippingName, 20, 112, { width: 260 })
      .font('Helvetica')
      .fontSize(13)
      .text(order.shippingStreet, { width: 260 })
      .font('Helvetica-Bold')
      .fontSize(15)
      .text(`${order.shippingZip} ${order.shippingCity}`, { width: 260 })
      .font('Helvetica')
      .fontSize(10)
      .text(order.shippingCountry.toUpperCase());

    // Bestellnummer gut lesbar in einer Box
    doc.rect(290, 52, 115, 80).lineWidth(1).strokeColor(DARK).stroke();
    doc.fillColor(GREY).fontSize(7).text('BESTELLNUMMER', 298, 60);
    doc
      .fillColor(DARK)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(order.orderNumber, 298, 74, { width: 100 });
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(GREY)
      .text(`vom ${formatDate(order.createdAt)}`, 298, 106);

    // Inhalt
    const count = order.items.reduce((n, i) => n + i.quantity, 0);
    doc
      .moveTo(8, 222)
      .lineTo(w - 8, 222)
      .lineWidth(1)
      .strokeColor(DARK)
      .stroke();
    doc
      .fillColor(DARK)
      .font('Helvetica')
      .fontSize(9)
      .text(`Inhalt: ${count} ${count === 1 ? 'Buch' : 'Bücher'}`, 20, 232)
      .fontSize(7)
      .fillColor(GREY)
      .text('Amazing Marktplatz · Übungsprojekt Uni Siegen', 20, 250);

    return toBuffer(doc);
  }
}
