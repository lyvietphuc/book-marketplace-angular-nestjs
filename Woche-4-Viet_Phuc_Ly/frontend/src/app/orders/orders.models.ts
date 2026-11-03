import { ShopRef } from '../core/models';

export type OrderStatus = 'OPEN' | 'SHIPPED';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  OPEN: 'Offen',
  SHIPPED: 'Versendet',
};

export interface OrderItem {
  id: number;
  bookId: number | null;
  title: string;
  author: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  checkoutId: string;
  status: OrderStatus;
  shippingName: string;
  shippingStreet: string;
  shippingZip: string;
  shippingCity: string;
  shippingCountry: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  createdAt: string;
  shippedAt: string | null;
  shop: ShopRef;
  items: OrderItem[];
}

export interface ShippingAddress {
  name: string;
  street: string;
  zip: string;
  city: string;
  country?: string;
}

export interface CheckoutResult {
  checkoutId: string;
  orders: { id: number; orderNumber: string; totalCents: number }[];
}
