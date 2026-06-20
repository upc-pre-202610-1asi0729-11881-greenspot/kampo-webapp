import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeStore } from '../../../application/employee.store';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './employee-detail.component.html',
})
export class EmployeeDetailComponent implements OnInit {
  public store = inject(EmployeeStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.store.findById(id);
  }

  edit(): void {
    const employee = this.store.selectedEmployee();
    if (employee) {
      this.router.navigate(['/employee-management', employee.getId(), 'edit']);
    }
  }

  onDelete(): void {
    const employee = this.store.selectedEmployee();
    if (!employee) return;
    if (
      !confirm(`¿Eliminar al empleado "${employee.getName()}"? Esta acción no se puede deshacer.`)
    )
      return;

    this.store.deleteEmployee(
      employee.getId(),
      () => {
        this.snackBar.open('Empleado eliminado.', 'OK', { duration: 2500 });
        this.router.navigate(['/employee-management']);
      },
      (err) => {
        console.error(err);
        this.snackBar.open('No se pudo eliminar el empleado.', 'OK', { duration: 3000 });
      },
    );
  }

  back(): void {
    this.router.navigate(['/employee-management']);
  }
}
