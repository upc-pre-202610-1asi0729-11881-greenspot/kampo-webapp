/**
 * Matches PUT /api/v1/employees/{employeeId}.
 * Assumed same shape as creation (name, email, role, fieldId) since
 * no separate example was given — adjust if the backend expects status too.
 */
export class EmployeeUpdateResource {
  name: string;
  email: string;
  role: string;
  fieldId: number;

  constructor(name: string, email: string, role: string, fieldId: number) {
    this.name = name;
    this.email = email;
    this.role = role;
    this.fieldId = fieldId;
  }
}
