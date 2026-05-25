export interface IncomeResponse {
  id: number;
  description: string;
  amount: number;
  currency: string;
  date: string;
}

export interface IncomeResource {
  description: string;
  amount: number;
  currency: string;
  date: string;
}
