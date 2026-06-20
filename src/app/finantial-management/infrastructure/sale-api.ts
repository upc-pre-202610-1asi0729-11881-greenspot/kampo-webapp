import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SaleCreateRequest } from './requests/sale-create.request';
import { SaleCreatedResponse } from './responses/sale-created.response';

/**
 * Independent service for the real backend's Sale aggregate.
 * POST /api/v1/sales — does NOT go through FinancialRecord/FinancialStore,
 * since the real backend treats Sale as its own aggregate, separate
 * from the mock-based financial-records endpoint the rest of the
 * financial module still uses.
 *
 * The JWT token is attached automatically via the global authInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class SaleApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/sales`;

  create(request: SaleCreateRequest): Observable<SaleCreatedResponse> {
    return this.http.post<SaleCreatedResponse>(this.endpoint, request);
  }

  getAll(): Observable<SaleCreatedResponse[]> {
    return this.http.get<SaleCreatedResponse[]>(this.endpoint);
  }

  getByFundo(fundoId: number): Observable<SaleCreatedResponse[]> {
    return this.http.get<SaleCreatedResponse[]>(`${this.endpoint}?fundoId=${fundoId}`);
  }
}
