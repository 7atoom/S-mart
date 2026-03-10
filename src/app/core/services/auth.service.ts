import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import {CartService} from './cart.service';
import {AiChefService} from './ai-chef.service';


@Injectable({
  providedIn: 'root',
})
export class Auth {
  cartService = inject(CartService);
  httpClient = inject(HttpClient);
  aiChefService = inject(AiChefService);
  sendLoginForm(data:object) : Observable<any>{
    return this.httpClient.post("https://s-mart-api.vercel.app/api/auth/login", data)
  }
  sendSignupForm(data:object): Observable<any>{
    return this.httpClient.post("https://s-mart-api.vercel.app/api/auth/register", data)
  }
  getUserData(){
    console.log(jwtDecode(localStorage.getItem('token')!))
    return jwtDecode(localStorage.getItem('token')!)
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'ADMIN';

  }
  logout(){
    this.cartService.clearLocalCart();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.aiChefService.clearCache();
  }
}
