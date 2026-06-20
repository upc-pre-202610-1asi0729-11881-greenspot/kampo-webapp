import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SeasonResponse } from '../responses/season.response';
import { SeasonCreateResource } from '../responses/season-create.resource';
import { SeasonStatus } from '../../domain/model/season-status.enum';
import { environment } from '../../../../environments/environment';

/**
 * Matches the real backend endpoints exactly:
 *   GET    /api/v1/seasons?fieldId=X        — list seasons by field
 *   GET    /api/v1/seasons/{id}             — get one season
 *   GET    /api/v1/seasons/active?fieldId=X — active season for a field
 *   POST   /api/v1/seasons                  — { fieldId, cropName, startAt }
 *   PATCH  /api/v1/seasons/{id}/status      — { status }
 *   PATCH  /api/v1/seasons/{id}/end         — no body
 *   PATCH  /api/v1/seasons/{id}/crop        — { cropId } (adjust if backend expects cropName too)
 *
 * There is NO PUT /{id} and NO DELETE /{id} — seasons are never deleted,
 * only progressed through status changes and ended.
 */
@Injectable({ providedIn: 'root' })
export class SeasonService {
  private readonly http = inject(HttpClient);
  private readonly resourcePath = `${environment.apiBaseUrl}/seasons`;

  getByField(fieldId: number): Observable<SeasonResponse[]> {
    const params = new HttpParams().set('fieldId', String(fieldId));
    return this.http.get<SeasonResponse[]>(this.resourcePath, { params });
  }

  getById(id: number): Observable<SeasonResponse> {
    return this.http.get<SeasonResponse>(`${this.resourcePath}/${id}`);
  }

  getActiveByField(fieldId: number): Observable<SeasonResponse> {
    const params = new HttpParams().set('fieldId', String(fieldId));
    return this.http.get<SeasonResponse>(`${this.resourcePath}/active`, { params });
  }

  create(body: SeasonCreateResource): Observable<SeasonResponse> {
    return this.http.post<SeasonResponse>(this.resourcePath, body);
  }

  updateStatus(seasonId: number, status: SeasonStatus): Observable<SeasonResponse> {
    return this.http.patch<SeasonResponse>(`${this.resourcePath}/${seasonId}/status`, { status });
  }

  endSeason(seasonId: number): Observable<SeasonResponse> {
    return this.http.patch<SeasonResponse>(`${this.resourcePath}/${seasonId}/end`, {});
  }

  assignCrop(seasonId: number, cropId: number): Observable<SeasonResponse> {
    return this.http.patch<SeasonResponse>(`${this.resourcePath}/${seasonId}/crop`, { cropId });
  }
}
