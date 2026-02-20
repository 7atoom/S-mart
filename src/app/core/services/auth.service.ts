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
    return this.httpClient.post('https://api.escuelajs.co/api/v1/auth/login', data)
  }
  getUserData(){
    console.log(jwtDecode(localStorage.getItem('token')!))
    return jwtDecode(localStorage.getItem('token')!)
  }
}
