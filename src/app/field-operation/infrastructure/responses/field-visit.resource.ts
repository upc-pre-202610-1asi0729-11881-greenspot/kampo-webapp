export class FieldVisitResource {
  fieldId: number;
  scheduledAt: string;

  constructor(fieldId: number, scheduledAt: string) {
    this.fieldId = fieldId;
    this.scheduledAt = scheduledAt;
  }
}
