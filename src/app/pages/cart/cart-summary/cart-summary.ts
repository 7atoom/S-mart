import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cart-summary',
  imports: [CurrencyPipe],
  templateUrl: './cart-summary.html',
  styles: ``,
})
export class CartSummary {
  @Input() total: number = 0;
  @Input() deliveryFee: number = 0;

  
}
