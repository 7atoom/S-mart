import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';

export const checkoutGuard: CanActivateFn = () => {
    const cartService = inject(CartService);
    const router = inject(Router);

    if (cartService.itemCount() > 0) {
        return true;
    }

    router.navigate(['/cart']);
    return false;
};
