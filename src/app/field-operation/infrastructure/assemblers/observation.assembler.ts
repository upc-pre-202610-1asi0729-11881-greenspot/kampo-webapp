import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Observation } from '../../domain/model/entities/observation.entity';
import { ObservationResponse } from '../responses/observation.response';
import { ObservationResource } from '../responses/observation.resource';
import { Severity } from '../../domain/model/enums/severity.enum';

export class ObservationAssembler extends BaseAssembler<Observation, ObservationResponse> {
  toEntityFromResponse(response: ObservationResponse): Observation {
    return new Observation(
      response.id,
      response.fieldVisitId,
      response.notes,
      response.pestName,
      response.pestSeverity as Severity,
      response.diseaseName,
      response.diseaseSeverity as Severity,
      response.recommendation,
      response.evidenceUrl
    );
  }

  toResourceFromEntity(entity: Observation): ObservationResource {
    return new ObservationResource(
      entity.getFieldVisitId(),
      entity.getNotes(),
      entity.getPestName(),
      entity.getPestSeverity(),
      entity.getDiseaseName(),
      entity.getDiseaseSeverity(),
      entity.getRecommendation()
    );
  }
}
