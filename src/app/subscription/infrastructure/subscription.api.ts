import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionResponse } from './responses/subscription.response';
import { SubscriptionResource } from './responses/subscription.resource';
import { SubscriptionAssembler } from './assemblers/subscription.assembler';
import { SubscriptionPlan } from '../domain/model/subscription-plan.enum';

@Injectable({ providedIn: 'root' })
export class SubscriptionApi {

  private subscriptionsEndpoint = 'https://your-api-url.com/api/v1/subscriptions';

  constructor(
    private http: HttpClient,
    private assembler: SubscriptionAssembler
  ) {}

  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<SubscriptionResponse[]>(this.subscriptionsEndpoint).pipe(
      map(responses => responses.map(r => this.assembler.toEntityFromResponse(r)))
    );
  }

  purchaseSubscription(resource: SubscriptionResource): Observable<Subscription> {
    return this.http.post<SubscriptionResponse>(this.subscriptionsEndpoint, resource).pipe(
      map(response => this.assembler.toEntityFromResponse(response))
    );
  }

  renewSubscription(subscriptionId: number): Observable<Subscription> {
    return this.http.put<SubscriptionResponse>(
      `${this.subscriptionsEndpoint}/${subscriptionId}/renew`, {}
    ).pipe(
      map(response => this.assembler.toEntityFromResponse(response))
    );
  }

  cancelSubscription(subscriptionId: number): Observable<Subscription> {
    return this.http.put<SubscriptionResponse>(
      `${this.subscriptionsEndpoint}/${subscriptionId}/cancel`, {}
    ).pipe(
      map(response => this.assembler.toEntityFromResponse(response))
    );
  }
}
