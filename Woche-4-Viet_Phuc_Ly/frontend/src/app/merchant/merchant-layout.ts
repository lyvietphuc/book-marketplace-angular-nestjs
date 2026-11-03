import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

/** Rahmen für den Händlerbereich: Navigation links, Inhalt rechts */
@Component({
  selector: 'app-merchant-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="area">
      <nav class="side">
        <div class="area-title">Händlerbereich</div>
        @for (link of links; track link.path) {
          <a [routerLink]="link.path" routerLinkActive="active">
            <mat-icon>{{ link.icon }}</mat-icon
            >{{ link.label }}
          </a>
        }
      </nav>
      <section class="main"><router-outlet /></section>
    </div>
  `,
  styleUrl: '../core/area-layout.scss',
})
export class MerchantLayout {
  readonly links = [
    { path: 'dashboard', icon: 'insights', label: 'Dashboard' },
    { path: 'bestellungen', icon: 'local_shipping', label: 'Bestellungen' },
    { path: 'buecher', icon: 'menu_book', label: 'Bücher' },
    { path: 'shops', icon: 'storefront', label: 'Meine Shops' },
  ];
}
