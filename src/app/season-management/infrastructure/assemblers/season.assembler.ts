import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Season } from '../../domain/model/season.entity';
import { SeasonStatus } from '../../domain/model/season-status.enum';
import { SeasonResponse } from '../responses/season.response';

export class SeasonAssembler extends BaseAssembler<Season, SeasonResponse> {
  toEntityFromResponse(response: any): Season {
    const startedAt = response['startedAt'] ? new Date(response['startedAt']) : new Date();
    const endedAt = response['endedAt'] ? new Date(response['endedAt']) : null;
    const rawId = response['id'];
    const id = isNaN(Number(rawId)) ? rawId : Number(rawId);
    return new Season(
      id,
      Number(response['fieldId']) || 0,
      Number(response['cropId']) || 0,
      response['cropName'] ?? '',
      response['status'] as SeasonStatus,
      startedAt,
      endedAt,
    );
  }
}
