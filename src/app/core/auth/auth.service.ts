import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthResponse, AuthUser, EmailAvailabilityResponse, LoginPayload, SignupPayload } from '../../shared/models/auth.models';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { PermissionService } from '../services/permission.service';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly permissionService = inject(PermissionService)
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Single source of truth for the current user; components read via computed()
  private readonly _currentUser = signal<AuthUser | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  
  signup(payload: SignupPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, payload).pipe(
      tap((res) => this.persistSession(res)),
      catchError((err) => this.handleError(err))
    );
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin/`, payload).pipe(
      tap((res) => {
        this.permissionService.setPermissions(res.user.permissions);
        this._currentUser.set(res.user);
        this.persistSession(res);

      }
      ),
      catchError((err) => this.handleError(err))
    );
  }

  checkEmailAvailable(email: string): Observable<boolean> {
    return this.http
      .get<EmailAvailabilityResponse>(`${this.apiUrl}/email-available`, {
        params: { email },
      })
      .pipe(
        tap(() => { }),
        (source) =>
          new Observable<boolean>((subscriber) => {
            source.subscribe({
              next: (res) => subscriber.next(res.available),
              error: (err) => subscriber.error(err),
              complete: () => subscriber.complete(),
            });
          })
      );
  }

  signInWithGoogle(): void {
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google/callback`);
    const scope = encodeURIComponent('openid email profile');
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${environment.googleClientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}`;
    window.location.href = url;
  }

  fetchMe(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiUrl}/me/`).pipe(
      tap((user) => {
        this.permissionService.setPermissions(user.permissions);
        this._currentUser.set(user);
      }),
      catchError((err) => {
        this._currentUser.set(null);
        this.permissionService.clear();
        return this.handleError(err);
      })
    );
  }

  logout(): Observable<void> {
    
    return this.http.post<void>(`${this.apiUrl}/logout/`, {}).pipe(
      tap(() => {
        this._currentUser.set(null);
        this.permissionService.clear();
      }),
      catchError((err) => this.handleError(err))
    );
  }

  async getAccessToken(): Promise<string | null> {
    const cookie = await cookieStore.get("access_token")
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  refreshAccessToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh/`, { refreshToken })
      .pipe(
        tap((res) => this.persistSession(res)),
        catchError((err) => {
          // this.logout();
          console.log(err);
          
          return this.handleError(err);
        })
      );
  }



  private persistSession(res: AuthResponse): void {
    // localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
    // localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
    this._currentUser.set(res.user);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // Centralized normalization — components branch on status, not on message strings
    const normalized = {
      status: err.status,
      message: err.error?.message ?? 'Unexpected error occurred.',
    };
    return throwError(() => normalized);
  }
}


