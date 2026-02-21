import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private httpClient:HttpClient){}
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
  
  logout(){
    localStorage.removeItem('token')
  }
}
