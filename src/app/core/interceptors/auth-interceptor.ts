import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if (authService.token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.token}`,
      },
    });
  }
  return next(req);
};
