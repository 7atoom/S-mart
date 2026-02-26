import {Component, inject} from '@angular/core';
import {ProductCard} from "../../../../shared/components/product-card/product-card";
import {RouterLink} from "@angular/router";
import {Product} from '../../../../utils/Product';
import {products} from '../../../../data/products';
import {CartService} from '../../../../core/services/cart.service';

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
  featuredProducts = products.filter(p => p.featured);
  cartService = inject(CartService);

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
