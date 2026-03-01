import {Component, computed, inject, OnInit} from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from "@angular/router";
import { CartItemRow } from "./components/cart-item-row/cart-item-row";
import { CartSummary } from "./components/cart-summary/cart-summary";
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CartItemRow, CartSummary, LucideAngularModule],
  templateUrl: './cart.html',
  styles: ``,
})
export class Cart implements OnInit {
  cartService = inject(CartService);
  cartItemsCount = this.cartService.itemCount;
  cartItems = this.cartService.items;
  total = this.cartService.total;
  deliveryFee = computed(() => this.cartItemsCount() > 0 ? 5 : 0); // $5 delivery fee if there are items in the cart

  ngOnInit() {
    console.log('Cart items count:', this.cartItemsCount());
    console.log('Cart items:', this.cartItems());
  }

  updateQuantity(itemId: string, newQuantity: number) {
    this.cartService.updateQuantity(itemId, newQuantity);
  }

  removeItem(itemId: string) {
    this.cartService.removeItem(itemId);
  }

}
