import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, tap, throwError} from 'rxjs';
import {Category} from '../../utils/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
    private readonly baseUrl = "https://s-mart-api.vercel.app/api/categories/";

    httpClient = inject(HttpClient);

    categories = signal<Category[]>([]);
    isLoading = signal<boolean>(false);
    isError = signal<boolean>(false);

    getCategories() : Observable<Category[]> {
        if (this.categories().length > 0) {
            return new Observable(observer => {
                observer.next(this.categories());
                observer.complete();
            });
        }

        this.isLoading.set(true);
        this.isError.set(false);
        return this.httpClient.get<{message: string, categories: Category[]}>(this.baseUrl).pipe(
            map(res => res.categories),
            tap(data => {
                this.categories.set(data);
                this.isLoading.set(false);
            }),
            catchError(err => {
                this.isLoading.set(false);
                this.isError.set(true);
                return throwError(() => err);
            })
        );
    }

    getCategoryByName(name: string) : Observable<any> {
        return this.httpClient.get(`${this.baseUrl}slug/${name}`);
    }

    getCategoryById(id: string) : Observable<any> {
        return this.httpClient.get(`${this.baseUrl}${id}`);
    }
}
