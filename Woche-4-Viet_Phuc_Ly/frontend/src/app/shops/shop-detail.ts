import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CatalogService } from '../core/catalog.service';
import { ShopWithBooks } from '../core/models';
import { BookCard } from '../catalog/book-card';
import { AddToCartButton } from '../cart/add-to-cart-button';
import { toErrorMessage } from '../auth/auth.service';

@Component({
  selector: 'app-shop-detail',
  imports: [RouterLink, MatButtonModule, MatIconModule, BookCard, AddToCartButton],
  template: `
    <a mat-button routerLink="/shops"><mat-icon>arrow_back</mat-icon> Alle Shops</a>
    @if (shop(); as s) {
      <header class="shop-header">
        <mat-icon class="icon">storefront</mat-icon>
        <div>
          <h1>{{ s.name }}</h1>
          <p>{{ s.city }} · {{ s.books.length }} Bücher im Angebot</p>
          <p class="description">{{ s.description }}</p>
        </div>
      </header>
      <div class="grid">
        @for (book of s.books; track book.id) {
          <app-book-card [book]="book">
            <app-add-to-cart-button [book]="book" />
          </app-book-card>
        } @empty {
          <p>Dieser Shop bietet derzeit keine Bücher an.</p>
        }
      </div>
    } @else if (errorMessage()) {
      <p class="error" role="alert">{{ errorMessage() }}</p>
    }
  `,
  styles: `
    .shop-header {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      padding: 16px;
      background: var(--mat-sys-surface-container-low);
      border-radius: 12px;
      margin: 8px 0 16px;
    }
    .icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--mat-sys-primary);
    }
    h1 {
      font: var(--mat-sys-headline-small);
      margin: 0;
    }
    p {
      margin: 4px 0;
      color: var(--mat-sys-on-surface-variant);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
      gap: 16px;
    }
    .error {
      background: #fdecea;
      color: #b3261e;
      padding: 8px 12px;
      border-radius: 4px;
    }
  `,
})
export class ShopDetail {
  private catalog = inject(CatalogService);
  id = input.required<string>();
  shop = signal<ShopWithBooks | null>(null);
  errorMessage = signal<string | null>(null);

  constructor() {
    effect((onCleanup) => {
      const sub = this.catalog.getShop(Number(this.id())).subscribe({
        next: (s) => this.shop.set(s),
        error: (err) => this.errorMessage.set(toErrorMessage(err)),
      });
      onCleanup(() => sub.unsubscribe());
    });
  }
}
