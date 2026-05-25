import { Money } from '../value-object/money.vo';
import { IncomeId } from '../value-object/income-id.vo';

export class Income {
  constructor(
    private readonly id: IncomeId,
    private readonly description: string,
    private amount: Money,
    private readonly date: Date,
  ) {}

  getId(): IncomeId {
    return this.id;
  }

  getDescription(): string {
    return this.description;
  }

  getAmount(): Money {
    return this.amount;
  }

  getDate(): Date {
    return this.date;
  }

  updateAmount(newAmount: Money): void {
    this.amount = newAmount;
  }
}
