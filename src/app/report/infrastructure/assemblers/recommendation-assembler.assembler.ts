import { Injectable } from '@angular/core';
import {
  RecommendationResource,
  RecommendationResponse,
} from '../responses/recommendation-response.response';
import { Recommendation } from '../../domain/model/entities/recommendation.entity';
import { PriorityLevel } from '../../domain/model/enums/priority-level.enum';
import { RecommendationStatus } from '../../domain/model/enums/recommendation-status.enum';

@Injectable({providedIn:'root'})
export class RecommendationAssembler {
  toEntityFromResponse(response: RecommendationResponse):Recommendation{
    return new Recommendation(
      response.id,
      response.priority as PriorityLevel,
      response.status as RecommendationStatus,
      new Date(response.createdAt),
      response.implementedAt ? new Date(response.implementedAt):null,
      response.reportsId
    );
  }
  toResourceFromEntity(entity:Recommendation):RecommendationResource{
    const resource = new RecommendationResource();
    resource.reportsId = entity.getReportsId();
    resource.priority= entity.getPriority();
    return resource;
  }
}
