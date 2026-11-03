import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { EuroPipe } from '../core/euro.pipe';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin-overview',
  imports: [RouterLink, MatIconModule, EuroPipe],
  template: `
    <h1 class="page-title">Marktplatz-Übersicht</h1>
    @if (overview(); as o) {
      <div class="tiles">
        <a class="tile" routerLink="../haendler">
          <mat-icon>storefront</mat-icon>
          <span class="label">Händler</span><span class="value">{{ o.merchants }}</span>
          <span class="hint">{{ o.shops }} Shops · {{ o.books }} Bücher</span>
        </a>
        <a class="tile" routerLink="../kunden">
          <mat-icon>group</mat-icon>
          <span class="label">Kunden</span><span class="value">{{ o.customers }}</span>
          <span class="hint">registrierte Konten</span>
        </a>
        <div class="tile">
          <mat-icon>receipt_long</mat-icon>
          <span class="label">Bestellungen</span><span class="value">{{ o.orders }}</span>
          <span class="hint">davon {{ o.openOrders }} offen</span>
        </div>
        <div class="tile">
          <mat-icon>euro</mat-icon>
          <span class="label">Gesamtumsatz</span
          ><span class="value">{{ o.revenueCents | euro }}</span>
          <span class="hint">alle Shops, inkl. Versand</span>
        </div>
      </div>
    }
  `,
  styles: `
    .tiles {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }
    .tile {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px;
      background: #fff;
      color: inherit;
      text-decoration: none;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 12px;
    }
    a.tile:hover {
      border-color: var(--mat-sys-primary);
    }
    mat-icon {
      color: var(--mat-sys-primary);
    }
    .label {
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
    }
    .value {
      font: var(--mat-sys-headline-small);
      font-weight: 500;
    }
    .hint {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }
  `,
})
export class AdminOverviewPage {
  overview = toSignal(inject(AdminService).overview());
}
