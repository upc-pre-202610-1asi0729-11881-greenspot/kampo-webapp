export class SubscriptionResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  startDate: Date;
  endDate: Date;
  status: string;
  userId: number;

  constructor(
    id: number,
    name: string,
    description: string,
    price: number,
    startDate: Date,
    endDate: Date,
    status: string,
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
}
