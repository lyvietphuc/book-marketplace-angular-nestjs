export interface AdminOverview {
  merchants: number;
  customers: number;
  shops: number;
  books: number;
  orders: number;
  openOrders: number;
  revenueCents: number;
}

export interface AdminShop {
  id: number;
  name: string;
  city: string;
  books: number;
  orders: number;
  openOrders: number;
  revenueCents: number;
}

export interface AdminMerchant {
  id: number;
  name: string | null;
  email: string;
  createdAt: string;
  shops: AdminShop[];
  books: number;
  orders: number;
  openOrders: number;
  revenueCents: number;
}

export interface AdminCustomer {
  id: number;
  name: string | null;
  email: string;
  createdAt: string;
  orders: number;
  totalSpentCents: number;
  lastOrderAt: string | null;
}
