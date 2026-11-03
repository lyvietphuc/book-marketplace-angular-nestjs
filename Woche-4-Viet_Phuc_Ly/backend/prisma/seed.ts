// backend/prisma/seed.ts – Testdaten für den "Amazing" Marktplatz
//
// ACHTUNG: Das Skript LÖSCHT alle vorhandenen Daten und legt sie neu an.
// Alle Testkonten haben das Passwort "Passwort123!" (nur für die Entwicklung!).

import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Role } from '../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

const TEST_PASSWORD = 'Passwort123!';

// Kleiner deterministischer Zufallsgenerator -> bei jedem Seed die gleichen Daten
let rngState = 42;
function rand(): number {
  rngState = (rngState * 1664525 + 1013904223) % 4294967296;
  return rngState / 4294967296;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

/** Gültige ISBN-13 (Prüfziffer korrekt) aus 12 Ziffern erzeugen */
function isbn13(base12: string): string {
  const sum = base12
    .split('')
    .reduce((acc, d, i) => acc + Number(d) * (i % 2 === 0 ? 1 : 3), 0);
  return base12 + ((10 - (sum % 10)) % 10);
}

type BookSeed = {
  title: string;
  author: string;
  priceCents: number;
  stock: number;
  description: string;
};

const SHOPS: {
  owner: string;
  name: string;
  city: string;
  description: string;
  books: BookSeed[];
}[] = [
  {
    owner: 'haendler.siegen@amazing.de',
    name: 'Siegener Bücherstube',
    city: 'Siegen',
    description:
      'Inhabergeführte Buchhandlung in der Siegener Oberstadt – Klassiker und Neuerscheinungen.',
    books: [
      {
        title: 'Der Process',
        author: 'Franz Kafka',
        priceCents: 899,
        stock: 12,
        description:
          'Josef K. wird eines Morgens verhaftet, ohne zu wissen, warum.',
      },
      {
        title: 'Die Verwandlung',
        author: 'Franz Kafka',
        priceCents: 499,
        stock: 20,
        description:
          'Gregor Samsa erwacht als Ungeziefer – Kafkas berühmteste Erzählung.',
      },
      {
        title: 'Faust. Der Tragödie erster Teil',
        author: 'Johann Wolfgang von Goethe',
        priceCents: 450,
        stock: 25,
        description: 'Der Gelehrte Faust schließt einen Pakt mit Mephisto.',
      },
      {
        title: 'Effi Briest',
        author: 'Theodor Fontane',
        priceCents: 690,
        stock: 8,
        description:
          'Gesellschaftsroman über eine junge Frau im preußischen Adel.',
      },
      {
        title: 'Der Steppenwolf',
        author: 'Hermann Hesse',
        priceCents: 1200,
        stock: 6,
        description: 'Harry Haller zwischen bürgerlicher Welt und Einsamkeit.',
      },
      {
        title: 'Siddhartha',
        author: 'Hermann Hesse',
        priceCents: 1000,
        stock: 0,
        description: 'Eine indische Dichtung über die Suche nach Erleuchtung.',
      },
      {
        title: 'Im Westen nichts Neues',
        author: 'Erich Maria Remarque',
        priceCents: 1300,
        stock: 9,
        description: 'Der Erste Weltkrieg aus Sicht eines jungen Soldaten.',
      },
    ],
  },
  {
    owner: 'haendler.siegen@amazing.de',
    name: 'Antiquariat am Schloss',
    city: 'Siegen',
    description: 'Gebrauchte und seltene Bücher – sorgfältig geprüft.',
    books: [
      {
        title: 'Die Buddenbrooks',
        author: 'Thomas Mann',
        priceCents: 1490,
        stock: 2,
        description:
          'Verfall einer Lübecker Kaufmannsfamilie – gut erhaltene Ausgabe.',
      },
      {
        title: 'Der Zauberberg',
        author: 'Thomas Mann',
        priceCents: 1890,
        stock: 1,
        description: 'Hans Castorp im Sanatorium in Davos – gebundene Ausgabe.',
      },
      {
        title: 'Berlin Alexanderplatz',
        author: 'Alfred Döblin',
        priceCents: 1150,
        stock: 3,
        description: 'Franz Biberkopf im Berlin der 1920er-Jahre.',
      },
      {
        title: 'Die Blechtrommel',
        author: 'Günter Grass',
        priceCents: 990,
        stock: 2,
        description: 'Oskar Matzerath beschließt, nicht mehr zu wachsen.',
      },
      {
        title: 'Der Vorleser',
        author: 'Bernhard Schlink',
        priceCents: 590,
        stock: 4,
        description: 'Eine Liebesgeschichte und die Frage nach Schuld.',
      },
    ],
  },
  {
    owner: 'haendler.koeln@amazing.de',
    name: 'Kölner Lesezeichen',
    city: 'Köln',
    description:
      'Fachbuchhandlung für Informatik und Software-Entwicklung am Rhein.',
    books: [
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        priceCents: 4490,
        stock: 15,
        description: 'Ein Handbuch für agile Software-Handwerkskunst.',
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'David Thomas, Andrew Hunt',
        priceCents: 4290,
        stock: 10,
        description:
          'Vom Gesellen zum Meister – Klassiker der Software-Entwicklung.',
      },
      {
        title: 'Effective TypeScript',
        author: 'Dan Vanderkam',
        priceCents: 4990,
        stock: 7,
        description: '83 konkrete Wege, Ihr TypeScript zu verbessern.',
      },
      {
        title: 'Design Patterns',
        author: 'Erich Gamma u. a.',
        priceCents: 5490,
        stock: 5,
        description:
          'Entwurfsmuster als Elemente wiederverwendbarer objektorientierter Software.',
      },
      {
        title: 'Refactoring',
        author: 'Martin Fowler',
        priceCents: 4990,
        stock: 6,
        description: 'Wie Sie das Design bestehender Software verbessern.',
      },
      {
        title: 'Angular – Das große Praxisbuch',
        author: 'Ferdinand Malcher u. a.',
        priceCents: 4490,
        stock: 11,
        description: 'Grundlagen, fortgeschrittene Themen und Best Practices.',
      },
      {
        title: 'Datenbanksysteme',
        author: 'Alfons Kemper, André Eickler',
        priceCents: 5999,
        stock: 4,
        description:
          'Eine Einführung – Standardwerk für das Informatikstudium.',
      },
      {
        title: 'Grokking Algorithms',
        author: 'Aditya Bhargava',
        priceCents: 3990,
        stock: 0,
        description: 'Algorithmen anschaulich illustriert.',
      },
    ],
  },
  {
    owner: 'haendler.frankfurt@amazing.de',
    name: 'Mainufer Bücher',
    city: 'Frankfurt am Main',
    description: 'Romane, Krimis und Fantasy – mit Herz ausgewählt.',
    books: [
      {
        title: 'Der Herr der Ringe',
        author: 'J. R. R. Tolkien',
        priceCents: 3500,
        stock: 8,
        description: 'Die komplette Trilogie in einem Band.',
      },
      {
        title: 'Der kleine Hobbit',
        author: 'J. R. R. Tolkien',
        priceCents: 1400,
        stock: 14,
        description: 'Bilbo Beutlins Reise zum Einsamen Berg.',
      },
      {
        title: 'Die unendliche Geschichte',
        author: 'Michael Ende',
        priceCents: 1800,
        stock: 10,
        description: 'Bastian taucht ein in die Welt Phantásiens.',
      },
      {
        title: 'Momo',
        author: 'Michael Ende',
        priceCents: 1600,
        stock: 12,
        description: 'Die Geschichte von den Zeit-Dieben.',
      },
      {
        title: 'Das Parfum',
        author: 'Patrick Süskind',
        priceCents: 1300,
        stock: 7,
        description:
          'Die Geschichte eines Mörders im Paris des 18. Jahrhunderts.',
      },
      {
        title: 'Tschick',
        author: 'Wolfgang Herrndorf',
        priceCents: 1100,
        stock: 9,
        description: 'Zwei Jungen, ein geklauter Lada und ein Sommer.',
      },
      {
        title: 'Der Schwarm',
        author: 'Frank Schätzing',
        priceCents: 1499,
        stock: 5,
        description: 'Das Meer schlägt zurück – Öko-Thriller.',
      },
      {
        title: 'Die Känguru-Chroniken',
        author: 'Marc-Uwe Kling',
        priceCents: 1200,
        stock: 18,
        description: 'Ansichten eines vorlauten Beuteltiers.',
      },
    ],
  },
];

