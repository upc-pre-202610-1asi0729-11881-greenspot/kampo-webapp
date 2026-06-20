/**
 * Matches the backend's AuthTokenResource:
 * { "token": "eyJhbGci...", "type": "Bearer" }
 */
export class AuthTokenResponse {
  token: string;
  type: string;

  constructor(token: string, type: string) {
    this.token = token;
    this.type = type;
  }
}
