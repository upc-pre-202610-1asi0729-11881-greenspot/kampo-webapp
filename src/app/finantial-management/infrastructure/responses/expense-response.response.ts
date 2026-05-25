export interface ExpenseResponse {
  id: number;
  description: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
}

export interface ExpenseResource {
  description: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
}
