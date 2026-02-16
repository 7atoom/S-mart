import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { RouterLink } from "@angular/router";
import { CartItemRow } from "../cart-item-row/cart-item-row";
import { CartSummary } from "../cart-summary/cart-summary";

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CartItemRow, CartSummary],
  templateUrl: './cart.html',
  styles: ``,
})
export class Cart {
  cartService = inject(CartService);
  cartItemsCount = this.cartService.itemCount;
  cartIems = this.cartService.items;
  total = this.cartService.total;
  deliveryFee = computed(() => this.cartItemsCount() > 0 ? 5 : 0); // $5 delivery fee if there are items in the cart

  ngOnInit() {
    console.log('Cart items count:', this.cartItemsCount());
    console.log('Cart items:', this.cartIems());
  }

  updateQuantity(itemId: string, newQuantity: number) {
    this.cartService.updateQuantity(itemId, newQuantity);
  }

  removeItem(itemId: string) {
    // Remove the item from the cart
    this.cartService.removeItem(itemId);
  }

}
