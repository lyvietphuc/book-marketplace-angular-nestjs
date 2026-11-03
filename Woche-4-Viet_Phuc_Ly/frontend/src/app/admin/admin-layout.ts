import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="area">
      <nav class="side">
        <div class="area-title">Administration</div>
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
export class AdminLayout {
  readonly links = [
    { path: 'uebersicht', icon: 'space_dashboard', label: 'Übersicht' },
    { path: 'haendler', icon: 'storefront', label: 'Händler' },
    { path: 'kunden', icon: 'group', label: 'Kunden' },
  ];
}
