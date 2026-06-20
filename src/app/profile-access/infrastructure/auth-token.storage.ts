import { Injectable } from '@angular/core';

const TOKEN_KEY = 'kampo_auth_token';

/**
 * Stores and retrieves the JWT Bearer token issued by POST /api/v1/auth/login.
 * Centralizing this avoids scattering localStorage calls across the app
 * and makes it trivial to swap storage strategy later (e.g. cookies).
 */
@Injectable({ providedIn: 'root' })
export class AuthTokenStorage {
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
