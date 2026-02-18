import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-shipping',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './shipping.html',
  styles: ``,
})
export class Shipping {
  @Output() submitShipping = new EventEmitter<any>();
  @Output() backToCart = new EventEmitter<void>();

  readonly ArrowLeft = ArrowLeft;
  readonly ArrowRight = ArrowRight;

  fb = inject(FormBuilder);
  shippingForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,}$/)]],
    address: ['', [Validators.required, Validators.minLength(10)]],
    city: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.shippingForm.valid) {
      this.submitShipping.emit(this.shippingForm.value);
    } else {
      this.shippingForm.markAllAsTouched();
    }
  }

  onBackToCart() {
    this.backToCart.emit();
  }

  hasError(fieldName: string): boolean {
    const control = this.shippingForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.shippingForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors['pattern'] && fieldName === 'phone') {
      return 'Please enter a valid phone number (at least 10 digits)';
    }
    return 'Invalid value';
  }
}
