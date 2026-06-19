/**
 * Matches the backend's LoginResource — POST /api/v1/auth/login
 */
export class LoginRequest {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
