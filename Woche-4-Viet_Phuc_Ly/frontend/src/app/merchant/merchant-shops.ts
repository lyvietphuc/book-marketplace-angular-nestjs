import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MerchantService } from './merchant.service';
import { MerchantShop } from './merchant.models';
import { ShopFormDialog } from './shop-form-dialog';
import { toErrorMessage } from '../auth/auth.service';

@Component({
  selector: 'app-merchant-shops',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="header">
      <h1 class="page-title">Meine Shops</h1>
      <button mat-flat-button (click)="openForm(null)"><mat-icon>add</mat-icon> Neuer Shop</button>
    </div>
    @if (errorMessage()) {
      <p class="error-box" role="alert">{{ errorMessage() }}</p>
    }
    <div class="grid">
      @for (shop of shops(); track shop.id) {
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon mat-card-avatar class="avatar">storefront</mat-icon>
            <mat-card-title>{{ shop.name }}</mat-card-title>
            <mat-card-subtitle>{{ shop.city }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="description">{{ shop.description || 'Keine Beschreibung' }}</p>
            <div class="stats">
              <span
                ><strong>{{ shop._count.books }}</strong> Bücher</span
              >
              <span
                ><strong>{{ shop._count.orders }}</strong> offene Bestellungen</span
              >
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="openForm(shop)">
              <mat-icon>edit</mat-icon> Bearbeiten
            </button>
            <a mat-button [routerLink]="['/shops', shop.id]"
              ><mat-icon>visibility</mat-icon> Ansehen</a
            >
          </mat-card-actions>
        </mat-card>
      } @empty {
        <p>Sie haben noch keinen Shop. Legen Sie jetzt Ihren ersten Shop an!</p>
      }
    </div>
  `,
  styles: `
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    mat-card {
      background: #fff;
    }
    .avatar {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .description {
      color: var(--mat-sys-on-surface-variant);
      min-height: 40px;
    }
    .stats {
      display: flex;
      gap: 16px;
      font-size: 13px;
    }
  `,
})
export class MerchantShops implements OnInit {
  private api = inject(MerchantService);
  private dialog = inject(MatDialog);

  shops = signal<MerchantShop[]>([]);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getShops().subscribe({
      next: (shops) => this.shops.set(shops),
      error: (err) => this.errorMessage.set(toErrorMessage(err)),
    });
  }

  openForm(shop: MerchantShop | null) {
    this.dialog
      .open(ShopFormDialog, { data: shop })
      .afterClosed()
      .subscribe((saved) => {
        if (saved) this.load();
      });
  }
}
