/**
 * Matches the real backend's Sale creation resource —
 * POST /api/v1/sales. Independent from the FinancialRecord aggregate
 * mock that the rest of the financial module still uses.
 */
export class SaleCreateRequest {
  cropName: string;
  quantity: number;
  pricePerUnit: number;
  currency: string;
  fundoId: number;
  date: string;

  constructor(
    cropName: string,
    quantity: number,
    pricePerUnit: number,
    currency: string,
    fundoId: number,
    date: string,
  ) {
    this.cropName = cropName;
    this.quantity = quantity;
    this.pricePerUnit = pricePerUnit;
    this.currency = currency;
    this.fundoId = fundoId;
    this.date = date;
  }
}
