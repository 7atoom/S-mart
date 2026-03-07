import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CartIngredient } from '../../../../utils/CartIngredient';

@Component({
  selector: 'app-ingredients-list',
  imports: [DecimalPipe],
  templateUrl: './ingredients-list.html',
  styleUrl: '../../ai-chef-pick-cart.css',
})
export class IngredientsList {
  @Input({ required: true }) ingredients: CartIngredient[] = [];
  @Input({ required: true }) servings = 1;

  @Output() toggleItem = new EventEmitter<CartIngredient>();

  getScaledQty(item: CartIngredient): number {
    const gramsNeeded = (item.baseQuantity / 2) * this.servings;
    const packsNeeded = gramsNeeded / (item.quantityInGram || 1);
    return Math.max(1, Math.ceil(packsNeeded));
  }

  onToggleItem(item: CartIngredient): void {
    this.toggleItem.emit(item);
  }
}
