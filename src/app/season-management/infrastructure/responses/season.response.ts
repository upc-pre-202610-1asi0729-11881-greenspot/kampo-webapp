import { BaseResponse } from '../../../shared/infrastructure/base-response';

/**
 * Matches the real backend response:
 * { id, fieldId, cropId, cropName, status, startedAt, endedAt }
 */
export class SeasonResponse extends BaseResponse {
  fieldId: number;
  cropId: number;
  cropName: string;
  status: string;
  startedAt: string;
  endedAt: string | null;

  constructor() {
    super(0);
    this.fieldId = 0;
    this.cropId = 0;
    this.cropName = '';
    this.status = '';
    this.startedAt = '';
    this.endedAt = null;
  }
}
