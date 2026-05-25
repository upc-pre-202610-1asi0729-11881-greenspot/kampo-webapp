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
import { UserAssembler } from './assemblers/user.assembler';
import { RoleAssembler } from './assemblers/role.assembler';
import { PermissionAssembler } from './assemblers/permission.assembler';

@Injectable({ providedIn: 'root' })
export class ProfileAccessApi extends BaseApi {
  private readonly usersEndpoint = `${environment.apiBaseUrl}/users`;
  private readonly rolesEndpoint = `${environment.apiBaseUrl}/roles`;
  private readonly permissionsEndpoint = `${environment.apiBaseUrl}/permissions`;

  private userAssembler = new UserAssembler();
  private roleAssembler = new RoleAssembler();
  private permissionAssembler = new PermissionAssembler();

  getUsers(): Observable<User[]> {
    return this.get<UserResponse[]>(this.usersEndpoint).pipe(
      map(responses => this.userAssembler.toEntitiesFromResponse(responses))
    );
  }

  getRoles(): Observable<Role[]> {
    return this.get<RoleResponse[]>(this.rolesEndpoint).pipe(
      map(responses => this.roleAssembler.toEntitiesFromResponse(responses))
    );
  }

  getPermissions(): Observable<Permission[]> {
    return this.get<PermissionResponse[]>(this.permissionsEndpoint).pipe(
      map(responses => this.permissionAssembler.toEntitiesFromResponse(responses))
    );
  }

  registerUser(user: object): Observable<User> {
    return this.post<UserResponse>(this.usersEndpoint, user).pipe(
      map(response => this.userAssembler.toEntityFromResponse(response))
    );
  }

  login(email: string): Observable<User> {
    return this.get<UserResponse[]>(`${this.usersEndpoint}?email=${email}`).pipe(
      map(responses => this.userAssembler.toEntityFromResponse((responses as UserResponse[])[0]))
    );
  }

  modifyProfile(userId: number, user: object): Observable<User> {
    return this.put<UserResponse>(`${this.usersEndpoint}/${userId}`, user).pipe(
      map(response => this.userAssembler.toEntityFromResponse(response))
    );
  }
}
