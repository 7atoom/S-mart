import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {Auth} from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(Auth);
  if (authService.isAuthenticated()) {
    return true
  } else {
    router.navigate(['/login']).then(r =>
      console.log(r))
    return false
  }
};
