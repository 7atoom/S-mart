import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ArrowLeft, ArrowRight, LucideAngularModule} from 'lucide-angular';
import {CartService} from '../../../../core/services/cart.service';
import {FormatCvvPipe} from '../../../../shared/pipes/format-cvv.pipe';
import {FormatExpiryPipe} from '../../../../shared/pipes/format-expiry.pipe';
import {FormatCardNumberPipe} from '../../../../shared/pipes/format-card-number.pipe';
import {CartItem} from '../../../../utils/CartItem';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, FormatCvvPipe, FormatExpiryPipe, FormatCardNumberPipe],
  templateUrl: './payment.html',
})
export class PaymentComponent {
  @Input() shippingData: any;
  @Input() cartItems: CartItem[] = [];
  @Output() submitPayment = new EventEmitter<any>();
  @Output() backToShipping = new EventEmitter<void>();

  readonly ArrowLeft = ArrowLeft;
  readonly ArrowRight = ArrowRight;

  private fb = inject(FormBuilder);
  cartService = inject(CartService);

  deliveryFee = this.cartService.deliveryFee;

  paymentForm = this.fb.group({
    cardName: ['', [Validators.required, Validators.minLength(3)]],
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    expiryDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  onSubmit() {
    if (this.paymentForm.valid) {
      this.submitPayment.emit(this.paymentForm.value);
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }

  onBackToShipping() {
    this.backToShipping.emit();
  }

  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 16);
    input.value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
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

  hasError(fieldName: string): boolean {
    const control = this.paymentForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}
