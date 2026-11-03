import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EuroPipe } from '../core/euro.pipe';
import { toErrorMessage } from '../auth/auth.service';
import { Order, OrderStatus, STATUS_LABELS } from '../orders/orders.models';
import { MerchantService } from './merchant.service';

/** Bestellabwicklung: offene und versendete Bestellungen, Versandlabel */
@Component({
  selector: 'app-merchant-orders',
  imports: [
    DatePipe,
    NgTemplateOutlet,
    MatTabsModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    EuroPipe,
  ],
  templateUrl: './merchant-orders.html',
  styleUrl: './merchant-orders.scss',
})
export class MerchantOrders implements OnInit {
  private api = inject(MerchantService);
  private snack = inject(MatSnackBar);

  orders = signal<Order[]>([]);
  errorMessage = signal<string | null>(null);
  busy = signal<number | null>(null);

  open = computed(() => this.orders().filter((o) => o.status === 'OPEN'));
  // versendete: neueste zuerst
  shipped = computed(() =>
    this.orders()
      .filter((o) => o.status === 'SHIPPED')
      .sort((a, b) => (b.shippedAt ?? '').localeCompare(a.shippedAt ?? '')),
  );

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getOrders().subscribe({
      next: (orders) => this.orders.set(orders),
      error: (err) => this.errorMessage.set(toErrorMessage(err)),
    });
  }

  setStatus(order: Order, status: OrderStatus) {
    this.busy.set(order.id);
    this.api.setOrderStatus(order.id, status).subscribe({
      next: (updated) => {
        this.busy.set(null);
        this.orders.update((list) => list.map((o) => (o.id === updated.id ? updated : o)));
        this.snack.open(
          status === 'SHIPPED'
            ? `${order.orderNumber} als versendet markiert.`
            : `${order.orderNumber} wieder geöffnet.`,
          undefined,
          { duration: 2500 },
        );
      },
      error: (err) => {
        this.busy.set(null);
        this.snack.open(toErrorMessage(err), 'OK');
      },
    });
  }

  label(order: Order) {
    this.api.downloadLabel(order).subscribe({
      error: (err) => this.snack.open(toErrorMessage(err), 'OK'),
    });
  }

  statusLabel(status: OrderStatus): string {
    return STATUS_LABELS[status];
  }

  itemCount(order: Order): number {
    return order.items.reduce((n, i) => n + i.quantity, 0);
  }
}
