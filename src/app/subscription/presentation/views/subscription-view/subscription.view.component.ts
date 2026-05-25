import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from '../../../domain/model/subscription.entity';
import { SubscriptionStore } from '../../../application/subscription.store';
import { SubscriptionCardComponent } from '../subscription-card/subscription-card.component';
import { SubscriptionActionsComponent } from '../subscription-actions/subscription-actions.component';

@Component({
  selector: 'app-subscription-view',
  standalone: true,
  imports: [CommonModule, SubscriptionCardComponent, SubscriptionActionsComponent],
  templateUrl: './subscription-view.component.html',
  styleUrls: ['./subscription-view.component.css']
})
export class SubscriptionViewComponent implements OnInit {
  subscriptions: Subscription[] = [];
  selectedSubscriptionId: number = 0;
  isLoading: boolean = false;

  constructor(private store: SubscriptionStore) {}

  ngOnInit(): void {
    this.store.getSubscriptions();
    this.subscriptions = this.store.subscriptions;
    this.isLoading = this.store.isLoading;
  }

  onPurchaseSubscription(): void {
    this.store.purchaseSubscription(
      (this.subscriptions.find(s => s.getId() === this.selectedSubscriptionId) as any)?.plan,
      (this.subscriptions.find(s => s.getId() === this.selectedSubscriptionId) as any)?.userId
    );
  }

  onRenewSubscription(id: number): void {
    this.store.renewSubscription(id);
  }

  onCancelSubscription(id: number): void {
    this.store.cancelSubscription(id);
  }

  onSelectSubscription(id: number): void {
    this.selectedSubscriptionId = id;
    this.store.selectSubscription(id);
  }
}
