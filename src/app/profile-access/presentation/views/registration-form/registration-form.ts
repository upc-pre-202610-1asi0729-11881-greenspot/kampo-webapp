import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProfileAccessStore } from '../../../application/profile-access.store';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.css'
})
export class RegistrationFormComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';

  constructor(public store: ProfileAccessStore) {}

  onRegisterUser(): void {
    if (this.firstName && this.lastName && this.email) {
      this.store.registerUser(this.firstName, this.lastName, this.email, this.phone);
    }
  }
}
