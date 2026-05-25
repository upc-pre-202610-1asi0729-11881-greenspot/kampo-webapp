import { BaseResponse } from '../../../shared/infrastructure/base-response';

export class ObservationResponse extends BaseResponse {
  fieldVisitId: number;
  notes: string;
  pestName: string;
  pestSeverity: string;
  diseaseName: string;
  diseaseSeverity: string;
  recommendation: string;
  evidenceUrl: string;

  constructor() {
    super(0);
    this.fieldVisitId = 0;
    this.notes = '';
    this.pestName = '';
    this.pestSeverity = '';
    this.diseaseName = '';
    this.diseaseSeverity = '';
    this.recommendation = '';
    this.evidenceUrl = '';
  }
}
