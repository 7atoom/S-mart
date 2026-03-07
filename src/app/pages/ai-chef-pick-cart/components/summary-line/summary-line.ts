import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-summary-line',
  imports: [DecimalPipe],
  templateUrl: './summary-line.html',
  styleUrl: '../../ai-chef-pick-cart.css',
})
export class SummaryLine {
  @Input({ required: true }) itemCount = 0;
  @Input({ required: true }) totalPrice = 0;
}
