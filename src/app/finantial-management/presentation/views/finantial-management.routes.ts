import { Routes } from '@angular/router';

const shell = () =>
  import('./financial-shell/financial-shell').then((m) => m.FinancialShellComponent);

const expenseList = () =>
  import('./expensive-list-component/expensive-list-component').then((m) => m.ExpenseListComponent);

const expenseForm = () =>
  import('./expensive-form-component/expensive-form-component').then((m) => m.ExpenseFormComponent);

const incomeList = () =>
  import('./income-list-component/income-list-component').then((m) => m.IncomeListComponent);

const saleList = () =>
  import('./sales-list-component/sales-list-component').then((m) => m.SaleListComponent);

const profitDashboard = () =>
  import('./profit-dashboard-component/profit-dashboard-component').then(
    (m) => m.ProfitabilityDashboardComponent,
  );

export const FINANTIAL_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'gastos' },
      {
        path: 'gastos',
        children: [
          { path: '', loadComponent: expenseList },
          { path: 'nuevo', loadComponent: expenseForm },
        ],
      },
      { path: 'ingresos', loadComponent: incomeList },
      { path: 'ventas', loadComponent: saleList },
      { path: 'rentabilidad', loadComponent: profitDashboard },
    ],
  },
];
