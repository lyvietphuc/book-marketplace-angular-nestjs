import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MerchantService } from './merchant.service';
import { MerchantBook, MerchantShop } from './merchant.models';
import { BookFormDialog } from './book-form-dialog';
import { ConfirmDialog } from '../core/confirm-dialog';
import { EuroPipe } from '../core/euro.pipe';
import { toErrorMessage } from '../auth/auth.service';

@Component({
  selector: 'app-merchant-books',
  imports: [
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    EuroPipe,
  ],
  templateUrl: './merchant-books.html',
  styles: `
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .toolbar {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .toolbar mat-form-field {
      width: 260px;
    }
    .title {
      font-weight: 500;
    }
    .sub {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }
    .low {
      color: #b25e00;
      font-weight: 500;
    }
    .zero {
      color: #b3261e;
      font-weight: 500;
    }
    .hidden {
      color: var(--mat-sys-on-surface-variant);
      font-style: italic;
    }
    td.actions {
      white-space: nowrap;
      text-align: right;
    }
    .empty {
      padding: 24px;
      text-align: center;
      color: var(--mat-sys-on-surface-variant);
    }
  `,
})
export class MerchantBooks implements OnInit {
  private api = inject(MerchantService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  books = signal<MerchantBook[]>([]);
  shops = signal<MerchantShop[]>([]);
  errorMessage = signal<string | null>(null);

  filterText = signal('');
  filterShop = signal<number | null>(null);

  readonly columns = ['title', 'shop', 'price', 'stock', 'status', 'actions'];

  filtered = computed(() => {
    const text = this.filterText().trim().toLowerCase();
    const shop = this.filterShop();
    return this.books().filter(
      (b) =>
        (shop === null || b.shopId === shop) &&
        (!text || b.title.toLowerCase().includes(text) || b.author.toLowerCase().includes(text)),
    );
  });

  ngOnInit() {
    this.api.getShops().subscribe((shops) => this.shops.set(shops));
    this.load();
  }

  load() {
    this.api.getBooks().subscribe({
      next: (books) => this.books.set(books),
      error: (err) => this.errorMessage.set(toErrorMessage(err)),
    });
  }

  openForm(book: MerchantBook | null) {
    if (this.shops().length === 0) {
      this.snack.open('Bitte legen Sie zuerst einen Shop an.', 'OK', { duration: 4000 });
      return;
    }
    this.dialog
      .open(BookFormDialog, { data: { book, shops: this.shops() }, width: '680px' })
      .afterClosed()
      .subscribe((saved) => {
        if (saved) {
          this.snack.open(book ? 'Buch gespeichert.' : 'Buch angelegt.', undefined, {
            duration: 2500,
          });
          this.load();
        }
      });
  }

  remove(book: MerchantBook) {
    this.dialog
      .open(ConfirmDialog, {
        data: {
          title: 'Buch löschen?',
          message: `„${book.title}“ wird aus Ihrem Angebot entfernt. Bestehende Bestellungen bleiben erhalten.`,
          confirmLabel: 'Löschen',
        },
      })
      .afterClosed()
      .subscribe((ok) => {
        if (!ok) return;
        this.api.deleteBook(book.id).subscribe({
          next: () => {
            this.snack.open('Buch gelöscht.', undefined, { duration: 2500 });
            this.load();
          },
          error: (err) => this.snack.open(toErrorMessage(err), 'OK'),
        });
      });
  }
}
