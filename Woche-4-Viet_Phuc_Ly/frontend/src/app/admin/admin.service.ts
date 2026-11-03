import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/api';
import { Order } from '../orders/orders.models';
import { AdminCustomer, AdminMerchant, AdminOverview } from './admin.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private url = `${API_URL}/admin`;

  overview() {
    return this.http.get<AdminOverview>(`${this.url}/overview`);
  }

  merchants() {
    return this.http.get<AdminMerchant[]>(`${this.url}/merchants`);
  }

  customers() {
    return this.http.get<AdminCustomer[]>(`${this.url}/customers`);
  }

  customerOrders(id: number) {
    return this.http.get<Order[]>(`${this.url}/customers/${id}/orders`);
  }
}
