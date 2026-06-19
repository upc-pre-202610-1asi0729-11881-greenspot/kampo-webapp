import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { environment } from '../../../environments/environment';
import { User } from '../domain/model/user.entity';
import { Role } from '../domain/model/role.entity';
import { Permission } from '../domain/model/permission.entity';
import { UserResponse } from './responses/user.response';
import { RoleResponse } from './responses/role.response';
import { PermissionResponse } from './responses/permission.response';
import { AuthTokenResponse } from './responses/auth-token.response';
import { UserAssembler } from './assemblers/user.assembler';
import { RoleAssembler } from './assemblers/role.assembler';
import { PermissionAssembler } from './assemblers/permission.assembler';
import { RegisterUserRequest } from './requests/register-user.request';
import { LoginRequest } from './requests/login.request';

@Injectable({ providedIn: 'root' })
export class ProfileAccessApi extends BaseApi {
  private readonly usersEndpoint = `${environment.apiBaseUrl}/users`;
  private readonly rolesEndpoint = `${environment.apiBaseUrl}/roles`;
  private readonly permissionsEndpoint = `${environment.apiBaseUrl}/permissions`;
  private readonly loginEndpoint = `${environment.apiBaseUrl}/auth/login`;

  private userAssembler = new UserAssembler();
  private roleAssembler = new RoleAssembler();
  private permissionAssembler = new PermissionAssembler();

  getUsers(): Observable<User[]> {
    return this.get<UserResponse[]>(this.usersEndpoint).pipe(
      map((responses) => this.userAssembler.toEntitiesFromResponse(responses)),
    );
  }

  getRoles(): Observable<Role[]> {
    return this.get<RoleResponse[]>(this.rolesEndpoint).pipe(
      map((responses) => this.roleAssembler.toEntitiesFromResponse(responses)),
    );
  }

  getPermissions(): Observable<Permission[]> {
    return this.get<PermissionResponse[]>(this.permissionsEndpoint).pipe(
      map((responses) => this.permissionAssembler.toEntitiesFromResponse(responses)),
    );
  }

  /**
   * Registers a new user. Backend hashes the password and assigns
   * the default AGRONOMIST role automatically.
   */
  registerUser(request: RegisterUserRequest): Observable<User> {
    return this.post<UserResponse>(this.usersEndpoint, request).pipe(
      map((response) => this.userAssembler.toEntityFromResponse(response)),
    );
  }

  /**
   * Authenticates against POST /api/v1/auth/login.
   * Returns the raw JWT token response — the store is responsible
   * for persisting it via AuthTokenStorage.
   */
  login(request: LoginRequest): Observable<AuthTokenResponse> {
    return this.post<AuthTokenResponse>(this.loginEndpoint, request);
  }

  modifyProfile(userId: number, user: object): Observable<User> {
    return this.put<UserResponse>(`${this.usersEndpoint}/${userId}`, user).pipe(
      map((response) => this.userAssembler.toEntityFromResponse(response)),
    );
  }
}
