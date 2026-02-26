import {Component, computed, inject} from '@angular/core';
import {ProductCard} from "../../../../shared/components/product-card/product-card";
import {Product} from '../../../../utils/Product';
import {CartService} from '../../../../core/services/cart.service';
import {Router} from '@angular/router';
import {ProductsService} from '../../../../core/services/products.service';

@Component({
  selector: 'app-ramadan',
  imports: [ProductCard],
  templateUrl: './ramadan.html',
  styles: ``,
})
export class Ramadan {
  private cartService = inject(CartService);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  products = this.productsService.products;

  ramadanProducts = computed(() => this.products().filter(p => p.category?.name === 'Ramadan Essentials'));

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