const USERS: { email: string; name: string; role: Role }[] = [
  { email: 'admin@amazing.de', name: 'Alex Admin', role: 'ADMIN' },
  {
    email: 'haendler.siegen@amazing.de',
    name: 'Mara Schneider',
    role: 'MERCHANT',
  },
  {
    email: 'haendler.koeln@amazing.de',
    name: 'Jonas Becker',
    role: 'MERCHANT',
  },
  {
    email: 'haendler.frankfurt@amazing.de',
    name: 'Aylin Demir',
    role: 'MERCHANT',
  },
  { email: 'anna@example.de', name: 'Anna Müller', role: 'CUSTOMER' },
  { email: 'ben@example.de', name: 'Ben Wagner', role: 'CUSTOMER' },
  { email: 'clara@example.de', name: 'Clara Hoffmann', role: 'CUSTOMER' },
  { email: 'david@example.de', name: 'David Klein', role: 'CUSTOMER' },
];

const ADDRESSES: Record<string, { street: string; zip: string; city: string }> =
  {
    'anna@example.de': {
      street: 'Hölderlinstraße 3',
      zip: '57076',
      city: 'Siegen',
    },
    'ben@example.de': { street: 'Ehrenstraße 12', zip: '50672', city: 'Köln' },
    'clara@example.de': {
      street: 'Berger Straße 88',
      zip: '60316',
      city: 'Frankfurt am Main',
    },
    'david@example.de': {
      street: 'Kaiserstraße 5',
      zip: '53113',
      city: 'Bonn',
    },
  };

