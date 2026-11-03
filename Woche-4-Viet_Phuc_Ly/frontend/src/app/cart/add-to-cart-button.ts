import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';
import { Book } from '../core/models';
import { CartService } from './cart.service';

/** Button „In den Warenkorb“ – für Händler und Admins unsichtbar (sie können nicht kaufen) */
@Component({
  selector: 'app-add-to-cart-button',
  imports: [MatButtonModule, MatIconModule],
  template: `
    @if (!auth.hasRole('MERCHANT', 'ADMIN')) {
      <button mat-flat-button class="add" [disabled]="soldOut()" (click)="add($event)">
        <mat-icon>add_shopping_cart</mat-icon>
        {{ soldOut() ? 'Ausverkauft' : 'In den Warenkorb' }}
      </button>
    }
  `,
  styles: `
    .add {
      width: 100%;
      background: #f59e0b;
      color: #1f2937;
    }
    .add:disabled {
      background: var(--mat-sys-surface-container-high);
      color: var(--mat-sys-on-surface-variant);
    }
  `,
})
export class AddToCartButton {
  auth = inject(AuthService);
  private cart = inject(CartService);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  book = input.required<Book>();

  /** ausverkauft, wenn kein Bestand */
  soldOut = computed(() => this.book().stock === 0);

  add(event: Event) {
    event.stopPropagation();
    const book = this.book();
    if (this.cart.quantityOf(book.id) >= book.stock) {
      this.snack.open(`Mehr als ${book.stock} Stück sind nicht verfügbar.`, 'OK', {
        duration: 3000,
      });
      return;
    }
    this.cart.add(book);
    this.snack
      .open(`„${book.title}“ liegt im Warenkorb.`, 'Zum Warenkorb', { duration: 3000 })
      .onAction()
      .subscribe(() => this.router.navigate(['/warenkorb']));
  }
}
