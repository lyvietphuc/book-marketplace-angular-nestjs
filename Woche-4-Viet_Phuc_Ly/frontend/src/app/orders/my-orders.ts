import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EuroPipe } from '../core/euro.pipe';
import { toErrorMessage } from '../auth/auth.service';
import { OrdersService } from './orders.service';
import { Order, STATUS_LABELS } from './orders.models';

/** Bestellhistorie des Kunden */
@Component({
  selector: 'app-my-orders',
  imports: [DatePipe, RouterLink, MatExpansionModule, MatButtonModule, MatIconModule, EuroPipe],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss',
})
export class MyOrders implements OnInit {
  private api = inject(OrdersService);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);

  readonly statusLabels = STATUS_LABELS;
  orders = signal<Order[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  /** checkoutId der gerade abgeschickten Bestellung (aus der URL) */
  newCheckout = this.route.snapshot.queryParamMap.get('neu');
  newOrders = computed(() => this.orders().filter((o) => o.checkoutId === this.newCheckout));

  ngOnInit() {
    this.api.getMine().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(toErrorMessage(err));
        this.loading.set(false);
      },
    });
  }

  /** id der Bestellung, deren Rechnung gerade geladen wird */
  downloading = signal<number | null>(null);

  downloadInvoice(order: Order) {
    this.downloading.set(order.id);
    this.api.downloadInvoice(order.id, order.orderNumber).subscribe({
      next: () => this.downloading.set(null),
      error: (err) => {
        this.downloading.set(null);
        this.snack.open(toErrorMessage(err), 'OK', { duration: 4000 });
      },
    });
  }
}
