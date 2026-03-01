import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Product} from '../../utils/Product';
import {catchError, map, Observable, tap, throwError} from 'rxjs';

export interface AddProductBody {
  title: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  unit?: string;
  featured?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly baseUrl = "https://s-mart-api.vercel.app/api/products/";

  httpClient = inject(HttpClient);

  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);
  isError = signal<boolean>(false);

  private authHeaders(): HttpHeaders {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return new HttpHeaders({
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  getProducts(): Observable<Product[]> {
    if (this.products().length > 0) {
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

  getProductById(id: string): Observable<Product> {
    return this.httpClient.get<{ product: Product }>(`${this.baseUrl}${id}`).pipe(
      map(res => res.product),
      catchError(err => throwError(() => err))
    );
  }

  addProduct(body: AddProductBody): Observable<{ product: Product }> {
    return this.httpClient.post<{ message: string; product: Product }>(this.baseUrl, body, {
      headers: this.authHeaders(),
    }).pipe(
      tap(res => {
        const current = this.products();
        this.products.set([...current, res.product]);
      }),
      catchError(err => throwError(() => err))
    );
  }

  updateProduct(id: string, body: Partial<AddProductBody>): Observable<{ newProduct: Product }> {
    return this.httpClient.patch<{ message: string; newProduct: Product }>(`${this.baseUrl}${id}`, body, {
      headers: this.authHeaders(),
    }).pipe(
      tap(res => {
        const current = this.products();
        this.products.set(current.map(p => p._id === id ? res.newProduct : p));
      }),
      catchError(err => throwError(() => err))
    );
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${this.baseUrl}${id}`, {
      headers: this.authHeaders(),
    }).pipe(
      tap(() => {
        this.products.set(this.products().filter(p => p._id !== id));
      }),
      catchError(err => throwError(() => err))
    );
  }

  refreshProducts(): void {
    this.products.set([]);
    this.getProducts().subscribe();
  }
}
