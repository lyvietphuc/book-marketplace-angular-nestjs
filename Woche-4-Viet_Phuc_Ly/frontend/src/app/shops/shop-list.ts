import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CatalogService } from '../core/catalog.service';

@Component({
  selector: 'app-shop-list',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <h1>Unsere Buchhandlungen</h1>
    <p class="lead">Auf „Amazing“ verkaufen unabhängige Buchhandlungen aus ganz Deutschland.</p>
    <div class="grid">
      @for (shop of shops(); track shop.id) {
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon mat-card-avatar class="avatar">storefront</mat-icon>
            <mat-card-title>{{ shop.name }}</mat-card-title>
            <mat-card-subtitle
              >{{ shop.city }} · {{ shop._count?.books ?? 0 }} Bücher</mat-card-subtitle
            >
          </mat-card-header>
          <mat-card-content>
            <p>{{ shop.description }}</p>
          </mat-card-content>
          <mat-card-actions>
            <a mat-flat-button [routerLink]="['/shops', shop.id]">Zum Shop</a>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styles: `
    h1 {
      font: var(--mat-sys-headline-medium);
      margin-bottom: 4px;
    }
    .lead {
      color: var(--mat-sys-on-surface-variant);
      margin-top: 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    .avatar {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
})
export class ShopList {
  shops = toSignal(inject(CatalogService).getShops(), { initialValue: [] });
}
