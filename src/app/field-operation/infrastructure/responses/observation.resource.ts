export class ObservationResource {
  fieldVisitId: number;
  notes: string;
  pestName: string;
  pestSeverity: string;
  diseaseName: string;
  diseaseSeverity: string;
  recommendation: string;

  constructor(
    fieldVisitId: number,
    notes: string,
    pestName: string,
    pestSeverity: string,
    diseaseName: string,
    diseaseSeverity: string,
    recommendation: string
  ) {
    this.fieldVisitId = fieldVisitId;
    this.notes = notes;
    this.pestName = pestName;
    this.pestSeverity = pestSeverity;
    this.diseaseName = diseaseName;
    this.diseaseSeverity = diseaseSeverity;
    this.recommendation = recommendation;
  }
}
