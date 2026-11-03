import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../core/api';

export { API_URL } from '../core/api';

const TOKEN_KEY = 'auth_token';
const NAME_KEY = 'auth_name';

/** einfache E-Mail-Prüfung: etwas@etwas.tld */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Role = 'CUSTOMER' | 'MERCHANT' | 'ADMIN';

export const ROLE_LABELS: Record<Role, string> = {
  CUSTOMER: 'Kunde',
  MERCHANT: 'Händler',
  ADMIN: 'Administrator',
};

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  role?: 'CUSTOMER' | 'MERCHANT';
}

export interface LoginRequest {
  email: string;
  password: string;
}

interface TokenPayload {
  sub: number;
  role: Role;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private url = `${API_URL}/auth`;

  // Hinweis: localStorage ist für die Übung ok, aber anfällig für XSS.
  // In echten Anwendungen sind HttpOnly-Cookies sicherer.
  private token = signal<string | null>(readStorage(TOKEN_KEY));

  /** Anzeigename für die Toolbar (keine sensiblen Daten) */
  readonly displayName = signal<string | null>(readStorage(NAME_KEY));

  private payload = computed(() => {
    const token = this.token();
    return token ? decodePayload(token) : null;
  });

  /** true, solange ein nicht abgelaufenes Token vorhanden ist */
  readonly isLoggedIn = computed(() => {
    const p = this.payload();
    return p !== null && p.exp * 1000 > Date.now();
  });

  /** Rolle aus dem Token – nur für die Anzeige. Die echte Prüfung macht das Backend (RolesGuard). */
  readonly role = computed<Role | null>(() =>
    this.isLoggedIn() ? (this.payload()?.role ?? null) : null,
  );

  hasRole(...roles: Role[]): boolean {
    const role = this.role();
    return role !== null && roles.includes(role);
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.url}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, data).pipe(
      tap((res) => {
        this.saveToken(res.accessToken);
        const name = res.user.name ?? res.user.email;
        writeStorage(NAME_KEY, name);
        this.displayName.set(name);
      }),
    );
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.url}/me`);
  }

  logout(): void {
    removeStorage(TOKEN_KEY);
    removeStorage(NAME_KEY);
    this.token.set(null);
    this.displayName.set(null);
  }

  /** Wird vom Interceptor benutzt. Das Token wird nirgends geloggt. */
  getToken(): string | null {
    return this.isLoggedIn() ? this.token() : null;
  }

  /** Startseite je nach Rolle */
  homeUrl(): string {
    switch (this.role()) {
      case 'MERCHANT':
        return '/haendler';
      case 'ADMIN':
        return '/admin';
      default:
        return '/';
    }
  }

  private saveToken(token: string): void {
    writeStorage(TOKEN_KEY, token);
    this.token.set(token);
  }
}

/** Liest den Payload aus dem JWT (nur Base64-Dekodierung, KEINE Signaturprüfung). */
function decodePayload(token: string): TokenPayload | null {
  try {
    const json = atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json) as TokenPayload;
    return typeof payload.exp === 'number' ? payload : null;
  } catch {
    return null;
  }
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage nicht verfügbar -> nur im Speicher halten
  }
}

function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignorieren
  }
}

/** Wandelt einen HTTP-Fehler vom Backend in eine verständliche Meldung um. */
export function toErrorMessage(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) {
    return 'Ein unbekannter Fehler ist aufgetreten.';
  }
  // 0 = keine Verbindung; 500 ohne JSON / 502–504 = der Dev-Proxy erreicht das Backend nicht
  const proxyError = err.status >= 500 && typeof err.error?.message !== 'string';
  if (err.status === 0 || proxyError) {
    return 'Der Server ist nicht erreichbar. Läuft das Backend auf Port 3000?';
  }
  // NestJS liefert { message: string | string[], error, statusCode }
  const message = err.error?.message;
  if (Array.isArray(message)) {
    // verschachtelte Felder kommen als "shipping.Bitte ..." -> Präfix entfernen
    return message.map((m: string) => m.replace(/^[a-zA-Z.]+\.(?=[A-ZÄÖÜ„])/, '')).join(' ');
  }
  if (typeof message === 'string') {
    return message;
  }
  return `Fehler ${err.status}: Bitte später erneut versuchen.`;
}
