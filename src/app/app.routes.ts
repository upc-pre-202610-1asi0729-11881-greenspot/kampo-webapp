import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'organization-management',
    loadChildren: () =>
      import('./organization-management/presentation/views/organization-management.routes').then(
        (m) => m.ORGANIZATION_ROUTES,
      ),
  },

  {
    path: 'profile-access',
    loadChildren: () =>
      import('./profile-access/presentation/views/profile-access.routes').then(
        (m) => m.PROFILE_ACCESS_ROUTES,
      ),
  },

  {
    path: 'season-management',
    loadChildren: () =>
      import('./season-management/presentation/views/season-management.routes').then(
        (m) => m.SEASON_ROUTES,
      ),
  },

  {
    path: 'inventory-management',
    loadChildren: () =>
      import('./inventory-management/presentation/views/inventory-management.routes').then(
        (m) => m.INVENTORY_MANAGEMENT_ROUTES,
      ),
  },

  {
    path: 'finantial-management',
    loadChildren: () =>
      import('./finantial-management/presentation/views/finantial-management.routes').then(
        (m) => m.FINANTIAL_MANAGEMENT_ROUTES,
      ),
  },

  {
    path: 'report-management',
    loadChildren: () =>
      import('./report/presentation/views/report.routes').then((m) => m.REPORT_ROUTES),
  },

  {
    path: 'employee-management',
    loadChildren: () =>
      import('./employee-management/presentation/views/employee.routes').then(
        (m) => m.EMPLOYEE_ROUTES,
      ),
  },

  {
    path: 'field-operation',
    loadChildren: () =>
      import('./field-operation/presentation/views/field-operation.routes').then(
        (m) => m.FIELD_OPERATION_ROUTES,
      ),
  },

  {
    path: 'alert-management',
    loadChildren: () =>
      import('./alert-management/presentation/views/alert.route').then((m) => m.ALERT_ROUTES),
  },

  {
    path: 'subscription',
    loadChildren: () =>
      import('./subscription/presentation/views/subscription.route').then(
        (m) => m.SUBSCRIPTION_ROUTES,
      ),
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./shared/presentation/views/dashboard/dashboard').then((m) => m.Dashboard),
  },

  {
    path: 'settings',
    loadComponent: () =>
      import('./shared/presentation/views/settings/settings').then((m) => m.Settings),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  { path: '**', redirectTo: 'dashboard' },
];
