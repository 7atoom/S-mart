import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  if(authService.isAuthenticated() && authService.isAdmin()){
    return true;
  }
  else{
    router.navigate(['/']);
    return false;
  }
};
