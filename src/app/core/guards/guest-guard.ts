import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  if (!authService.isLoggedIn()) {
    return true;
  }
  // redirect to home page if already authenticated
  return inject(Router).createUrlTree(['']);
};