async function main() {
  // 1. Alles löschen (Reihenfolge wegen Fremdschlüsseln)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.book.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.user.deleteMany();

  // 2. Benutzer
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
  const users = new Map<string, { id: number; name: string }>();
  for (const u of USERS) {
    const created = await prisma.user.create({
      data: { ...u, passwordHash },
    });
    users.set(u.email, { id: created.id, name: u.name });
  }

  // 3. Shops und Bücher
  let isbnCounter = 0;
  const allBooks: {
    id: number;
    shopId: number;
    title: string;
    author: string;
    priceCents: number;
  }[] = [];
  for (const s of SHOPS) {
    const shop = await prisma.shop.create({
      data: {
        name: s.name,
        city: s.city,
        description: s.description,
        ownerId: users.get(s.owner)!.id,
        // ältere Angebote zuerst, damit "Neueste" sinnvoll sortiert
        createdAt: new Date(Date.now() - 90 * 86400000),
      },
    });
    for (const b of s.books) {
      isbnCounter++;
      const book = await prisma.book.create({
        data: {
          ...b,
          isbn: isbn13(`978300${String(100000 + isbnCounter * 137).slice(-6)}`),
          shopId: shop.id,
          createdAt: new Date(Date.now() - (60 - isbnCounter * 2) * 86400000),
        },
      });
      allBooks.push({
        id: book.id,
        shopId: shop.id,
        title: b.title,
        author: b.author,
        priceCents: b.priceCents,
      });
    }
  }

  // 4. Bestellungen der letzten 30 Tage
  const customers = USERS.filter((u) => u.role === 'CUSTOMER');
  let orderSeq = 0;
  for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
    const ordersToday = Math.floor(rand() * 4); // 0–3 Checkouts pro Tag
    for (let n = 0; n < ordersToday; n++) {
      const customerSeed = pick(customers);
      const customer = users.get(customerSeed.email)!;
      const address = ADDRESSES[customerSeed.email];
      const shopId = pick(allBooks).shopId;
      const shopBooks = allBooks.filter((b) => b.shopId === shopId);
      const itemCount = 1 + Math.floor(rand() * 3);
      const chosen = [
        ...new Set(Array.from({ length: itemCount }, () => pick(shopBooks))),
      ];
      const items = chosen.map((b) => {
        const quantity = 1 + Math.floor(rand() * 2);
        return {
          bookId: b.id,
          title: b.title,
          author: b.author,
          unitPriceCents: b.priceCents,
          quantity,
          lineTotalCents: b.priceCents * quantity,
        };
      });
      const subtotalCents = items.reduce((sum, i) => sum + i.lineTotalCents, 0);
      const shippingCents = subtotalCents >= 2000 ? 0 : 299;
      const createdAt = new Date(
        Date.now() - daysAgo * 86400000 - Math.floor(rand() * 8) * 3600000,
      );
      const shipped = daysAgo > 2; // ältere Bestellungen sind bereits versendet
      orderSeq++;
      const order = await prisma.order.create({
        data: {
          orderNumber: `TMP-${randomUUID()}`,
          checkoutId: randomUUID(),
          status: shipped ? 'SHIPPED' : 'OPEN',
          shippingName: customer.name,
          shippingStreet: address.street,
          shippingZip: address.zip,
          shippingCity: address.city,
          subtotalCents,
          shippingCents,
          totalCents: subtotalCents + shippingCents,
          createdAt,
          shippedAt: shipped ? new Date(createdAt.getTime() + 86400000) : null,
          customerId: customer.id,
          shopId,
          items: { create: items },
        },
      });
      // gleiche Bestellnummer-Logik wie im OrdersService: AMZ-JJJJ-<ID>
      await prisma.order.update({
        where: { id: order.id },
        data: {
          orderNumber: `AMZ-${createdAt.getFullYear()}-${String(order.id).padStart(6, '0')}`,
        },
      });
    }
  }

  // 5. Jeder Shop bekommt mindestens eine offene Bestellung von heute (für die Bestellabwicklung)
  const shops = await prisma.shop.findMany({ include: { books: true } });
  for (const [index, shop] of shops.entries()) {
    const customerSeed = customers[index % customers.length];
    const customer = users.get(customerSeed.email)!;
    const address = ADDRESSES[customerSeed.email];
    const book = shop.books[index % shop.books.length];
    const quantity = 1 + (index % 2);
    const subtotalCents = book.priceCents * quantity;
    const shippingCents = subtotalCents >= 2000 ? 0 : 299;
    const order = await prisma.order.create({
      data: {
        orderNumber: `TMP-${randomUUID()}`,
        checkoutId: randomUUID(),
        status: 'OPEN',
        shippingName: customer.name,
        shippingStreet: address.street,
        shippingZip: address.zip,
        shippingCity: address.city,
        subtotalCents,
        shippingCents,
        totalCents: subtotalCents + shippingCents,
        createdAt: new Date(Date.now() - (index + 1) * 3600000),
        customerId: customer.id,
        shopId: shop.id,
        items: {
          create: [
            {
              bookId: book.id,
              title: book.title,
              author: book.author,
              unitPriceCents: book.priceCents,
              quantity,
              lineTotalCents: subtotalCents,
            },
          ],
        },
      },
    });
    await prisma.order.update({
      where: { id: order.id },
      data: {
        orderNumber: `AMZ-${order.createdAt.getFullYear()}-${String(order.id).padStart(6, '0')}`,
      },
    });
    orderSeq++;
  }

  console.log(
    `Seed fertig: ${USERS.length} Benutzer, ${SHOPS.length} Shops, ${allBooks.length} Bücher, ${orderSeq} Bestellungen.`,
  );
  console.log(`Alle Testkonten: Passwort "${TEST_PASSWORD}"`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
