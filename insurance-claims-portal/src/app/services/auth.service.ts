import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3001/auth/login';

  private _user$ = new BehaviorSubject<{ name: string; email: string } | null>(null);
  user$ = this._user$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const email = localStorage.getItem('userEmail');


    if (token && user) {
      try {
        this._user$.next(JSON.parse(user));
      } catch {
        this.logout();
      }
    }
  }

  /** ✅ LOGIN (works with your backend) **/
  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}`, { email, password }).pipe(
      map(res => {
        // backend returns { token, email, expiresIn }
        if (res && res.token && res.email) {
          const user = {
            name: res.email.split('@')[0], // example: "test" from "test@example.com"
            email: res.email
          };

          localStorage.setItem('token', res.token);
          localStorage.setItem('userEmail', res.email); // ✅ Save email here
          localStorage.setItem('user', JSON.stringify(user));
          this._user$.next(user);
          return res;
        } else {
          throw new Error('Invalid response from server');
        }
      }),
      catchError(err => {
        console.error('Login error:', err);
        return of(null);
      })
    );
  }

  /** ✅ LOGOUT **/
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._user$.next(null);
    this.router.navigate(['/login']);
  }

  /** ✅ TOKEN GETTER **/
  get token(): string | null {
    return localStorage.getItem('token');
  }

  /** ✅ isLoggedIn property **/
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /** ✅ getCurrentUser method **/
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
