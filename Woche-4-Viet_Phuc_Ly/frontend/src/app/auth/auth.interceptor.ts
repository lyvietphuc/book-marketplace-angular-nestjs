import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL, AuthService } from './auth.service';

/**
 * Hängt das JWT als "Authorization: Bearer <token>" an Requests an unser Backend.
 * An fremde URLs wird das Token bewusst NICHT geschickt.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  const isApiRequest = req.url.startsWith(API_URL);
  const authReq =
    token && isApiRequest ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((err: unknown) => {
      // Token abgelaufen/ungültig -> ausloggen und zum Login (aber nicht beim Login selbst)
      if (
        err instanceof HttpErrorResponse &&
        err.status === 401 &&
        isApiRequest &&
        !req.url.endsWith('/auth/login')
      ) {
        auth.logout();
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => err);
    }),
  );
};
