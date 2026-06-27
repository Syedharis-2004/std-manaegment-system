import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  email: string;
  password?: string;
  name?: string;
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
    if (savedUser) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('edu_user');
      }
    }
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  register(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  login(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        if (response.message === 'Login Successful') {
          const sessionUser: User = { email: user.email, name: user.email.split('@')[0] };
          localStorage.setItem('edu_user', JSON.stringify(sessionUser));
          this.currentUser.set(sessionUser);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('edu_user');
    this.currentUser.set(null);
  }
}
