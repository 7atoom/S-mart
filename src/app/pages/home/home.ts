import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Router } from '@angular/router';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { products } from '../../data/products';
import {Products} from '../../utils/Product';
import {CartService} from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  router = inject(Router);
  cartService = inject(CartService);
  featuredProducts = products.filter(p => p.featured);
  ramadanProducts = products.filter(p => p.category === 'Ramadan Essentials');
  navigateToCategory(category: string) {
    this.router.navigate(['/shop'], {
      queryParams: {category: category}
    }).then(() =>
    window.scrollTo(0, 0));
  }



  onAddToCart(product: Products) {
    this.cartService.addItem(product);
  }

  onUpdateQuantity(event: { productId: string; quantity: number }) {
    this.cartService.updateQuantity(event.productId, event.quantity);
  }

  getCartItem(productId: string) {
     return this.cartService.getCartItem(productId);
  }


}
