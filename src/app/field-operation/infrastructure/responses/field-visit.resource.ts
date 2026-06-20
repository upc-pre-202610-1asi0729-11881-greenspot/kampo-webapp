export class FieldVisitResource {
  fieldId: number;
  purpose: string;
  technician: string;
  scheduledAt: string;
  status: string;

  constructor(fieldId: number, purpose: string, technician: string, scheduledAt: string) {
    this.fieldId = fieldId;
    this.purpose = purpose;
    this.technician = technician;
    this.scheduledAt = scheduledAt;
    this.status = 'SCHEDULED';
  }
}
