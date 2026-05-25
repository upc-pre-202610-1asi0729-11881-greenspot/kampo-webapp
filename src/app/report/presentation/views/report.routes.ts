import { Routes } from '@angular/router';

const reportView = () =>
  import('./report-view-component/report-view-component.component').then((m) => m.ReportViewComponentComponent);

const reportList = () =>
  import('./report-list-component/report-list-component.component').then(
    (m) => m.ReportListComponentComponent,
  );

const recommendationList = () =>
  import('./recommendation-list-component/recommendation-list-component.component').then(
    (m) => m.RecommendationListComponentComponent,
  );

const reportFile = () =>
  import('./report-file-component/report-file-component.component').then(
    (m) => m.ReportFileComponentComponent,
  );

export const REPORT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: reportView,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'lista' },
      { path: 'lista', loadComponent: reportList },
      { path: ':id/archivo', loadComponent: reportFile },
      { path: ':id/recomendaciones', loadComponent: recommendationList },
    ],
  },
];
