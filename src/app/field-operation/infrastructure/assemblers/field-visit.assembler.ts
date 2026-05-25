import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { FieldVisit } from '../../domain/model/entities/field-visit.entity';
import { FieldVisitResponse } from '../responses/field-visit.response';
import { FieldVisitResource } from '../responses/field-visit.resource';
import { FieldVisitStatus } from '../../domain/model/enums/field-visit-status.enum';
import { ObservationAssembler } from './observation.assembler';

export class FieldVisitAssembler extends BaseAssembler<FieldVisit, FieldVisitResponse> {
  private readonly observationAssembler = new ObservationAssembler();

  toEntityFromResponse(response: FieldVisitResponse): FieldVisit {
    const observations = response.observations
      ? response.observations.map(o => this.observationAssembler.toEntityFromResponse(o))
      : [];
    return new FieldVisit(
      response.id,
      response.fieldId,
      new Date(response.scheduledAt),
      response.doneAt ? new Date(response.doneAt) : null,
      response.status as FieldVisitStatus,
      observations
    );
  }

  toResourceFromEntity(entity: FieldVisit): FieldVisitResource {
    return new FieldVisitResource(
      entity.getFieldId(),
      entity.getScheduledAt().toISOString()
    );
  }
}
