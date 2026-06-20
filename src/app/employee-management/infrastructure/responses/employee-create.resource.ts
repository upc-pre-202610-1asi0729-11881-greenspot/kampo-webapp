/**
 * Matches the real backend's POST /api/v1/employees body exactly:
 * { name, email, role, fieldId } — sin status, el backend lo asigna
 * por defecto (probablemente ACTIVE).
 */
export class EmployeeCreateResource {
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
