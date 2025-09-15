import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = `${API_BASE_URL}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, payload).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  register(payload: { name: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, payload);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'admin';
  }
}