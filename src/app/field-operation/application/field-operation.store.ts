import { computed, inject, Injectable, signal } from '@angular/core';
import { FieldVisit } from '../domain/model/entities/field-visit.entity';
import { Observation } from '../domain/model/entities/observation.entity';
import { FieldOperationApi } from '../infrastructure/field-operation.api';
import { FieldVisitStatus } from '../domain/model/enums/field-visit-status.enum';
import { Severity } from '../domain/model/enums/severity.enum';
import { finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FieldOperationStore {
  private readonly api = inject(FieldOperationApi);

  readonly fieldVisits = signal<FieldVisit[]>([]);
  readonly selectedFieldVisit = signal<FieldVisit | null>(null);
  readonly observations = signal<Observation[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly fieldVisitTableData = computed(() =>
    this.fieldVisits().map(fv => ({
      id: fv.getId(),
      fieldId: fv.getFieldId(),
      scheduledAt: fv.getScheduledAt(),
      doneAt: fv.getDoneAt(),
      status: fv.getStatus(),
      observationCount: fv.getObservations().length
    }))
  );

  loadFieldVisits(fieldId: number): void {
    this.isLoading.set(true);
    this.api.getFieldVisitsByField(fieldId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (visits) => {
          this.fieldVisits.set(visits);
          const allObs = visits.flatMap(v => v.getObservations());
          this.observations.set(allObs);
        },
        error: (err) => {
          console.error(err);
          this.error.set('No se pudieron cargar las visitas de campo');
        }
      });
  }

  scheduleFieldVisit(fieldId: number, scheduledAt: Date): void {
    const fieldVisit = new FieldVisit(0, fieldId, scheduledAt, null, FieldVisitStatus.SCHEDULED, []);
    this.api.scheduleFieldVisit(fieldVisit).subscribe({
      next: (created) => this.fieldVisits.update(list => [...list, created]),
      error: (err) => console.error(err)
    });
  }

  completeFieldVisit(fieldVisitId: number): void {
    this.api.completeFieldVisit(fieldVisitId).subscribe({
      next: (updated) => this.fieldVisits.update(list =>
        list.map(fv => fv.getId() === updated.getId() ? updated : fv)
      ),
      error: (err) => console.error(err)
    });
  }

  registerObservation(
    fieldVisitId: number,
    notes: string,
    pestName: string,
    pestSeverity: Severity,
    diseaseName: string,
    diseaseSeverity: Severity,
    recommendation: string
  ): void {
    const observation = new Observation(
      0, fieldVisitId, notes, pestName, pestSeverity,
      diseaseName, diseaseSeverity, recommendation, ''
    );
    this.api.registerObservation(observation).subscribe({
      next: (created) => this.observations.update(list => [...list, created]),
      error: (err) => console.error(err)
    });
  }

  uploadEvidence(fieldVisitId: number, file: File): void {
    this.api.uploadEvidence(fieldVisitId, file).subscribe({
      next: (url) => console.log('Evidence uploaded:', url),
      error: (err) => console.error(err)
    });
  }

  implementRecommendation(observationId: number, recommendation: string): void {
    this.api.implementRecommendation(observationId, recommendation).subscribe({
      next: (updated) => this.observations.update(list =>
        list.map(o => o.getId() === updated.getId() ? updated : o)
      ),
      error: (err) => console.error(err)
    });
  }

  selectFieldVisit(id: number): void {
    const found = this.fieldVisits().find(fv => fv.getId() === id) ?? null;
    this.selectedFieldVisit.set(found);
  }

  getFieldVisitById(id: number): FieldVisit | undefined {
    return this.fieldVisits().find(fv => fv.getId() === id);
  }
}
