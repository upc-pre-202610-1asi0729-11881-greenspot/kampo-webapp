import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeStore } from '../../../application/employee.store';
import { EmployeeRole } from '../../../domain/model/enums/employee-role.enum';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  public store = inject(EmployeeStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  readonly roleOptions = Object.values(EmployeeRole);

  isEdit = false;
  employeeId: number | null = null;

  // NOTA: sin campo "status" — el backend lo asigna por defecto en creación,
  // y PUT no incluyó status en el ejemplo dado.
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    fieldId: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.employeeId = Number(id);
      this.store.findById(this.employeeId, (employee) => {
        this.form.patchValue({
          name: employee.getName(),
          email: employee.getEmail(),
          role: employee.getRole(),
          fieldId: employee.getFieldId(),
        });
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;

    if (this.isEdit && this.employeeId) {
      this.store.modifyEmployee(
        this.employeeId,
        v.name,
        v.email,
        v.role,
        v.fieldId,
        (updated) => {
          this.snackBar.open('Empleado actualizado.', 'OK', { duration: 2500 });
          this.router.navigate(['/employee-management', updated.getId()]);
        },
        (err) => {
          console.error(err);
          this.snackBar.open('No se pudo actualizar el empleado.', 'OK', { duration: 3000 });
        },
      );
    } else {
      this.store.createEmployee(
        v.name,
        v.email,
        v.role,
        v.fieldId,
        (created) => {
          this.snackBar.open('Empleado registrado.', 'OK', { duration: 2500 });
          this.router.navigate(['/employee-management', created.getId()]);
        },
        (err) => {
          console.error(err);
          this.snackBar.open('No se pudo registrar el empleado.', 'OK', { duration: 3000 });
        },
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/employee-management']);
  }
}
