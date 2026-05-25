import { Money } from './money.vo';

export class Profitability {
  constructor(
    private readonly totalIncome: Money,
    private readonly totalExpenses: Money,
    private readonly totalSales: Money,
    private readonly netProfit: Money,
    private readonly margin: number,
  ) {}

  getTotalIncome(): Money {
    return this.totalIncome;
  }

  getTotalExpenses(): Money {
    return this.totalExpenses;
  }

  getTotalSales(): Money {
    return this.totalSales;
  }

  getNetProfit(): Money {
    return this.netProfit;
  }

  getMargin(): number {
    return this.margin;
  }

  isProfit(): boolean {
    return this.netProfit.getAmount() > 0;
  }
}
