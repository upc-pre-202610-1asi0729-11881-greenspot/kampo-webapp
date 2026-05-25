import { BaseResponse } from '../../../shared/infrastructure/base-response';
import { ObservationResponse } from './observation.response';

export class FieldVisitResponse extends BaseResponse {
  fieldId: number;
  scheduledAt: string;
  doneAt: string | null;
  status: string;
  observations: ObservationResponse[];

  constructor() {
    super(0);
    this.fieldId = 0;
    this.scheduledAt = '';
    this.doneAt = null;
    this.status = '';
    this.observations = [];
  }
}
