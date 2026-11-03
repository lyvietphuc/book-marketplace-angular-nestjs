// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ORDER_INCLUDE } from '../orders/orders.service';

/** Übersichten für Administratoren (nur lesend) */
@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    const [merchants, customers, shops, books, orders, openOrders, revenue] =
      await this.prisma.$transaction([
        this.prisma.user.count({ where: { role: 'MERCHANT' } }),
        this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
        this.prisma.shop.count(),
        this.prisma.book.count(),
        this.prisma.order.count(),
        this.prisma.order.count({ where: { status: 'OPEN' } }),
        this.prisma.order.aggregate({ _sum: { totalCents: true } }),
      ]);
    return {
      merchants,
      customers,
      shops,
      books,
      orders,
      openOrders,
      revenueCents: revenue._sum.totalCents ?? 0,
    };
  }

  /** Alle Händler mit ihren Shops und Umsatzzahlen */
  async merchants() {
    const [users, perShop, openPerShop] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'MERCHANT' },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          shops: {
            orderBy: { name: 'asc' },
            select: {
              id: true,
              name: true,
              city: true,
              _count: { select: { books: true } },
            },
          },
        },
      }),
      this.prisma.order.groupBy({
        by: ['shopId'],
        _sum: { totalCents: true },
        _count: { _all: true },
      }),
      this.prisma.order.groupBy({
        by: ['shopId'],
        where: { status: 'OPEN' },
        _count: { _all: true },
      }),
    ]);

    const revenue = new Map(perShop.map((r) => [r.shopId, r]));
    const open = new Map(openPerShop.map((r) => [r.shopId, r._count._all]));

    return users.map((u) => {
      const shops = u.shops.map((s) => ({
        id: s.id,
        name: s.name,
        city: s.city,
        books: s._count.books,
        orders: revenue.get(s.id)?._count._all ?? 0,
        openOrders: open.get(s.id) ?? 0,
        revenueCents: revenue.get(s.id)?._sum.totalCents ?? 0,
      }));
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        shops,
        books: shops.reduce((n, s) => n + s.books, 0),
        orders: shops.reduce((n, s) => n + s.orders, 0),
        openOrders: shops.reduce((n, s) => n + s.openOrders, 0),
        revenueCents: shops.reduce((n, s) => n + s.revenueCents, 0),
      };
    });
  }

  /** Alle Kunden mit Anzahl Bestellungen und Gesamtumsatz */
  async customers() {
    const [users, perCustomer] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      this.prisma.order.groupBy({
        by: ['customerId'],
        _sum: { totalCents: true },
        _count: { _all: true },
        _max: { createdAt: true },
      }),
    ]);
    const stats = new Map(perCustomer.map((r) => [r.customerId, r]));
    return users.map((u) => ({
      ...u,
      orders: stats.get(u.id)?._count._all ?? 0,
      totalSpentCents: stats.get(u.id)?._sum.totalCents ?? 0,
      lastOrderAt: stats.get(u.id)?._max.createdAt ?? null,
    }));
  }

  async customerOrders(customerId: number) {
    const customer = await this.prisma.user.findFirst({
      where: { id: customerId, role: 'CUSTOMER' },
      select: { id: true },
    });
    if (!customer) {
      throw new NotFoundException('Kunde nicht gefunden.');
    }
    return this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: ORDER_INCLUDE,
    });
  }
}
