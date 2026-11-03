import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/api';
import { BookInput, MerchantBook, MerchantShop, MerchantStats, ShopInput } from './merchant.models';
import { Order, OrderStatus } from '../orders/orders.models';
import { downloadFile } from '../core/download';

/** API für den Händlerbereich (/merchant/...). Token hängt der Interceptor an. */
@Injectable({ providedIn: 'root' })
export class MerchantService {
  private http = inject(HttpClient);
  private url = `${API_URL}/merchant`;

  getShops() {
    return this.http.get<MerchantShop[]>(`${this.url}/shops`);
  }

  createShop(data: ShopInput) {
    return this.http.post<MerchantShop>(`${this.url}/shops`, data);
  }

  updateShop(id: number, data: Partial<ShopInput>) {
    return this.http.patch<MerchantShop>(`${this.url}/shops/${id}`, data);
  }

  getBooks() {
    return this.http.get<MerchantBook[]>(`${this.url}/books`);
  }

  createBook(data: BookInput) {
    return this.http.post<MerchantBook>(`${this.url}/books`, data);
  }

  updateBook(id: number, data: Partial<BookInput>) {
    return this.http.patch<MerchantBook>(`${this.url}/books/${id}`, data);
  }

  deleteBook(id: number) {
    return this.http.delete<{ deleted: boolean }>(`${this.url}/books/${id}`);
  }

  getOrders(status?: OrderStatus) {
    return this.http.get<Order[]>(`${this.url}/orders`, { params: status ? { status } : {} });
  }

  setOrderStatus(id: number, status: OrderStatus) {
    return this.http.patch<Order>(`${this.url}/orders/${id}/status`, { status });
  }

  downloadLabel(order: Order) {
    return downloadFile(
      this.http,
      `${this.url}/orders/${order.id}/label`,
      `Versandlabel-${order.orderNumber}.pdf`,
    );
  }

  getStats(days: number) {
    return this.http.get<MerchantStats>(`${this.url}/stats`, { params: { days } });
  }
}
