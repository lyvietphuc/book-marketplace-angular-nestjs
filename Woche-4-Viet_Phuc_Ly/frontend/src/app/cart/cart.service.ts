import { computed, Injectable, signal } from '@angular/core';
import { Book, ShopRef } from '../core/models';

const CART_KEY = 'amazing_cart';
/** gleiche Regel wie im Backend (common/money.ts) – nur für die Anzeige */
export const FREE_SHIPPING_FROM_CENTS = 2000;
export const SHIPPING_CENTS = 299;

export interface CartItem {
  bookId: number;
  title: string;
  author: string;
  priceCents: number;
  stock: number;
  shop: ShopRef;
  quantity: number;
}

export interface CartGroup {
  shop: ShopRef;
  items: CartItem[];
  subtotalCents: number;
  shippingCents: number;
}

/**
 * Warenkorb im Browser (Signal + localStorage).
 * Preise hier sind nur zur Anzeige – beim Checkout rechnet das Backend mit den
 * aktuellen Preisen aus der Datenbank.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>(load());

  readonly count = computed(() => this.items().reduce((n, i) => n + i.quantity, 0));

  /** Pro Shop eine Gruppe – so entstehen später auch die Bestellungen */
  readonly groups = computed<CartGroup[]>(() => {
    const map = new Map<number, CartGroup>();
    for (const item of this.items()) {
      const group = map.get(item.shop.id) ?? {
        shop: item.shop,
        items: [],
        subtotalCents: 0,
        shippingCents: 0,
      };
      group.items.push(item);
      group.subtotalCents += item.priceCents * item.quantity;
      map.set(item.shop.id, group);
    }
    for (const group of map.values()) {
      group.shippingCents = group.subtotalCents >= FREE_SHIPPING_FROM_CENTS ? 0 : SHIPPING_CENTS;
    }
    return [...map.values()];
  });

  readonly subtotalCents = computed(() => this.groups().reduce((s, g) => s + g.subtotalCents, 0));
  readonly shippingCents = computed(() => this.groups().reduce((s, g) => s + g.shippingCents, 0));
  readonly totalCents = computed(() => this.subtotalCents() + this.shippingCents());

  quantityOf(bookId: number): number {
    return this.items().find((i) => i.bookId === bookId)?.quantity ?? 0;
  }

  add(book: Book, quantity = 1): void {
    const existing = this.items().find((i) => i.bookId === book.id);
    if (existing) {
      this.setQuantity(book.id, existing.quantity + quantity);
      return;
    }
    this.update([
      ...this.items(),
      {
        bookId: book.id,
        title: book.title,
        author: book.author,
        priceCents: book.priceCents,
        stock: book.stock,
        shop: book.shop,
        quantity: Math.min(quantity, book.stock),
      },
    ]);
  }

  setQuantity(bookId: number, quantity: number): void {
    this.update(
      this.items()
        .map((i) =>
          i.bookId === bookId
            ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock, 20)) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }

  remove(bookId: number): void {
    this.update(this.items().filter((i) => i.bookId !== bookId));
  }

  clear(): void {
    this.update([]);
  }

  private update(items: CartItem[]): void {
    this.items.set(items);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // localStorage nicht verfügbar -> Warenkorb nur im Speicher
    }
  }
}

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
