import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if (authService.token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.token}`,
      },
    });
  }
  // Automatically log out the user if a 401 Unauthorized response is received
  // Can occur if their access token has expired.
  return next(req).pipe(
    tap({
      error: (err) => {
        if (err.status === 401) {
          authService.logout();
        }
      },
    }),
  );
};
