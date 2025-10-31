import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * ✅ AuthGuard — protects routes from unauthorized access
 * Usage (in route): canActivate: [authGuard]
 */
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
