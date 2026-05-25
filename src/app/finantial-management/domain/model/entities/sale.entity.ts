import { Money } from '../value-object/money.vo';
import { SaleId } from '../value-object/sale-id.vo';

export class Sale {
  constructor(
    private readonly id: SaleId,
    private readonly cropName: string,
    private readonly quantity: number,
    private readonly pricePerUnit: Money,
    private readonly date: Date,
  ) {}

  getId(): SaleId {
    return this.id;
  }

  getCropName(): string {
    return this.cropName;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getPricePerUnit(): Money {
    return this.pricePerUnit;
  }

  getTotalAmount(): Money {
    return this.pricePerUnit.multiply(this.quantity);
  }

  getDate(): Date {
    return this.date;
  }
}
