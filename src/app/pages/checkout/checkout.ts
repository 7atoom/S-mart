import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Stepper } from './components/stepper/stepper';
import { Shipping } from './components/shipping/shipping';
import { PaymentComponent } from './components/payment/payment';
import { ConfirmationComponent } from './components/confirmation/confirmation';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, Stepper, Shipping, PaymentComponent, ConfirmationComponent],
  templateUrl: './checkout.html',
})
export class CheckoutComponent {
  private router = inject(Router);
  cartService = inject(CartService);

  cartItems = this.cartService.items();

  step: 'shipping' | 'payment' | 'confirmation' = 'shipping';

  shippingData: any = null;
  paymentData: any = null;
  orderNumber = Math.floor(Math.random() * 1000000);

  steps = [
    { key: 'shipping' as const, label: 'Shipping' },
    { key: 'payment' as const, label: 'Payment' },
    { key: 'confirmation' as const, label: 'Confirmed' },
  ];

  get currentStepIndex(): number {
    return this.steps.findIndex((s) => s.key === this.step);
  }

  onShippingSubmit(data: any) {
    this.shippingData = data;
    this.step = 'payment';
  }

  onPaymentSubmit(data: any) {
    this.paymentData = data;
    this.step = 'confirmation';
    this.cartService.clearCart();
  }

  onBackToCart() {
    this.router.navigate(['/cart']);
  }

  onBackToShipping() {
    this.step = 'shipping';
  }

  onGoHome() {
    this.router.navigate(['/']);
  }

  onGoShop() {
    this.router.navigate(['/shop']);
  }
}
