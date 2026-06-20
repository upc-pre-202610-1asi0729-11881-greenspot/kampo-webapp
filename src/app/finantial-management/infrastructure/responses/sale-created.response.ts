/**
 * Matches what the real backend returns after POST /api/v1/sales.
 * Separate from SaleResponse (used by the mock-based FinancialRecord flow)
 * to avoid mixing two different backend contracts.
 */
export interface SaleCreatedResponse {
  id: number;
  cropName: string;
  quantity: number;
  pricePerUnit: number;
  currency: string;
  fundoId: number;
  date: string;
}
