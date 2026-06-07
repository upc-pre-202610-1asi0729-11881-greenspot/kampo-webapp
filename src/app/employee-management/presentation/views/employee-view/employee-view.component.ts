import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeStore } from '../../../application/employee.store';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { EmployeeDetailComponent } from '../employee-detail/employee-detail.component';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, EmployeeListComponent, EmployeeFormComponent, EmployeeDetailComponent],
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.css',
})
export class EmployeeViewComponent implements OnInit {
  showForm = false;

  constructor(public store: EmployeeStore) {}

  ngOnInit(): void {
    this.store.getEmployees();
  }

  onCreateEmployee(): void {
    this.store.selectEmployee(0);
    this.showForm = true;
  }

  onSelectEmployee(id: number): void {
    this.store.selectEmployee(id);
    this.showForm = true;
  }

  onDeleteEmployee(id: number): void {
    this.store.deleteEmployee(id);
  }

  onFormSubmit(employee: any): void {
    if (employee.getId && employee.getId() > 0) {
      this.store.modifyEmployee(employee);
    } else {
      this.store.createEmployee(employee);
    }
    this.showForm = false;
  }

}
