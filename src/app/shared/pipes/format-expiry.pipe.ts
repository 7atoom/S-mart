import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatExpiry',
})
export class FormatExpiryPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
  }

}
