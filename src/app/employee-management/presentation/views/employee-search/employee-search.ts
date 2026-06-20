import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeStore } from '../../../application/employee.store';

/**
 * El backend real no tiene GET /api/v1/employees (listado completo) —
 * solo búsqueda por ID. Esta pantalla reemplaza la tabla tradicional
 * por un buscador, más honesto con lo que el backend soporta.
 */
@Component({
  selector: 'app-employee-search',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './employee-search.html',
  styleUrl: './employee-search.css',
})
export class EmployeeSearch {
  public store = inject(EmployeeStore);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  searchId: number | null = null;

  onSearch(): void {
    if (!this.searchId) return;

    this.store.findById(
      this.searchId,
      (employee) => {
        this.router.navigate(['/employee-management', employee.getId()]);
      },
      () => {
        this.snackBar.open('No se encontró un empleado con ese ID.', 'OK', { duration: 3000 });
      },
    );
  }

  navigateToNew(): void {
    this.router.navigate(['/employee-management/new']);
  }

  viewRecent(employeeId: number): void {
    this.router.navigate(['/employee-management', employeeId]);
  }
}
