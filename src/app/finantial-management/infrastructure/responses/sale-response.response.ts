export interface SaleResponse {
  id: number;
  cropName: string;
  quantity: number;
  pricePerUnit: number;
  currency: string;
  date: string;
}

export interface SaleResource {
  cropName: string;
  quantity: number;
  pricePerUnit: number;
  currency: string;
  date: string;
}
