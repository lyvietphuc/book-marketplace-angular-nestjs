import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EuroPipe } from '../core/euro.pipe';
import { Order, STATUS_LABELS } from '../orders/orders.models';
import { AdminCustomer } from './admin.models';
import { AdminService } from './admin.service';

/** Übersicht über alle Kunden und ihre Bestellungen */
@Component({
  selector: 'app-admin-customers',
  imports: [DatePipe, MatIconModule, MatButtonModule, EuroPipe],
  templateUrl: './admin-customers.html',
  styleUrl: './admin-table.scss',
})
export class AdminCustomers {
  private api = inject(AdminService);
  readonly statusLabels = STATUS_LABELS;

  customers = toSignal(this.api.customers(), { initialValue: [] });
  selected = signal<AdminCustomer | null>(null);
  orders = signal<Order[]>([]);
  loading = signal(false);

  toggle(customer: AdminCustomer) {
    if (this.selected()?.id === customer.id) {
      this.selected.set(null);
      return;
    }
    this.selected.set(customer);
    this.orders.set([]);
    this.loading.set(true);
    this.api.customerOrders(customer.id).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
