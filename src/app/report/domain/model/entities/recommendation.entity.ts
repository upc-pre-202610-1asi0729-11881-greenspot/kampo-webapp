import { PriorityLevel } from '../enums/priority-level.enum';
import { RecommendationStatus } from '../enums/recommendation-status.enum';

export class Recommendation {
  private id: number;
  private priority:PriorityLevel;
  private status:RecommendationStatus;
  private createdAt: Date;
  private implementedAt: Date|null;
  private reportsId: number;

  constructor(
    id:number,
    priority:PriorityLevel,
    status:RecommendationStatus,
    createdAt:Date,
    implementedAt:Date | null,
    reportsId:number,
  ) {
    this.id = id;
    this.priority = priority;
    this.status = status;
    this.createdAt = createdAt;
    this.implementedAt=implementedAt;
    this.reportsId = reportsId;
  }

  getId():number{
    return this.id;
  }
  getPriority():PriorityLevel{
    return this.priority;
  }
  getStatus():RecommendationStatus{
    return this.status;
  }
  getCreatedAt():Date{
    return this.createdAt;
  }
  getImplementedAt():Date|null{
    return this.implementedAt;
  }
  getReportsId():number{
    return this.reportsId;
  }

}
