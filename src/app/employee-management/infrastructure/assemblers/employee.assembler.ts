import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { EmployeeResponse } from '../responses/employee.response';
import { EmployeeResource } from '../responses/employee.resource';
import { Employee } from '../../domain/model/entities/employee.entity';

@Injectable({ providedIn: 'root' })
export class EmployeeAssembler extends BaseAssembler<Employee, EmployeeResponse> {
  toEntityFromResponse(response: any): Employee {
    return new Employee(

      Number(response['id']) || 0,
      response['name'] ?? '',
      response['email'] ?? '',
      response['role'] ?? '',
      response['status'] ?? 'ACTIVE',
      Number(response['fieldId']) || 0,
    );
  }

  toResourceFromEntity(entity: Employee): EmployeeResource {
    return {
      name: entity.getName(),
      email: entity.getEmail(),
      role: entity.getRole(),
      status: entity.getStatus(),
      fieldId: entity.getFieldId(),
    };
  }
}
