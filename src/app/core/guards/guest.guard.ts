import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  if(localStorage.getItem('token')){
    router.navigate(['/shop'])
    return false
  }
  else{
    return true
  }
};
