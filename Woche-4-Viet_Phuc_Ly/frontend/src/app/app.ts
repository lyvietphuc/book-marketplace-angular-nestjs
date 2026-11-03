import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from './cart/cart.service';
import { AuthService, ROLE_LABELS } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  auth = inject(AuthService);
  cart = inject(CartService);
  private router = inject(Router);
  readonly roleLabels = ROLE_LABELS;

  searchText = '';

  constructor() {
    // Suchfeld mit dem Suchbegriff in der URL synchron halten (z. B. nach Zurück-Button)
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        const tree = this.router.parseUrl(this.router.url);
        this.searchText = tree.queryParamMap.get('q') ?? '';
      });
  }

  search() {
    const q = this.searchText.trim();
    this.router.navigate(['/'], { queryParams: q ? { q } : {} });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
