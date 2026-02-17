import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  MapPin,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Package,
} from 'lucide-angular';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { FormatCardNumerPipe } from '../../pipes/format-card-numer-pipe';
import { FormatExpiaryPipe } from '../../pipes/format-expiary-pipe';
import { FormatCvvPipe } from '../../pipes/format-cvv-pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
    FormatCardNumerPipe,
    FormatExpiaryPipe,
    FormatCvvPipe,
  ],
  templateUrl: './checkout.html',
})
export class CheckoutComponent {
  readonly MapPin = MapPin;
  readonly CreditCard = CreditCard;
  readonly CheckCircle2 = CheckCircle2;
  readonly ArrowLeft = ArrowLeft;
  readonly ArrowRight = ArrowRight;
  readonly Package = Package;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  cartService = inject(CartService);

  shippingForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,}$/)]],
    address: ['', [Validators.required, Validators.minLength(10)]],
    city: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
  });

  paymentForm = this.fb.group({
    cardName: ['', [Validators.required, Validators.minLength(3)]],
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    expiryDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  step: 'shipping' | 'payment' | 'confirmation' = 'shipping';

  steps = [
    { key: 'shipping' as const, label: 'Shipping' },
    { key: 'payment' as const, label: 'Payment' },
    { key: 'confirmation' as const, label: 'Confirmed' },
  ];

  get stepIdx(): number {
    return this.steps.findIndex((s) => s.key === this.step);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goBackToShipping() {
    this.step = 'shipping';
  }

  handleShippingNext() {
    console.log('handleShippingNext called');
    console.log('Form valid:', this.shippingForm.valid);
    console.log('Form values:', this.shippingForm.value);

    // Log which fields are invalid
    if (!this.shippingForm.valid) {
      Object.keys(this.shippingForm.controls).forEach((key) => {
        const control = this.shippingForm.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid:`, control.errors);
        }
      });
    }

    if (this.shippingForm.valid) {
      console.log('Form is valid, moving to payment step');
      this.step = 'payment';
    } else {
      console.log('Form is invalid, marking all fields as touched');
      this.shippingForm.markAllAsTouched();
    }
  }

  handlePaymentNext() {
    if (this.paymentForm.valid) {
      this.step = 'confirmation';
      this.cartService.clearCart();
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }

  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = formatted;
    this.paymentForm.patchValue({ cardNumber: value }, { emitEvent: false });
  }

  formatExpiry(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 4);
    let formatted = value;
    if (value.length >= 2) {
      formatted = value.slice(0, 2) + '/' + value.slice(2);
    }
    input.value = formatted;
    this.paymentForm.patchValue({ expiryDate: formatted }, { emitEvent: false });
  }

  formatCvv(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 4);
    input.value = value;
    this.paymentForm.patchValue({ cvv: value }, { emitEvent: false });
  }
}
