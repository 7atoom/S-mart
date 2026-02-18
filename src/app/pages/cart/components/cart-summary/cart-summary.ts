import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-summary',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-summary.html',
  styles: ``,
})
export class CartSummary {
  @Input() total: number = 0;
  @Input() deliveryFee: number = 0;

  
}
