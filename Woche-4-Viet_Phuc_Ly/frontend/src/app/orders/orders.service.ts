import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/api';
import { downloadFile } from '../core/download';
import { CheckoutResult, Order, ShippingAddress } from './orders.models';

/** Bestellungen aus Kundensicht */
@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);

  checkout(items: { bookId: number; quantity: number }[], shipping: ShippingAddress) {
    return this.http.post<CheckoutResult>(`${API_URL}/orders`, { items, shipping });
  }

  getMine() {
    return this.http.get<Order[]>(`${API_URL}/orders/mine`);
  }

  /** Rechnung als PDF herunterladen */
  downloadInvoice(orderId: number, orderNumber: string) {
    return downloadFile(
      this.http,
      `${API_URL}/orders/${orderId}/invoice`,
      `Rechnung-${orderNumber}.pdf`,
    );
  }
}
