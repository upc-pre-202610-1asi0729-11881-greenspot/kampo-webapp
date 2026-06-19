import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthTokenStorage } from '../../profile-access/infrastructure/auth-token.storage';

/**
 * Functional HTTP interceptor (Angular 17+ style).
 * Attaches "Authorization: Bearer <token>" to every outgoing request
 * when a token is present. Public endpoints (login, register) work
 * the same either way since the backend doesn't require auth on them.
 *
 * Register in app.config.ts:
 *   provideHttpClient(withInterceptors([authInterceptor]))
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(AuthTokenStorage);
  const token = tokenStorage.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};
