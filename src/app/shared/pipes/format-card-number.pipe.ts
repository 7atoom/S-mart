import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCardNumber',
})
export class FormatCardNumberPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

}
