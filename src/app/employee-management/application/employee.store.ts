import { Injectable, signal } from '@angular/core';
import { EmployeeApi } from '../infrastructure/employee.api';
import { Employee } from '../domain/model/entities/employee.entity';
import { EmployeeCreateResource } from '../infrastructure/responses/employee-create.resource';
import { EmployeeUpdateResource } from '../infrastructure/responses/employee-update.resource';

/**
 * NOTA: el backend real NO tiene GET /api/v1/employees (listado completo) —
 * solo GET /{id}. Por eso `employees` aquí es una lista LOCAL que crece a
 * medida que se crean o consultan empleados individualmente; no representa
 * "todos los empleados del sistema", solo los que esta sesión ha tocado.
 */
@Injectable({ providedIn: 'root' })
export class EmployeeStore {
  private _employees = signal<Employee[]>([]);
  private _selectedEmployee = signal<Employee | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  employees = this._employees.asReadonly();
  selectedEmployee = this._selectedEmployee.asReadonly();
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  constructor(private employeeApi: EmployeeApi) {}

  /**
   * Busca un empleado por ID (único método de lectura disponible).
   * Lo agrega/actualiza en la lista local y lo marca como seleccionado.
   */
  findById(
    employeeId: number,
    onSuccess?: (employee: Employee) => void,
    onError?: (err: unknown) => void,
  ): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.employeeApi.getEmployeeById(employeeId).subscribe({
      next: (employee) => {
        this._selectedEmployee.set(employee);
        this.upsertLocal(employee);
        onSuccess?.(employee);
      },
      error: (err) => {
        this._error.set('Empleado no encontrado');
        this._selectedEmployee.set(null);
        onError?.(err);
      },
      complete: () => this._isLoading.set(false),
    });
  }

  createEmployee(
    name: string,
    email: string,
    role: string,
    fieldId: number,
    onSuccess?: (created: Employee) => void,
    onError?: (err: unknown) => void,
  ): void {
    this._isLoading.set(true);
    const resource = new EmployeeCreateResource(name, email, role, fieldId);

    this.employeeApi.createEmployee(resource).subscribe({
      next: (created) => {
        this.upsertLocal(created);
        onSuccess?.(created);
      },
      error: (err) => onError?.(err),
      complete: () => this._isLoading.set(false),
    });
  }

  modifyEmployee(
    employeeId: number,
    name: string,
    email: string,
    role: string,
    fieldId: number,
    onSuccess?: (updated: Employee) => void,
    onError?: (err: unknown) => void,
  ): void {
    this._isLoading.set(true);
    const resource = new EmployeeUpdateResource(name, email, role, fieldId);

    this.employeeApi.modifyEmployee(employeeId, resource).subscribe({
      next: (updated) => {
        this.upsertLocal(updated);
        this._selectedEmployee.set(updated);
        onSuccess?.(updated);
      },
      error: (err) => onError?.(err),
      complete: () => this._isLoading.set(false),
    });
  }

  deleteEmployee(
    employeeId: number,
    onSuccess?: () => void,
    onError?: (err: unknown) => void,
  ): void {
    this._isLoading.set(true);

    this.employeeApi.deleteEmployee(employeeId).subscribe({
      next: () => {
        this._employees.update((list) => list.filter((e) => e.getId() !== employeeId));
        if (this._selectedEmployee()?.getId() === employeeId) {
          this._selectedEmployee.set(null);
        }
        onSuccess?.();
      },
      error: (err) => onError?.(err),
      complete: () => this._isLoading.set(false),
    });
  }

  selectEmployee(employeeId: number): void {
    const found = this._employees().find((e) => e.getId() === employeeId) ?? null;
    this._selectedEmployee.set(found);
  }

  clearSelection(): void {
    this._selectedEmployee.set(null);
    this._error.set(null);
  }

  private upsertLocal(employee: Employee): void {
    this._employees.update((list) => {
      const exists = list.some((e) => e.getId() === employee.getId());
      return exists
        ? list.map((e) => (e.getId() === employee.getId() ? employee : e))
        : [...list, employee];
    });
  }
}
