import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProfileAccessStore } from '../../../application/profile-access.store';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginFormComponent {
  email: string = '';
  password: string = '';

  constructor(
    public store: ProfileAccessStore,
    private router: Router,
  ) {}

  onLogin(): void {
    if (this.email && this.password) {
      this.store.login(this.email, this.password);
    }
  }
}
