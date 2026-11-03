import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { EuroPipe } from '../core/euro.pipe';
import { AdminService } from './admin.service';

/** Übersicht über alle Händler und ihre Shops */
@Component({
  selector: 'app-admin-merchants',
  imports: [DatePipe, MatExpansionModule, MatIconModule, EuroPipe],
  template: `
    <h1 class="page-title">Händler</h1>
    <div class="table-card">
      <table class="list">
        <thead>
          <tr>
            <th>Händler</th>
            <th>Shops</th>
            <th>Bücher</th>
            <th>Bestellungen</th>
            <th>Offen</th>
            <th>Umsatz</th>
          </tr>
        </thead>
        <tbody>
          @for (m of merchants(); track m.id) {
            <tr class="merchant">
              <td>
                <strong>{{ m.name ?? '–' }}</strong>
                <div class="sub">{{ m.email }} · seit {{ m.createdAt | date: 'dd.MM.yyyy' }}</div>
              </td>
              <td>{{ m.shops.length }}</td>
              <td>{{ m.books }}</td>
              <td>{{ m.orders }}</td>
              <td>
                @if (m.openOrders > 0) {
                  <span class="status-chip open">{{ m.openOrders }}</span>
                } @else {
                  0
                }
              </td>
              <td>
                <strong>{{ m.revenueCents | euro }}</strong>
              </td>
            </tr>
            @for (s of m.shops; track s.id) {
              <tr class="shop">
                <td>
                  <mat-icon>subdirectory_arrow_right</mat-icon> {{ s.name }}
                  <span class="sub">({{ s.city }})</span>
                </td>
                <td></td>
                <td>{{ s.books }}</td>
                <td>{{ s.orders }}</td>
                <td>{{ s.openOrders }}</td>
                <td>{{ s.revenueCents | euro }}</td>
              </tr>
            }
          } @empty {
            <tr>
              <td colspan="6" class="empty">Keine Händler registriert.</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrl: './admin-table.scss',
})
export class AdminMerchants {
  merchants = toSignal(inject(AdminService).merchants(), { initialValue: [] });
}
