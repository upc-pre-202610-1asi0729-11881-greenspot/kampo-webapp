import { Routes } from '@angular/router';

/**
 * El backend real no tiene GET /api/v1/employees (listado completo) —
 * por eso la ruta raíz es un buscador por ID (EmployeeSearchComponent),
 * no una tabla. employee-view y employee-list quedaron obsoletos y
 * deben eliminarse del proyecto.
 */
export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./employee-search/employee-search').then((m) => m.EmployeeSearch),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./employee-form/employee-form.component').then((m) => m.EmployeeFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./employee-detail/employee-detail.component').then((m) => m.EmployeeDetailComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./employee-form/employee-form.component').then((m) => m.EmployeeFormComponent),
  },
];
