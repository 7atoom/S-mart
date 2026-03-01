import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../utils/Product';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {

  transform(productsArr:Product[], name:string ): any {
    return productsArr.filter((product)=> product.title.toLowerCase().includes(name.toLowerCase()))
  }

}
