// src/merchant/merchant.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ORDER_INCLUDE } from '../orders/orders.service';
import { dayKey, lastDays } from '../common/dates';
import type { OrderStatus } from '../../generated/prisma/client';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { CreateShopDto, UpdateShopDto } from './dto/shop.dto';

/**
 * Händler-Funktionen. WICHTIG: Jede Abfrage filtert nach ownerId,
 * damit ein Händler nie Shops/Bücher eines anderen Händlers sieht oder ändert.
 * Fremde IDs liefern 404 (nicht 403), damit man nicht erraten kann, welche IDs existieren.
 */
@Injectable()
export class MerchantService {
  constructor(private prisma: PrismaService) {}

  // ---------- Shops ----------

  listShops(ownerId: number) {
    return this.prisma.shop.findMany({
      where: { ownerId },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { books: true, orders: { where: { status: 'OPEN' } } },
        },
      },
    });
  }

  async createShop(ownerId: number, dto: CreateShopDto) {
    try {
      return await this.prisma.shop.create({ data: { ...dto, ownerId } });
    } catch (err) {
      throw this.mapUniqueError(err);
    }
  }

  async updateShop(ownerId: number, shopId: number, dto: UpdateShopDto) {
    await this.assertOwnShop(ownerId, shopId);
    try {
      return await this.prisma.shop.update({
        where: { id: shopId },
        data: dto,
      });
    } catch (err) {
      throw this.mapUniqueError(err);
    }
  }

  // ---------- Bücher ----------

  listBooks(ownerId: number, shopId?: number) {
    return this.prisma.book.findMany({
      where: { shop: { ownerId }, ...(shopId ? { shopId } : {}) },
      orderBy: [{ shop: { name: 'asc' } }, { title: 'asc' }],
      include: { shop: { select: { id: true, name: true, city: true } } },
    });
  }

  async createBook(ownerId: number, dto: CreateBookDto) {
    await this.assertOwnShop(ownerId, dto.shopId);
    return this.prisma.book.create({ data: dto });
  }

  async updateBook(ownerId: number, bookId: number, dto: UpdateBookDto) {
    await this.assertOwnBook(ownerId, bookId);
    if (dto.shopId !== undefined) {
      await this.assertOwnShop(ownerId, dto.shopId);
    }
    return this.prisma.book.update({ where: { id: bookId }, data: dto });
  }

  async deleteBook(ownerId: number, bookId: number) {
    await this.assertOwnBook(ownerId, bookId);
    // OrderItems behalten ihren Snapshot (bookId wird per onDelete: SetNull auf null gesetzt)
    await this.prisma.book.delete({ where: { id: bookId } });
    return { deleted: true };
  }

  // ---------- Bestellungen ----------

  /** Bestellungen aller eigenen Shops, optional nach Status gefiltert */
  listOrders(ownerId: number, status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: { shop: { ownerId }, ...(status ? { status } : {}) },
      // offene zuerst, darin älteste zuerst (wer zuerst bestellt, wird zuerst bedient)
      orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
      include: ORDER_INCLUDE,
    });
  }

  async updateOrderStatus(
    ownerId: number,
    orderId: number,
    status: OrderStatus,
  ) {
    await this.findOwnOrder(ownerId, orderId);
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status, shippedAt: status === 'SHIPPED' ? new Date() : null },
      include: ORDER_INCLUDE,
    });
  }

  /**
   * Verkaufsstatistik für das Dashboard:
   * - Umsatz pro Tag (Bestellsumme inkl. Versand) für die letzten `days` Tage
   * - Umsatz pro Buch (Summe der Positionen) im gleichen Zeitraum
   */
  async stats(ownerId: number, days: number) {
    const dayList = lastDays(days);
    const since = new Date(`${dayList[0]}T00:00:00`);
    since.setTime(since.getTime() - 86400000); // Puffer für Zeitzonen, wird unten exakt gefiltert

    const orders = await this.prisma.order.findMany({
      where: { shop: { ownerId }, createdAt: { gte: since } },
      include: { items: true },
    });
    const inRange = orders.filter((o) => dayList.includes(dayKey(o.createdAt)));

    const perDay = new Map(
      dayList.map((d) => [d, { date: d, revenueCents: 0, orders: 0 }]),
    );
    const perBook = new Map<
      string,
      {
        bookId: number | null;
        title: string;
        quantity: number;
        revenueCents: number;
      }
    >();
    for (const order of inRange) {
      const day = perDay.get(dayKey(order.createdAt))!;
      day.revenueCents += order.totalCents;
      day.orders += 1;
      for (const item of order.items) {
        const key =
          item.bookId !== null ? `id:${item.bookId}` : `title:${item.title}`;
        const entry = perBook.get(key) ?? {
          bookId: item.bookId,
          title: item.title,
          quantity: 0,
          revenueCents: 0,
        };
        entry.quantity += item.quantity;
        entry.revenueCents += item.lineTotalCents;
        perBook.set(key, entry);
      }
    }

    const revenueCents = inRange.reduce((s, o) => s + o.totalCents, 0);
    const openOrders = await this.prisma.order.count({
      where: { shop: { ownerId }, status: 'OPEN' },
    });

    return {
      days,
      totals: {
        revenueCents,
        orderCount: inRange.length,
        itemsSold: inRange.reduce(
          (s, o) => s + o.items.reduce((n, i) => n + i.quantity, 0),
          0,
        ),
        averageOrderCents: inRange.length
          ? Math.round(revenueCents / inRange.length)
          : 0,
        openOrders,
      },
      perDay: [...perDay.values()],
      perBook: [...perBook.values()].sort(
        (a, b) => b.revenueCents - a.revenueCents,
      ),
    };
  }

  /** Eine Bestellung aus einem eigenen Shop (sonst 404) */
  async findOwnOrder(ownerId: number, orderId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, shop: { ownerId } },
      include: ORDER_INCLUDE,
    });
    if (!order) {
      throw new NotFoundException('Bestellung nicht gefunden.');
    }
    return order;
  }

  // ---------- Hilfsfunktionen ----------

  async assertOwnShop(ownerId: number, shopId: number) {
    const shop = await this.prisma.shop.findFirst({
      where: { id: shopId, ownerId },
      select: { id: true },
    });
    if (!shop) {
      throw new NotFoundException('Shop nicht gefunden.');
    }
  }

  private async assertOwnBook(ownerId: number, bookId: number) {
    const book = await this.prisma.book.findFirst({
      where: { id: bookId, shop: { ownerId } },
      select: { id: true },
    });
    if (!book) {
      throw new NotFoundException('Buch nicht gefunden.');
    }
  }

  private mapUniqueError(err: unknown) {
    if ((err as { code?: string })?.code === 'P2002') {
      return new ConflictException(
        'Ein Shop mit diesem Namen existiert bereits.',
      );
    }
    return err;
  }
}
