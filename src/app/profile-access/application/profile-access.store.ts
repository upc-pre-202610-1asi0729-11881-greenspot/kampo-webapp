import { Injectable } from '@angular/core';
import { User } from '../domain/model/user.entity';
import { Role } from '../domain/model/role.entity';
import { Permission } from '../domain/model/permission.entity';
import { ProfileAccessApi } from '../infrastructure/profile-access.api';

@Injectable({ providedIn: 'root' })
export class ProfileAccessStore {
  private users: User[] = [];
  private roles: Role[] = [];
  private permissions: Permission[] = [];
  private selectedUserId: number = 0;
  isLoading: boolean = false;

  constructor(private api: ProfileAccessApi) {}

  getUsers(): User[] { return this.users; }
  getRoles(): Role[] { return this.roles; }
  getPermissions(): Permission[] { return this.permissions; }
  getSelectedUserId(): number { return this.selectedUserId; }

  selectUser(id: number): void {
    this.selectedUserId = id;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.api.getUsers().subscribe({
      next: (data) => { this.users = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadRoles(): void {
    this.api.getRoles().subscribe({
      next: (data) => { this.roles = data; }
    });
  }

  loadPermissions(): void {
    this.api.getPermissions().subscribe({
      next: (data) => { this.permissions = data; }
    });
  }

  registerUser(firstName: string, lastName: string, email: string, phone: string): void {
    const user = { firstName, lastName, email, phone };
    this.api.registerUser(user).subscribe({
      next: () => { this.loadUsers(); }
    });
  }

  login(email: string): void {
    this.api.login(email).subscribe({
      next: (user) => { this.selectedUserId = user.getId(); },
      error: (err) => console.error(err)
    });
  }

  modifyProfile(userId: number, firstName: string, lastName: string, email: string, phone: string): void {
    const user = { firstName, lastName, email, phone };
    this.api.modifyProfile(userId, user).subscribe({
      next: () => { this.loadUsers(); }
    });
  }
}
