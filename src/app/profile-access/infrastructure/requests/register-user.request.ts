/**
 * Matches the backend's CreateUserResource — note the field is "password",
 * not "rawPassword" (that naming is internal to the domain command).
 */
export class RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;

  constructor(firstName: string, lastName: string, email: string, phone: string, password: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.password = password;
  }
}
