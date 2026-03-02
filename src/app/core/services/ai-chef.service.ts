import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AiChefRecipeResponse} from '../../utils/AiChefRecipe';

@Injectable({
  providedIn: 'root',
})
export class AiChefService {
  private readonly baseUrl = "https://s-mart-api.vercel.app/api/ai-chef";
  httpClient = inject(HttpClient);

  private authHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    };
  }

  generateRecipe(dish: string): Observable<AiChefRecipeResponse> {
    return this.httpClient.post<AiChefRecipeResponse>(this.baseUrl, {dish}, {headers: this.authHeaders()});
  }
}
