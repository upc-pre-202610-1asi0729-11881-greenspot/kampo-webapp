import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-subscription-actions',
  templateUrl: './subscription-actions.component.html',
  styleUrls: ['./subscription-actions.component.css']
})
export class SubscriptionActionsComponent {

  @Input() selectedSubscriptionId!: number;
  @Output() onPurchase = new EventEmitter<void>();
  @Output() onRenew = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
}
