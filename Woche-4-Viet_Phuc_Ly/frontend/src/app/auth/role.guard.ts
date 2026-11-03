import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Role } from './auth.service';

/**
 * Route Guard für Rollen, z. B. canActivate: [roleGuard('MERCHANT')]
 * - nicht eingeloggt  -> /login (mit Rücksprung-URL)
 * - falsche Rolle     -> Startseite der eigenen Rolle
 * Achtung: Das ist nur UX. Geschützt werden die Daten durch den RolesGuard im Backend.
 */
export function roleGuard(...roles: Role[]): CanActivateFn {
  return (_route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (!auth.isLoggedIn()) {
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }
    return auth.hasRole(...roles) ? true : router.parseUrl(auth.homeUrl());
  };
}
