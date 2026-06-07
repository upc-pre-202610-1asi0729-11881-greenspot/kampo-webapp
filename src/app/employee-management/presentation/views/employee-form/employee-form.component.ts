import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../../domain/model/entities/employee.entity';
import { EmployeeRole } from '../../../domain/model/enums/employee-role.enum';
import { EmployeeStatus } from '../../../domain/model/enums/employee-status.enum';
import { EmployeeStore } from '../../../application/employee.store';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit {
  @Input() employee: Employee | null = null;
  @Output() formSubmit = new EventEmitter<Employee>();
  @Output() cancelForm = new EventEmitter<void>();

  private router = inject(Router);
  private store = inject(EmployeeStore);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  roles = Object.values(EmployeeRole);
  statuses = Object.values(EmployeeStatus);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.employee?.getName() ?? '', Validators.required],
      email: [this.employee?.getEmail() ?? '', [Validators.required, Validators.email]],
      role: [this.employee?.getRole() ?? '', Validators.required],
      fieldId: [this.employee?.getFieldId() ?? 1, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const val = this.form.value;
    const employee = new Employee(
      this.employee?.getId() ?? 0,
      val.name,
      val.email,
      val.role,
      this.employee?.getStatus() ?? EmployeeStatus.ACTIVE,
      val.fieldId,
    );

    if (employee.getId() > 0) {
      this.store.modifyEmployee(employee);
    } else {
      this.store.createEmployee(employee);
    }

    this.formSubmit.emit(employee);
    this.router.navigate(['/employee-management']);
  }

  onCancel(): void {
    this.cancelForm.emit();
    this.router.navigate(['/employee-management']);
  }
}
