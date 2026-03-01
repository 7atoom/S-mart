import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatCvv',
})
export class FormatCvvPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value.replace(/\D/g, '').slice(0, 4);
  }

}
