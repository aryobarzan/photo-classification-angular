import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAdmin()) {
    return true;
  }
  // logged in but not admin: go to profile
  return authService.isLoggedIn()
    ? router.createUrlTree(['/profile'])
    : // Not logged in at all: go to login
      router.createUrlTree(['/login']);
};
