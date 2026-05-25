import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrganizationStore } from '../../../application/organization.store';
import { RouterModule } from '@angular/router';
import {CommonModule} from '@angular/common';
@Component({
  selector: 'app-organization-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './organization-list.html',
  styleUrl: './organization-list.css'
})
export class OrganizationListComponent {
  public store = inject(OrganizationStore);
  private router = inject(Router);

  displayedColumns: string[] = ['id', 'name', 'ruc', 'actions'];

  navigateToNew() {
    this.router.navigate(['/organization-management/new']);
  }

  edit(id: number) {
    this.router.navigate(['/organization-management/edit', id]);
  }

  delete(id: number) {
    this.store.deleteOrganization(id);
  }
}
