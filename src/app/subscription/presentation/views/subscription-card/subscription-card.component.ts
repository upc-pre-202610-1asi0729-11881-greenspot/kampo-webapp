import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from '../../../domain/model/subscription.entity';

@Component({
  selector: 'app-subscription-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './subscription-card.component.html',
  styleUrls: ['./subscription-card.component.css']
})
export class SubscriptionCardComponent {
  @Input() subscription!: Subscription;
  @Output() onSelect = new EventEmitter<number>();

  showStatus(): string {
    return this.subscription.getStatus();
  }
}
