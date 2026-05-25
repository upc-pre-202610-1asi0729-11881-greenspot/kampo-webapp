import { Injectable } from '@angular/core';
import { Subscription } from '../../domain/model/subscription.entity';
import { SubscriptionResponse } from '../responses/subscription.response';
import { SubscriptionResource } from '../responses/subscription.resource';
import { SubscriptionStatus } from '../../domain/model/subscription-status.enum';

@Injectable({ providedIn: 'root' })
export class SubscriptionAssembler {

  toEntityFromResponse(response: SubscriptionResponse): Subscription {
    return new Subscription(
      response.id,
      response.name,
      response.description,
      response.price,
      new Date(response.startDate),
      new Date(response.endDate),
      response.status as SubscriptionStatus,
      response.userId
    );
  }

  toResourceFromEntity(entity: Subscription): SubscriptionResource {
    return new SubscriptionResource(
      entity.getName(),
      entity.getDescription(),
      entity.getPrice(),
      entity.getUserId()
    );
  }
}
