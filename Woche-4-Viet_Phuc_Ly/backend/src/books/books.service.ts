// src/books/books.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '../../generated/prisma/client';
import { SearchBooksDto } from './dto/search-books.dto';

/** Felder, die öffentlich über ein Buch angezeigt werden (inkl. Shop) */
export const PUBLIC_BOOK_SELECT = {
  id: true,
  title: true,
  author: true,
  isbn: true,
  description: true,
  coverUrl: true,
  priceCents: true,
  stock: true,
  createdAt: true,
  shop: { select: { id: true, name: true, city: true } },
} satisfies Prisma.BookSelect;

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async search(dto: SearchBooksDto) {
    const page = dto.page ?? 1;
    const pageSize = dto.pageSize ?? 12;
    const q = dto.q?.trim();

    const where: Prisma.BookWhereInput = {
      published: true,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { author: { contains: q, mode: 'insensitive' } },
              { isbn: { contains: q.replace(/[-\s]/g, '') } },
            ],
          }
        : {}),
      ...(dto.shopId ? { shopId: dto.shopId } : {}),
      ...(dto.inStock === 'true' ? { stock: { gt: 0 } } : {}),
      ...(dto.minPrice !== undefined || dto.maxPrice !== undefined
        ? { priceCents: { gte: dto.minPrice, lte: dto.maxPrice } }
        : {}),
    };

    const orderBy: Prisma.BookOrderByWithRelationInput[] = (() => {
      switch (dto.sort) {
        case 'price_asc':
          return [{ priceCents: 'asc' }];
        case 'price_desc':
          return [{ priceCents: 'desc' }];
        case 'newest':
          return [{ createdAt: 'desc' }];
        case 'title':
          return [{ title: 'asc' }];
        default:
          return [{ stock: 'desc' }, { title: 'asc' }];
      }
    })();

    const [items, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: PUBLIC_BOOK_SELECT,
      }),
      this.prisma.book.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findFirst({
      where: { id, published: true },
      select: PUBLIC_BOOK_SELECT,
    });
    if (!book) {
      throw new NotFoundException('Buch nicht gefunden.');
    }
    return book;
  }
}
