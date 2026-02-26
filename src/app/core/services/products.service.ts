import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../../utils/Product';
import {catchError, Observable, tap, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly baseUrl = "https://s-mart-api.vercel.app/api/products/";

  httpClient = inject(HttpClient);

  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);
  isError = signal<boolean>(false);

  getProducts() : Observable<Product[]> {
    if(this.products().length > 0) {
      return new Observable(observer => {
        observer.next(this.products());
        observer.complete();
      });
    }
    this.isLoading.set(true);
    return this.httpClient.get<any>(this.baseUrl).pipe(
      tap(response => {
        const products = Array.isArray(response) ? response : (response?.products ?? response?.data ?? []);
        this.products.set(products);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isError.set(true);
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }
}
