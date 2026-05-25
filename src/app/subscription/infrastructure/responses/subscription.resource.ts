export class SubscriptionResource {
  name: string;
  description: string;
  price: number;
  userId: number;

  constructor(name: string, description: string, price: number, userId: number) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.userId = userId;
  }
}
