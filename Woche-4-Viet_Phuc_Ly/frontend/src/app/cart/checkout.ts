import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService, toErrorMessage } from '../auth/auth.service';
import { EuroPipe } from '../core/euro.pipe';
import { OrdersService } from '../orders/orders.service';
import { CartService } from './cart.service';

/** Kasse: Lieferadresse eingeben und Bestellung abschicken (ohne Bezahlung) */
@Component({
  selector: 'app-checkout',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    EuroPipe,
  ],
  templateUrl: './checkout.html',
  styleUrl: './cart-page.scss',
  styles: `
    form.address {
      background: #fff;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 12px;
      padding: 16px;
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 4px 12px;
    }
    .full {
      grid-column: 1 / -1;
    }
    h2 {
      font: var(--mat-sys-title-large);
      margin: 0 0 8px;
      grid-column: 1 / -1;
    }
    .line {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }
    .shop {
      font-weight: 500;
      margin-top: 8px;
    }
    .no-payment {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }
  `,
})
export class Checkout {
  private fb = inject(FormBuilder);
  private orders = inject(OrdersService);
  private router = inject(Router);
  private auth = inject(AuthService);
  cart = inject(CartService);

  form = this.fb.nonNullable.group({
    name: [this.auth.displayName() ?? '', [Validators.required, Validators.maxLength(100)]],
    street: ['', [Validators.required, Validators.maxLength(120)]],
    zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    city: ['', [Validators.required, Validators.maxLength(80)]],
    country: ['Deutschland', [Validators.required]],
  });

  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  placeOrder() {
    this.errorMessage.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const items = this.cart.items().map((i) => ({ bookId: i.bookId, quantity: i.quantity }));
    this.submitting.set(true);
    this.orders.checkout(items, this.form.getRawValue()).subscribe({
      next: (result) => {
        this.cart.clear();
        this.router.navigate(['/bestellungen'], { queryParams: { neu: result.checkoutId } });
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(toErrorMessage(err));
      },
    });
  }
}
