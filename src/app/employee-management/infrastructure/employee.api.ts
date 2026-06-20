import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Employee } from '../domain/model/entities/employee.entity';
import { EmployeeAssembler } from './assemblers/employee.assembler';
import { EmployeeResponse } from './responses/employee.response';
import { EmployeeCreateResource } from './responses/employee-create.resource';
import { EmployeeUpdateResource } from './responses/employee-update.resource';
import { environment } from '../../../environments/environment';

/**
 * Matches the real backend exactly:
 *   GET    /api/v1/employees/{employeeId}
 *   POST   /api/v1/employees
 *   PUT    /api/v1/employees/{employeeId}
 *   DELETE /api/v1/employees/{employeeId}
 *
 * There is NO GET /api/v1/employees (no full listing) — employees
 * can only be looked up one at a time by ID.
 */
@Injectable({ providedIn: 'root' })
export class EmployeeApi extends BaseApi {
  private readonly endpoint = `${environment.apiBaseUrl}/employees`;

  constructor(private assembler: EmployeeAssembler) {
    super();
  }

  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.get<EmployeeResponse>(`${this.endpoint}/${employeeId}`).pipe(
      map((r) => this.assembler.toEntityFromResponse(r)),
    );
  }

  createEmployee(resource: EmployeeCreateResource): Observable<Employee> {
    return this.post<EmployeeResponse>(this.endpoint, resource).pipe(
      map((r) => this.assembler.toEntityFromResponse(r)),
    );
  }

  modifyEmployee(employeeId: number, resource: EmployeeUpdateResource): Observable<Employee> {
    return this.put<EmployeeResponse>(`${this.endpoint}/${employeeId}`, resource).pipe(
      map((r) => this.assembler.toEntityFromResponse(r)),
    );
  }

  deleteEmployee(employeeId: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${employeeId}`);
  }
}
