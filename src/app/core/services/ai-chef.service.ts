import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import {AiChefRecipeResponse} from '../../utils/AiChefRecipe';

@Injectable({
  providedIn: 'root',
})
export class AiChefService {
  private readonly baseUrl = "https://s-mart-api.vercel.app/api/ai-chef";
  httpClient = inject(HttpClient);

  // Cache for storing generated recipes
  private recipeCache = new Map<string, AiChefRecipeResponse>();

  private authHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    };
  }

  generateRecipe(dish: string): Observable<AiChefRecipeResponse> {
    const normalizedDish = dish.toLowerCase().trim();

    // Check if recipe is already cached
    if (this.recipeCache.has(normalizedDish)) {
      return of(this.recipeCache.get(normalizedDish)!);
    }

    // Generate and cache the recipe
    return this.httpClient.post<AiChefRecipeResponse>(
      this.baseUrl,
      {dish},
      {headers: this.authHeaders()}
    ).pipe(
      tap(response => {
        this.recipeCache.set(normalizedDish, response);
      })
    );
  }

  clearCache(dish?: string): void {
    if (dish) {
      this.recipeCache.delete(dish.toLowerCase().trim());
    } else {
      this.recipeCache.clear();
    }
  }
}
