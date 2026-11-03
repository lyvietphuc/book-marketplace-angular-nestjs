// src/orders/orders.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { shippingFor } from '../common/money';
import { CreateOrderDto } from './dto/create-order.dto';

/** Was zu einer Bestellung angezeigt wird (Kunde, Händler, Admin) */
export const ORDER_INCLUDE = {
  items: { orderBy: { id: 'asc' as const } },
  shop: { select: { id: true, name: true, city: true } },
} as const;

/** Bestellnummer aus der ID: AMZ-2026-000042 */
export function orderNumberFor(id: number, date = new Date()): string {
  return `AMZ-${date.getFullYear()}-${String(id).padStart(6, '0')}`;
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Checkout: Aus dem Warenkorb wird PRO SHOP eine Bestellung.
   * Alles läuft in EINER Transaktion: Wenn ein Buch nicht mehr reicht,
   * wird nichts gespeichert und kein Bestand verändert.
   */
  async checkout(customerId: number, dto: CreateOrderDto) {
    // gleiche Bücher zusammenfassen
    const quantities = new Map<number, number>();
    for (const item of dto.items) {
      quantities.set(
        item.bookId,
        (quantities.get(item.bookId) ?? 0) + item.quantity,
      );
    }
    const bookIds = [...quantities.keys()];
    const checkoutId = randomUUID();

    return this.prisma.$transaction(async (tx) => {
      // Preise IMMER aus der Datenbank – nie dem Client vertrauen
      const books = await tx.book.findMany({
        where: { id: { in: bookIds }, published: true },
      });
      if (books.length !== bookIds.length) {
        throw new BadRequestException(
          'Mindestens ein Buch ist nicht mehr verfügbar. Bitte Warenkorb prüfen.',
        );
      }

      // Bestand reduzieren – nur wenn genug da ist (atomar, kein Überverkauf)
      for (const book of books) {
        const quantity = quantities.get(book.id)!;
        const updated = await tx.book.updateMany({
          where: { id: book.id, stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        });
        if (updated.count === 0) {
          throw new ConflictException(
            `„${book.title}“: nur noch ${book.stock} Stück auf Lager.`,
          );
        }
      }

      // nach Shop gruppieren
      const byShop = new Map<number, typeof books>();
      for (const book of books) {
        byShop.set(book.shopId, [...(byShop.get(book.shopId) ?? []), book]);
      }

      const created: { id: number; orderNumber: string; totalCents: number }[] =
        [];
      for (const [shopId, shopBooks] of byShop) {
        const items = shopBooks.map((b) => {
          const quantity = quantities.get(b.id)!;
          return {
            bookId: b.id,
            title: b.title,
            author: b.author,
            unitPriceCents: b.priceCents,
            quantity,
            lineTotalCents: b.priceCents * quantity,
          };
        });
        const subtotalCents = items.reduce((s, i) => s + i.lineTotalCents, 0);
        const shippingCents = shippingFor(subtotalCents);

        const order = await tx.order.create({
          data: {
            orderNumber: `TMP-${randomUUID()}`, // wird gleich durch die echte Nummer ersetzt
            checkoutId,
            customerId,
            shopId,
            shippingName: dto.shipping.name.trim(),
            shippingStreet: dto.shipping.street.trim(),
            shippingZip: dto.shipping.zip,
            shippingCity: dto.shipping.city.trim(),
            shippingCountry: dto.shipping.country?.trim() || 'Deutschland',
            subtotalCents,
            shippingCents,
            totalCents: subtotalCents + shippingCents,
            items: { create: items },
          },
        });
        const orderNumber = orderNumberFor(order.id, order.createdAt);
        await tx.order.update({
          where: { id: order.id },
          data: { orderNumber },
        });
        created.push({
          id: order.id,
          orderNumber,
          totalCents: order.totalCents,
        });
      }

      return { checkoutId, orders: created };
    });
  }

  /** Bestellhistorie des Kunden, neueste zuerst */
  findMine(customerId: number) {
    return this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: ORDER_INCLUDE,
    });
  }

  async findMineById(customerId: number, orderId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, customerId },
      include: ORDER_INCLUDE,
    });
    if (!order) {
      throw new NotFoundException('Bestellung nicht gefunden.');
    }
    return order;
  }
}
