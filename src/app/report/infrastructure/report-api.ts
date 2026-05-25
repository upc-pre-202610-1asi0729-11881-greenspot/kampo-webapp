import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportAssembler } from './assemblers/report-assembler.assembler';
import { RecommendationAssembler } from './assemblers/recommendation-assembler.assembler';
import { map, Observable } from 'rxjs';
import { ReportResource, ReportResponse } from './responses/report-response.response';
import {
  RecommendationResource,
  RecommendationResponse,
} from './responses/recommendation-response.response';
import { ReportType } from '../domain/model/enums/report-type.enum';
import { PriorityLevel } from '../domain/model/enums/priority-level.enum';
import { Recommendation } from '../domain/model/entities/recommendation.entity';
import {Report} from '../domain/model/entities/report.entity';

@Injectable({ providedIn: 'root' })
export class ReportApi {
  private readonly reportsEndpoint = '/api/reports';
  private readonly recommendationEndpoint = '/api/recommendations';

  constructor(
    private http: HttpClient,
    private reportAssembler: ReportAssembler,
    private recommendationAssembler: RecommendationAssembler,
  ) {}

  getReports(): Observable<Report[]> {
    return this.http
      .get<ReportResponse[]>(this.reportsEndpoint)
      .pipe(map((res) => res.map((r) => this.reportAssembler.toEntityFromResponse(r))));
  }
  getRecommendations(reportId: number): Observable<Recommendation[]> {
    return this.http
      .get<RecommendationResponse[]>(`${this.recommendationEndpoint}?reportId=${reportId}`)
      .pipe(map((res) => res.map((r) => this.recommendationAssembler.toEntityFromResponse(r))));
  }

  generateReport(type: ReportType, usersId: number, seasonsId: number): Observable<Report> {
    const resource: ReportResource = { type, usersId, seasonsId };
    return this.http
      .post<ReportResponse>(this.reportsEndpoint, resource)
      .pipe(map((r) => this.reportAssembler.toEntityFromResponse(r)));
  }

  generateRecommendation(reportsId: number, priority: PriorityLevel): Observable<Recommendation> {
    const resource: RecommendationResource = { reportsId, priority };
    return this.http
      .post<RecommendationResponse>(this.recommendationEndpoint, resource)
      .pipe(map((r) => this.recommendationAssembler.toEntityFromResponse(r)));
  }

  implementRecommendation(recommendationId: number): Observable<Recommendation> {
    return this.http
      .patch<RecommendationResponse>(
        `${this.recommendationEndpoint}/${recommendationId}/implement`,
        {},
      )
      .pipe(map((r) => this.recommendationAssembler.toEntityFromResponse(r)));
  }
}
