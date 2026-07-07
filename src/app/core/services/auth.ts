import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface User {
  email?: string;
  password?: string;
  name?: string;
  role?: 'student' | 'teacher' | 'admin';
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  father_name?: string;
  mobile_number?: string;
  confirm_password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';
  
  // Reactive state management using Angular Signals
  currentUser = signal<User | null>(null);

  constructor() {
    // Restore session on bootstrap
    const savedUser = localStorage.getItem('edu_user');
    const savedToken = localStorage.getItem('edu_token');
    if (savedUser && savedToken) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null && localStorage.getItem('edu_token') !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('edu_token');
  }

  register(user: User): Observable<any> {
    // Backend register endpoint is /auth/register
    return this.http.post<any>(`${this.apiUrl}/auth/register`, user).pipe(
      catchError(err => {
        const msg = err.error?.detail || err.error?.message || 'Registration failed';
        return throwError(() => new Error(msg));
      })
    );
  }

  login(user: User): Observable<any> {
    // Backend login endpoint is /auth/login, expecting URL-encoded Form fields
    const body = new HttpParams()
      .set('username', user.email ?? '')
      .set('password', user.password || '');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>(`${this.apiUrl}/auth/login`, body.toString(), { headers }).pipe(
      tap(response => {
        // response structure: { message: string, access_token: string, token_type: string, role: string }
        if (response.access_token) {
          localStorage.setItem('edu_token', response.access_token);
          const sessionUser: User = { 
            email: user.email, 
            name: user.name || (user.email?.split('@')[0] ?? ''), 
            role: response.role 
          };
          localStorage.setItem('edu_user', JSON.stringify(sessionUser));
          this.currentUser.set(sessionUser);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('edu_user');
    localStorage.removeItem('edu_token');
    this.currentUser.set(null);
  }

  getMe(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/me`);
  }
}
