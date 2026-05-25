import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Employee } from '../domain/model/entities/employee.entity';
import { EmployeeAssembler } from './assemblers/employee.assembler';
import { EmployeeResponse } from './responses/employee.response';
import { EmployeeResource } from './responses/employee.resource';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeApi extends BaseApi {
  private readonly endpoint = `${environment.apiBaseUrl}/employees`;

  constructor(private assembler: EmployeeAssembler) { super(); }

  getEmployees(): Observable<Employee[]> {
    return this.get<EmployeeResponse[]>(this.endpoint).pipe(
      map(responses => this.assembler.toEntitiesFromResponse(responses))
    );
  }

  createEmployee(employee: Employee): Observable<Employee> {
    const resource: EmployeeResource = this.assembler.toResourceFromEntity(employee);
    return this.post<EmployeeResponse>(this.endpoint, resource).pipe(
      map(r => this.assembler.toEntityFromResponse(r))
    );
  }

  modifyEmployee(employee: Employee): Observable<Employee> {
    const resource: EmployeeResource = this.assembler.toResourceFromEntity(employee);
    return this.put<EmployeeResponse>(`${this.endpoint}/${employee.getId()}`, resource).pipe(
      map(r => this.assembler.toEntityFromResponse(r))
    );
  }

  deleteEmployee(employeeId: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${employeeId}`);
  }
}
