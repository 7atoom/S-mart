import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideAngularModule, MapPin, CreditCard, CheckCircle2 } from 'lucide-angular';

@Component({
  selector: 'app-stepper',
  imports: [NgClass, LucideAngularModule],
  templateUrl: './stepper.html',
  styles: ``,
})
export class Stepper {
  @Input({ required: true }) steps!: Array<{ key: string; label: string }>;
  @Input({ required: true }) currentStepIndex!: number;

  readonly MapPin = MapPin;
  readonly CreditCard = CreditCard;
  readonly CheckCircle2 = CheckCircle2;

  getStepClass(index: number): string {
    if (index < this.currentStepIndex) {
      return 'completed';
    } else if (index === this.currentStepIndex) {
      return 'current';
    } else {
      return 'upcoming';
    }
  }
}
