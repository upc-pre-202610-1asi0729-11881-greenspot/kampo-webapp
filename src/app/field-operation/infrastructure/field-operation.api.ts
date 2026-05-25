import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FieldVisit } from '../domain/model/entities/field-visit.entity';
import { Observation } from '../domain/model/entities/observation.entity';
import { FieldVisitResponse } from './responses/field-visit.response';
import { ObservationResponse } from './responses/observation.response';
import { FieldVisitAssembler } from './assemblers/field-visit.assembler';
import { ObservationAssembler } from './assemblers/observation.assembler';

@Injectable({ providedIn: 'root' })
export class FieldOperationApi {
  private readonly http = inject(HttpClient);
  private readonly fieldVisitsEndpoint = `${environment.apiBaseUrl}/field-visits`;
  private readonly observationsEndpoint = `${environment.apiBaseUrl}/observations`;
  private readonly evidenceEndpoint = `${environment.apiBaseUrl}/evidence`;

  private readonly fieldVisitAssembler = new FieldVisitAssembler();
  private readonly observationAssembler = new ObservationAssembler();

  getFieldVisitsByField(fieldId: number): Observable<FieldVisit[]> {
    const params = new HttpParams().set('fieldId', String(fieldId));
    return this.http.get<FieldVisitResponse[]>(this.fieldVisitsEndpoint, { params }).pipe(
      map(responses => responses.map(r => this.fieldVisitAssembler.toEntityFromResponse(r)))
    );
  }

  scheduleFieldVisit(fieldVisit: FieldVisit): Observable<FieldVisit> {
    const body = this.fieldVisitAssembler.toResourceFromEntity(fieldVisit);
    return this.http.post<FieldVisitResponse>(this.fieldVisitsEndpoint, body).pipe(
      map(res => this.fieldVisitAssembler.toEntityFromResponse(res))
    );
  }

  completeFieldVisit(fieldVisitId: number): Observable<FieldVisit> {
    const url = `${this.fieldVisitsEndpoint}/${fieldVisitId}/complete`;
    return this.http.patch<FieldVisitResponse>(url, {}).pipe(
      map(res => this.fieldVisitAssembler.toEntityFromResponse(res))
    );
  }

  registerObservation(observation: Observation): Observable<Observation> {
    const body = this.observationAssembler.toResourceFromEntity(observation);
    return this.http.post<ObservationResponse>(this.observationsEndpoint, body).pipe(
      map(res => this.observationAssembler.toEntityFromResponse(res))
    );
  }

  uploadEvidence(fieldVisitId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fieldVisitId', String(fieldVisitId));
    return this.http.post<{ url: string }>(`${this.evidenceEndpoint}`, formData).pipe(
      map(res => res.url)
    );
  }

  implementRecommendation(observationId: number, recommendation: string): Observable<Observation> {
    const url = `${this.observationsEndpoint}/${observationId}/recommendation`;
    return this.http.patch<ObservationResponse>(url, { recommendation }).pipe(
      map(res => this.observationAssembler.toEntityFromResponse(res))
    );
  }
}
