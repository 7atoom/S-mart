import {Component, computed, inject} from '@angular/core';
import {ProductCard} from "../../../../shared/components/product-card/product-card";
import {RouterLink} from "@angular/router";
import {Product} from '../../../../utils/Product';
import {CartService} from '../../../../core/services/cart.service';
import {ProductsService} from '../../../../core/services/products.service';

@Component({
  selector: 'app-popular-this-week',
    imports: [
        ProductCard,
        RouterLink
    ],
  templateUrl: './popular-this-week.html',
  styles: ``,
})
export class PopularThisWeek {
  cartService = inject(CartService);
  private productsService = inject(ProductsService);
  products = this.productsService.products;

  featuredProducts = computed(() => this.products().filter(p => p.featured));


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
