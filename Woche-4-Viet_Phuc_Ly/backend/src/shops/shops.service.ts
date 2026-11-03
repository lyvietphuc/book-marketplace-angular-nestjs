// src/shops/shops.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PUBLIC_BOOK_SELECT } from '../books/books.service';

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.shop.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        city: true,
        description: true,
        _count: { select: { books: { where: { published: true } } } },
      },
    });
  }

  async findOne(id: number) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        city: true,
        description: true,
        books: {
          where: { published: true },
          orderBy: { title: 'asc' },
          select: PUBLIC_BOOK_SELECT,
        },
      },
    });
    if (!shop) {
      throw new NotFoundException('Shop nicht gefunden.');
    }
    return shop;
  }
}
