import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-bottom-bar',
  imports: [DecimalPipe],
  templateUrl: './bottom-bar.html',
  styleUrl: '../../ai-chef-pick-cart.css',
})
export class BottomBar {
  @Input({ required: true }) itemCount = 0;
  @Input({ required: true }) servings = 1;
  @Input({ required: true }) totalPrice = 0;
  @Input({ required: true }) isAddingToCart = false;

  @Output() weCookIt = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<void>();

  onWeCookIt(): void {
    this.weCookIt.emit();
  }

  onAddToCart(): void {
    this.addToCart.emit();
  }
}
