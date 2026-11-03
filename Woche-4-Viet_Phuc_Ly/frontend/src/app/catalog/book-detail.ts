import { Component, inject, input, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CatalogService } from '../core/catalog.service';
import { Book } from '../core/models';
import { BookCover } from '../core/book-cover';
import { EuroPipe } from '../core/euro.pipe';
import { toErrorMessage } from '../auth/auth.service';
import { AddToCartButton } from '../cart/add-to-cart-button';

/** Detailseite eines Buchs: /buch/:id (id kommt per Component-Input-Binding aus der Route) */
@Component({
  selector: 'app-book-detail',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    BookCover,
    EuroPipe,
    AddToCartButton,
  ],
  template: `
    <a mat-button routerLink="/"><mat-icon>arrow_back</mat-icon> Zur Suche</a>
    @if (book(); as b) {
      <div class="detail">
        <app-book-cover class="cover" [title]="b.title" [author]="b.author" [url]="b.coverUrl" />
        <div class="info">
          <h1>{{ b.title }}</h1>
          <p class="author">von {{ b.author }}</p>
          <mat-divider />
          <p class="description">{{ b.description }}</p>
          <dl>
            <dt>ISBN</dt>
            <dd>{{ b.isbn ?? '–' }}</dd>
            <dt>Verkäufer</dt>
            <dd>
              <a [routerLink]="['/shops', b.shop.id]">{{ b.shop.name }}</a> ({{ b.shop.city }})
            </dd>
          </dl>
        </div>
        <aside class="buybox">
          <div class="price">{{ b.priceCents | euro }}</div>
          <div class="hint">inkl. 7 % MwSt. · Versand ab 20 € kostenlos</div>
          @if (b.stock > 0) {
            <div class="stock ok">Auf Lager ({{ b.stock }} Stück)</div>
          } @else {
            <div class="stock out">Derzeit nicht verfügbar</div>
          }
          <app-add-to-cart-button [book]="b" />
        </aside>
      </div>
    } @else if (errorMessage()) {
      <p class="error" role="alert">{{ errorMessage() }}</p>
    } @else {
      <p>Lade Buch …</p>
    }
  `,
  styles: `
    .detail {
      display: grid;
      grid-template-columns: 220px 1fr 260px;
      gap: 32px;
      margin-top: 16px;
      align-items: start;
    }
    h1 {
      font: var(--mat-sys-headline-medium);
      margin: 0 0 4px;
    }
    .author {
      color: var(--mat-sys-on-surface-variant);
      margin: 0 0 16px;
    }
    .description {
      line-height: 1.6;
    }
    dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 6px 16px;
    }
    dt {
      color: var(--mat-sys-on-surface-variant);
    }
    dd {
      margin: 0;
    }
    .buybox {
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .price {
      font: var(--mat-sys-headline-small);
    }
    .hint {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }
    .stock.ok {
      color: #1e7b34;
    }
    .stock.out {
      color: #b3261e;
    }
    .error {
      background: #fdecea;
      color: #b3261e;
      padding: 8px 12px;
      border-radius: 4px;
    }
    @media (max-width: 900px) {
      .detail {
        grid-template-columns: 1fr;
      }
      .cover {
        max-width: 220px;
      }
    }
  `,
})
export class BookDetail {
  private catalog = inject(CatalogService);

  id = input.required<string>();
  book = signal<Book | null>(null);
  errorMessage = signal<string | null>(null);

  constructor() {
    effect((onCleanup) => {
      const sub = this.catalog.getBook(Number(this.id())).subscribe({
        next: (b) => this.book.set(b),
        error: (err) => this.errorMessage.set(toErrorMessage(err)),
      });
      onCleanup(() => sub.unsubscribe());
    });
  }
}
