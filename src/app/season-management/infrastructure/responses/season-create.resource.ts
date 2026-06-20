/**
 * Matches the real backend's POST /api/v1/seasons body exactly:
 * { fieldId, cropName, startAt } — no cropId, no status, no endedAt.
 * The backend defaults status to PLANTING and assigns crop later via /crop.
 */
export class SeasonCreateResource {
  fieldId: number;
  cropName: string;
  startAt: string;

  constructor(fieldId: number, cropName: string, startAt: string) {
    this.fieldId = fieldId;
    this.cropName = cropName;
    this.startAt = startAt;
  }
}
