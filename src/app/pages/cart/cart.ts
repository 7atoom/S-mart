import {Component, computed, inject} from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from "@angular/router";
import { CartItemRow } from "./components/cart-item-row/cart-item-row";
import { CartSummary } from "./components/cart-summary/cart-summary";
import { LucideAngularModule } from "lucide-angular";
import { CartItem } from '../../utils/CartItem';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CartItemRow, CartSummary, LucideAngularModule],
  templateUrl: './cart.html',
  styles: ``,
})
export class Cart {
  cartService = inject(CartService);
  cartItemsCount = this.cartService.itemCount;
  cartItems = this.cartService.items;
  total = this.cartService.total;
  deliveryFee = computed(() => this.cartItemsCount() > 0 ? 5 : 0);

  regularItems = computed(() =>
    this.cartItems().filter(item => !item.recipeGroup)
  );

  recipeGroups = computed(() => {
    const groups: Record<string, CartItem[]> = {};
    this.cartItems()
      .filter(item => !!item.recipeGroup)
      .forEach(item => {
        const key = item.recipeGroup!;
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
      });
    return groups;
  });

  recipeGroupEntries = computed(() =>
    Object.entries(this.recipeGroups())
  );


  updateQuantity(itemId: string, newQuantity: number) {
    this.cartService.updateQuantity(itemId, newQuantity);
  }

  removeItem(itemId: string) {
    this.cartService.removeItem(itemId);
  }
}


