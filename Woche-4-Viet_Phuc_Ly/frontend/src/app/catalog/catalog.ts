import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CatalogService } from '../core/catalog.service';
import { Book, BookSort } from '../core/models';
import { toErrorMessage } from '../auth/auth.service';
import { BookCard } from './book-card';
import { AddToCartButton } from '../cart/add-to-cart-button';

/**
 * Startseite / Suche. Alle Filter stehen in der URL (?q=...&sort=...),
 * dadurch sind Suchergebnisse verlinkbar und der Zurück-Button funktioniert.
 */
@Component({
  selector: 'app-catalog',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    BookCard,
    AddToCartButton,
  ],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog {
  private catalog = inject(CatalogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private params = toSignal(this.route.queryParamMap, { requireSync: true });

  shops = toSignal(this.catalog.getShops(), { initialValue: [] });

  // aktuelle Filter aus der URL
  q = computed(() => this.params().get('q') ?? '');
  sort = computed(() => (this.params().get('sort') as BookSort | null) ?? 'relevance');
  shopId = computed(() => numberOrUndefined(this.params().get('shopId')));
  inStock = computed(() => this.params().get('inStock') === 'true');
  minPrice = computed(() => numberOrUndefined(this.params().get('min')));
  maxPrice = computed(() => numberOrUndefined(this.params().get('max')));
  page = computed(() => numberOrUndefined(this.params().get('page')) ?? 1);
  readonly pageSize = 12;

  books = signal<Book[]>([]);
  total = signal(0);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  readonly sorts: { value: BookSort; label: string }[] = [
    { value: 'relevance', label: 'Empfehlung' },
    { value: 'price_asc', label: 'Preis: aufsteigend' },
    { value: 'price_desc', label: 'Preis: absteigend' },
    { value: 'newest', label: 'Neueste zuerst' },
    { value: 'title', label: 'Titel A–Z' },
  ];

  constructor() {
    // Bei jeder Änderung der URL-Parameter neu suchen
    effect((onCleanup) => {
      this.loading.set(true);
      this.errorMessage.set(null);
      const sub = this.catalog
        .searchBooks({
          q: this.q() || undefined,
          sort: this.sort(),
          shopId: this.shopId(),
          inStock: this.inStock(),
          minPrice: this.minPrice() !== undefined ? this.minPrice()! * 100 : undefined,
          maxPrice: this.maxPrice() !== undefined ? this.maxPrice()! * 100 : undefined,
          page: this.page(),
          pageSize: this.pageSize,
        })
        .subscribe({
          next: (res) => {
            this.books.set(res.items);
            this.total.set(res.total);
            this.loading.set(false);
          },
          error: (err) => {
            this.errorMessage.set(toErrorMessage(err));
            this.loading.set(false);
          },
        });
      onCleanup(() => sub.unsubscribe());
    });
  }

  /** Filter ändern = URL ändern (Seite wieder auf 1) */
  setFilter(changes: Record<string, string | number | boolean | null | undefined>) {
    const queryParams: Record<string, string | number | null> = { page: null };
    for (const [key, value] of Object.entries(changes)) {
      queryParams[key] =
        value === undefined || value === '' || value === false ? null : (value as string | number);
    }
    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }

  onPage(event: PageEvent) {
    this.router.navigate([], {
      queryParams: { page: event.pageIndex + 1 },
      queryParamsHandling: 'merge',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetFilters() {
    this.router.navigate([], { queryParams: this.q() ? { q: this.q() } : {} });
  }
}

function numberOrUndefined(value: string | null): number | undefined {
  if (value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
