import { Injectable } from '@angular/core';
import { User } from '../domain/model/user.entity';
import { Role } from '../domain/model/role.entity';
import { Permission } from '../domain/model/permission.entity';
import { ProfileAccessApi } from '../infrastructure/profile-access.api';
import { AuthTokenStorage } from '../infrastructure/auth-token.storage';
import { RegisterUserRequest } from '../infrastructure/requests/register-user.request';
import { LoginRequest } from '../infrastructure/requests/login.request';

@Injectable({ providedIn: 'root' })
export class ProfileAccessStore {
  private users: User[] = [];
  private roles: Role[] = [];
  private permissions: Permission[] = [];
  private selectedUserId: number = 0;
  isLoading: boolean = false;
  loginError: string | null = null;

  constructor(
    private api: ProfileAccessApi,
    private tokenStorage: AuthTokenStorage,
  ) {}

  getUsers(): User[] {
    return this.users;
  }
  getRoles(): Role[] {
    return this.roles;
  }
  getPermissions(): Permission[] {
    return this.permissions;
  }
  getSelectedUserId(): number {
    return this.selectedUserId;
  }
  isAuthenticated(): boolean {
    return this.tokenStorage.isAuthenticated();
  }

  selectUser(id: number): void {
    this.selectedUserId = id;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.api.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  loadRoles(): void {
    this.api.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
    });
  }

  loadPermissions(): void {
    this.api.getPermissions().subscribe({
      next: (data) => {
        this.permissions = data;
      },
    });
  }

  /**
   * Registers a new user. The backend assigns the default AGRONOMIST
   * role automatically — no role assignment needed here.
   */
  registerUser(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
  ): void {
    this.isLoading = true;
    const request = new RegisterUserRequest(firstName, lastName, email, phone, password);
    this.api.registerUser(request).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadUsers();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  /**
   * Authenticates the user. On success, persists the JWT token —
   * all subsequent HTTP requests will carry it automatically via the interceptor.
   */
  login(email: string, password: string): void {
    this.isLoading = true;
    this.loginError = null;
    const request = new LoginRequest(email, password);
    this.api.login(request).subscribe({
      next: (response) => {
        this.tokenStorage.saveToken(response.token);
        this.isLoading = false;
      },
      error: () => {
        this.loginError = 'Email o contraseña incorrectos';
        this.isLoading = false;
      },
    });
  }

  logout(): void {
    this.tokenStorage.clearToken();
    this.users = [];
    this.roles = [];
    this.permissions = [];
    this.selectedUserId = 0;
  }

  modifyProfile(
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
  ): void {
    const user = { firstName, lastName, phone };
    this.api.modifyProfile(userId, user).subscribe({
      next: () => {
        this.loadUsers();
      },
    });
  }
}
