import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle2, Package } from 'lucide-angular';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './confirmation.html',
})
export class ConfirmationComponent {
  @Input({ required: true }) shippingData: any;
  @Input({ required: true }) orderNumber!: number;
  @Output() goHome = new EventEmitter<void>();
  @Output() goShop = new EventEmitter<void>();

  readonly CheckCircle2 = CheckCircle2;
  readonly Package = Package;

  onGoHome() {
    this.goHome.emit();
  }

  onGoShop() {
    this.goShop.emit();
  }
}