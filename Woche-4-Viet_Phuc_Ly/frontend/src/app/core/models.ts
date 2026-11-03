/** Datentypen, wie sie vom Backend kommen. Geld immer in Cent. */

export interface ShopRef {
  id: number;
  name: string;
  city: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  coverUrl: string | null;
  priceCents: number;
  stock: number;
  createdAt: string;
  shop: ShopRef;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Shop extends ShopRef {
  description: string | null;
  _count?: { books: number };
}

export interface ShopWithBooks extends Shop {
  books: Book[];
}

export type BookSort = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'title';

export interface BookSearch {
  q?: string;
  shopId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: BookSort;
  page?: number;
  pageSize?: number;
}
