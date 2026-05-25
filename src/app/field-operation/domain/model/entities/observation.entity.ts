import { BaseEntity } from '../../../../shared/infrastructure/base-entity';
import { Severity } from '../enums/severity.enum';

export class Observation extends BaseEntity {
  private fieldVisitId: number;
  private notes: string;
  private pestName: string;
  private pestSeverity: Severity;
  private diseaseName: string;
  private diseaseSeverity: Severity;
  private recommendation: string;
  private evidenceUrl: string;

  constructor(
    id: number,
    fieldVisitId: number,
    notes: string,
    pestName: string,
    pestSeverity: Severity,
    diseaseName: string,
    diseaseSeverity: Severity,
    recommendation: string,
    evidenceUrl: string
  ) {
    super(id);
    this.fieldVisitId = fieldVisitId;
    this.notes = notes;
    this.pestName = pestName;
    this.pestSeverity = pestSeverity;
    this.diseaseName = diseaseName;
    this.diseaseSeverity = diseaseSeverity;
    this.recommendation = recommendation;
    this.evidenceUrl = evidenceUrl;
  }

  getFieldVisitId(): number { return this.fieldVisitId; }
  getNotes(): string { return this.notes; }
  getPestName(): string { return this.pestName; }
  getPestSeverity(): Severity { return this.pestSeverity; }
  getDiseaseName(): string { return this.diseaseName; }
  getDiseaseSeverity(): Severity { return this.diseaseSeverity; }
  getRecommendation(): string { return this.recommendation; }
  getEvidenceUrl(): string { return this.evidenceUrl; }

  uploadEvidence(url: string): void { this.evidenceUrl = url; }
  implementRecommendation(recommendation: string): void { this.recommendation = recommendation; }
}
