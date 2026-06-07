import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { EmployeeStore } from '../../../application/employee.store';
import { Employee } from '../../../domain/model/entities/employee.entity';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent implements OnInit {
  private store = inject(EmployeeStore);
  private router = inject(Router);

  displayedColumns = ['name', 'email', 'role', 'status', 'actions'];

  get employees(): Employee[] {
    return this.store.employees();
  }

  get isLoading(): boolean {
    return this.store.isLoading();
  }

  ngOnInit(): void {
    this.store.getEmployees();
    setTimeout(() => {
      console.log('Employees:', this.store.employees());
    }, 2000);
  }

  onSelect(id: number): void {
    this.router.navigate(['/employee-management', id, 'edit']);
  }

  onDelete(id: number): void {
    this.store.deleteEmployee(id);
  }
}
