import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrganizationResponse } from '../responses/organization.response';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly http = inject(HttpClient);
  private resourcePath = `${environment.apiBaseUrl}/organizations`;

  getAll(): Observable<OrganizationResponse[]> {
    return this.http.get<OrganizationResponse[]>(this.resourcePath);
  }

  getById(id: number): Observable<OrganizationResponse> {
    return this.http.get<OrganizationResponse>(`${this.resourcePath}/${id}`);
  }

  create(item: any): Observable<OrganizationResponse> {
    return this.http.post<OrganizationResponse>(this.resourcePath, item);
  }

  update(id: number, item: any): Observable<OrganizationResponse> {
    return this.http.put<OrganizationResponse>(`${this.resourcePath}/${id}`, item);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.resourcePath}/${id}`);
  }

  // organization.service.ts
  createOrganization(organization: any): Observable<any> {
    return this.http.post('http://localhost:3000/organizations', organization);
  }

}
