import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin } from '../models/user-login';
import { Observable } from 'rxjs';
import { UserToken } from '../models/user-token';
import { UserRegistration } from '../models/user-registration';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  productServiceUrl: string = 'https://localhost:5001/users';
  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {

    return (localStorage.getItem("idToken") != null);
  }

  login(userLogin: UserLogin): Observable<UserToken> {
    let endPointUrl = `${this.productServiceUrl}/login`;

    return this.http.post<UserToken>(endPointUrl, userLogin);
  }

  register(userRegistration: UserRegistration): Observable<never> {
    let endPointUrl = `${this.productServiceUrl}/register`;

    return this.http.post<never>(endPointUrl, userRegistration);
  }

  logout() {
    localStorage.clear();
  }

  get UserName(): string {
    return localStorage.getItem('userName') as string;
  }
}
