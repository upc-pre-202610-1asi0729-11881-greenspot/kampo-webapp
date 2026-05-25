import { BaseEntity } from '../../../../shared/infrastructure/base-entity';
import { FieldVisitStatus } from '../enums/field-visit-status.enum';
import { Observation } from './observation.entity';

export class FieldVisit extends BaseEntity {
  private fieldId: number;
  private scheduledAt: Date;
  private doneAt: Date | null;
  private status: FieldVisitStatus;
  private observations: Observation[];

  constructor(
    id: number,
    fieldId: number,
    scheduledAt: Date,
    doneAt: Date | null,
    status: FieldVisitStatus,
    observations: Observation[]
  ) {
    super(id);
    this.fieldId = fieldId;
    this.scheduledAt = scheduledAt;
    this.doneAt = doneAt;
    this.status = status;
    this.observations = observations;
  }

  getFieldId(): number { return this.fieldId; }
  getScheduledAt(): Date { return this.scheduledAt; }
  getDoneAt(): Date | null { return this.doneAt; }
  getStatus(): FieldVisitStatus { return this.status; }
  getObservations(): Observation[] { return this.observations; }

  complete(): void {
    this.status = FieldVisitStatus.DONE;
    this.doneAt = new Date();
  }

  addObservation(observation: Observation): void {
    this.observations = [...this.observations, observation];
  }
}
