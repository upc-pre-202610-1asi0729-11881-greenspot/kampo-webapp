import { Routes } from '@angular/router';

const fieldVisitList = () =>
  import('./field-visit-list/field-visit-list').then(m => m.FieldVisitListComponent);

const fieldVisitForm = () =>
  import('./field-visit-form/field-visit-form').then(m => m.FieldVisitFormComponent);

const observationForm = () =>
  import('./observation-form/observation-form').then(m => m.ObservationFormComponent);

const observationDetail = () =>
  import('./observation-detail/observation-detail').then(m => m.ObservationDetailComponent);

export const FIELD_OPERATION_ROUTES: Routes = [
  { path: '', loadComponent: fieldVisitList },
  { path: 'new', loadComponent: fieldVisitForm },
  { path: 'view/:id', loadComponent: observationDetail },
  { path: 'observations/new', loadComponent: observationForm },
];
