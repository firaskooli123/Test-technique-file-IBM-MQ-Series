import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // Signaux privés
  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  // Signaux publics (en lecture seule)
  public readonly user = this.userSignal.asReadonly();
  public readonly token = this.tokenSignal.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.tokenSignal());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    
    if (token && user) {
      this.tokenSignal.set(token);
      this.userSignal.set(JSON.parse(user));
    }
  }

  login(username: string, password: string): Observable<AuthState> {
    return this.http.post<AuthState>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          this.setAuthState(response);
        }),
        catchError(error => {
          console.error('Erreur de connexion:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  private setAuthState(state: AuthState): void {
    this.tokenSignal.set(state.token);
    this.userSignal.set(state.user);
    
    if (state.token) {
      localStorage.setItem(this.TOKEN_KEY, state.token);
    }
    if (state.user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(state.user));
    }
  }

  private clearAuthState(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getAuthToken(): string | null {
    return this.tokenSignal();
  }

  isAdmin(): boolean {
    return this.userSignal()?.role === 'admin';
  }

  hasRole(role: string): boolean {
    return this.userSignal()?.role === role;
  }
} 