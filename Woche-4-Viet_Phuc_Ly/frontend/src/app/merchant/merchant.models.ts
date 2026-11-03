import { ShopRef } from '../core/models';

export interface MerchantShop extends ShopRef {
  description: string | null;
  createdAt: string;
  _count: { books: number; orders: number }; // orders = offene Bestellungen
}

export interface MerchantBook {
  id: number;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  coverUrl: string | null;
  priceCents: number;
  stock: number;
  published: boolean;
  shopId: number;
  shop: ShopRef;
}

export interface ShopInput {
  name: string;
  city: string;
  description?: string;
}

export interface BookInput {
  shopId: number;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  coverUrl?: string;
  priceCents: number;
  stock: number;
  published: boolean;
}

export interface MerchantStats {
  days: number;
  totals: {
    revenueCents: number;
    orderCount: number;
    itemsSold: number;
    averageOrderCents: number;
    openOrders: number;
  };
  perDay: { date: string; revenueCents: number; orders: number }[];
  perBook: { bookId: number | null; title: string; quantity: number; revenueCents: number }[];
}
