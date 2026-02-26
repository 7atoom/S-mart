import {Component, inject} from '@angular/core';
import {ProductCard} from "../../../../shared/components/product-card/product-card";
import {products} from '../../../../data/products';
import {Product} from '../../../../utils/Product';
import {CartService} from '../../../../core/services/cart.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ramadan',
  imports: [ProductCard],
  templateUrl: './ramadan.html',
  styles: ``,
})
export class Ramadan {
  private cartService = inject(CartService);
  private router = inject(Router);

  ramadanProducts = products.filter(p => p.category === 'Ramadan Essentials');

  navigateToCategory(category: string) {
    this.router.navigate(['/shop'], { queryParams: { category } }).then(() => window.scrollTo(0, 0));
  }

  onAddToCart(product: Product) {
    this.cartService.addItem(product);
  }

  onUpdateQuantity(event: { productId: string; quantity: number }) {
    this.cartService.updateQuantity(event.productId, event.quantity);
  }

  getCartItem(productId: string) {
    return this.cartService.getCartItem(productId);
  }
}
