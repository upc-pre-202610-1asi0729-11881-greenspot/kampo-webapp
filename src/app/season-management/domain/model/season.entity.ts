import { BaseEntity } from '../../../shared/infrastructure/base-entity';
import { SeasonStatus } from './season-status.enum';

export class Season extends BaseEntity {
  private fieldId: number;
  private cropId: number;
  private cropName: string;
  private status: SeasonStatus;
  private startedAt: Date;
  private endedAt: Date | null;

  constructor(
    id: number,
    fieldId: number,
    cropId: number,
    cropName: string,
    status: SeasonStatus,
    startedAt: Date,
    endedAt: Date | null = null,
  ) {
    super(id);
    this.fieldId = fieldId;
    this.cropId = cropId;
    this.cropName = cropName;
    this.status = status;
    this.startedAt = startedAt;
    this.endedAt = endedAt;
  }

  getFieldId(): number {
    return this.fieldId;
  }

  getCropId(): number {
    return this.cropId;
  }

  getCropName(): string {
    return this.cropName;
  }

  getStatus(): SeasonStatus {
    return this.status;
  }

  getStartedAt(): Date {
    return this.startedAt;
  }

  getEndedAt(): Date | null {
    return this.endedAt;
  }

  assignCrop(cropId: number, cropName: string): void {
    this.cropId = cropId;
    this.cropName = cropName;
  }

  updateStatus(status: SeasonStatus): void {
    this.status = status;
  }

  end(): void {
    this.status = SeasonStatus.ENDED;
    this.endedAt = new Date();
  }

  isActive(): boolean {
    return this.status !== SeasonStatus.ENDED;
  }
}
