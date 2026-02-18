import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CartItem } from '../../../../utils/CartItem';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-item-row',
  imports: [CurrencyPipe],
  templateUrl: './cart-item-row.html',
  styles: ``,
})
export class CartItemRow {
  @Input() cartItem: CartItem | undefined;
  @Output() quantityChange = new EventEmitter<{ itemId: string; newQuantity: number }>();
  @Output() remove = new EventEmitter<string>();

  increaseQuantity() {
    this.quantityChange.emit({
      itemId: this.cartItem?.id || '',
      newQuantity: this.cartItem ? this.cartItem.quantity + 1 : 0
    });
  }

  decreaseQuantity() {
    this.quantityChange.emit({
      itemId: this.cartItem?.id || '',
      newQuantity: this.cartItem ? this.cartItem.quantity - 1 : 0
    });
  }

  onRemove() {
    this.remove.emit(this.cartItem?.id || '');
  }

}
