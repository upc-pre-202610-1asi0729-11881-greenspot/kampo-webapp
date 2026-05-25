import { computed, Injectable, signal } from '@angular/core';
import { Report } from '../domain/model/entities/report.entity';
import { Recommendation } from '../domain/model/entities/recommendation.entity';
import { ReportApi } from '../infrastructure/report-api';
import { ReportType } from '../domain/model/enums/report-type.enum';
import { PriorityLevel } from '../domain/model/enums/priority-level.enum';


@Injectable({ providedIn: 'root' })
export class ReportStore {
  private readonly _reports = signal<Report[]>([]);
  private readonly _recommendations = signal<Recommendation[]>([]);
  private readonly _selectedReportId = signal<number | null>(null);
  private readonly _isLoading = signal<boolean>(false);

  readonly reports = computed(() => this._reports());
  readonly recommendations = computed(() => this._recommendations());
  readonly selectedReportId = computed(() => this._selectedReportId());
  readonly isLoading = computed(() => this._isLoading());

  readonly selectedReport = computed(
    () => this._reports().find((r) => r.getId() === this._selectedReportId()) ?? null,
  );

  constructor(private api: ReportApi) {}

  getReports(): void {
    this._isLoading.set(true);
    this.api.getReports().subscribe({
      next: (reports) => {
        this._reports.set(reports);
        this._isLoading.set(false);
      },
      error: () => this._isLoading.set(false),
    });
  }
  getRecommendations(reportId: number): void {
    this._isLoading.set(true);
    this.api.getRecommendations(reportId).subscribe({
      next: (recs) => {
        this._recommendations.set(recs);
        this._isLoading.set(false);
      },
      error: () => this._isLoading.set(false),
    });
  }
  generateReport(type: ReportType, userId: number, seasonsID: number): void {
    this._isLoading.set(true);
    this.api.generateReport(type, userId, seasonsID).subscribe({
      next: (report) => {
        this._reports.update((list) => [...list, report]);
        this._isLoading.set(false);
      },
      error: () => this._isLoading.set(false),
    });
  }
  generateRecommendation(reportsId: number, priority: PriorityLevel): void {
    this._isLoading.set(true);
    this.api.generateRecommendation(reportsId, priority).subscribe({
      next: (rec) => {
        this._recommendations.update((list) => [...list, rec]);
        this._isLoading.set(false);
      },
      error: () => this._isLoading.set(false),
    });
  }

  implementRecommendation(recommendationId: number): void {
    this._isLoading.set(true);
    this.api.implementRecommendation(recommendationId).subscribe({
      next: (updated) => {
        this._recommendations.update((list) =>
          list.map((r) => (r.getId() === updated.getId() ? updated : r)),
        );
        this._isLoading.set(false);
      },
      error: () => this._isLoading.set(false),
    });
  }

  selectReport(id: number): void {
    this._selectedReportId.set(id);
  }
}
