import { SubscriptionStatus } from './subscription-status.enum';
import { SubscriptionPlan } from './subscription-plan.enum';

export class Subscription {
  private id: number;
  private name: string;
  private description: string;
  private price: number;
  private startDate: Date;
  private endDate: Date;
  private status: SubscriptionStatus;
  private userId: number;

  constructor(
    id: number,
    name: string,
    description: string,
    price: number,
    startDate: Date,
    endDate: Date,
    status: SubscriptionStatus,
    userId: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.userId = userId;
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): number {
    return this.price;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getStatus(): SubscriptionStatus {
    return this.status;
  }

  getUserId(): number {
    return this.userId;
  }
}
