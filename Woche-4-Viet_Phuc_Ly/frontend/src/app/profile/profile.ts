import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, ROLE_LABELS, toErrorMessage, User } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, MatCardModule, MatButtonModule],
  template: `
    <mat-card appearance="outlined" class="profile-card">
      <mat-card-header>
        <mat-card-title>Mein Profil</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (user(); as u) {
          <dl>
            <dt>ID</dt>
            <dd>{{ u.id }}</dd>
            <dt>Name</dt>
            <dd>{{ u.name ?? '–' }}</dd>
            <dt>Kontotyp</dt>
            <dd>{{ roleLabels[u.role] }}</dd>
            <dt>E-Mail</dt>
            <dd>{{ u.email }}</dd>
            <dt>Registriert seit</dt>
            <dd>{{ u.createdAt | date: 'dd.MM.yyyy, HH:mm' }}</dd>
          </dl>
        } @else if (errorMessage()) {
          <p class="error" role="alert">{{ errorMessage() }}</p>
        } @else {
          <p>Lade Profil …</p>
        }
      </mat-card-content>
      <mat-card-actions>
        <button mat-stroked-button (click)="logout()">Logout</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    .profile-card {
      max-width: 420px;
      margin: 24px auto;
    }
    dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 8px 16px;
    }
    dt {
      font-weight: 500;
    }
    dd {
      margin: 0;
    }
    .error {
      background: #fdecea;
      color: #b3261e;
      padding: 8px 12px;
      border-radius: 4px;
    }
  `,
})
export class Profile implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly roleLabels = ROLE_LABELS;
  user = signal<User | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    // GET /auth/me – der Interceptor hängt das Token automatisch an
    this.auth.me().subscribe({
      next: (u) => this.user.set(u),
      error: (err) => this.errorMessage.set(toErrorMessage(err)),
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
