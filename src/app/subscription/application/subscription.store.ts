import { Injectable } from '@angular/core';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionApi } from '../infrastructure/subscription.api';
import { SubscriptionAssembler } from '../infrastructure/assemblers/subscription.assembler';
import { SubscriptionPlan } from '../domain/model/subscription-plan.enum';

@Injectable({ providedIn: 'root' })
export class SubscriptionStore {

  subscriptions: Subscription[] = [];
  selectedSubscriptionId: number = 0;
  isLoading: boolean = false;

  constructor(
    private api: SubscriptionApi,
    private assembler: SubscriptionAssembler
  ) {}

  getSubscriptions(): void {
    this.isLoading = true;
    this.api.getSubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching subscriptions', err);
        this.isLoading = false;
      }
    });
  }

  purchaseSubscription(plan: SubscriptionPlan, userId: number): void {
    this.isLoading = true;
    const subscription = this.subscriptions.find(s => s.getId() === this.selectedSubscriptionId);
    if (!subscription) return;

    const resource = this.assembler.toResourceFromEntity(subscription);
    this.api.purchaseSubscription(resource).subscribe({
      next: (newSubscription) => {
        this.subscriptions.push(newSubscription);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error purchasing subscription', err);
        this.isLoading = false;
      }
    });
  }

  renewSubscription(subscriptionId: number): void {
    this.isLoading = true;
    this.api.renewSubscription(subscriptionId).subscribe({
      next: (updated) => {
        const index = this.subscriptions.findIndex(s => s.getId() === subscriptionId);
        if (index !== -1) this.subscriptions[index] = updated;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error renewing subscription', err);
        this.isLoading = false;
      }
    });
  }

  cancelSubscription(subscriptionId: number): void {
    this.isLoading = true;
    this.api.cancelSubscription(subscriptionId).subscribe({
      next: (updated) => {
        const index = this.subscriptions.findIndex(s => s.getId() === subscriptionId);
        if (index !== -1) this.subscriptions[index] = updated;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cancelling subscription', err);
        this.isLoading = false;
      }
    });
  }

  selectSubscription(id: number): void {
    this.selectedSubscriptionId = id;
  }
}
