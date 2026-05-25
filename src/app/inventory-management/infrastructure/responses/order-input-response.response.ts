export interface OrderInputResponse {
  id: number;
  inventoryId: number;
  supplierId: number;
  quantity: number;
  status: string;
}

export interface OrderInputResource {
  inventoryId: number;
  supplierId: number;
  quantity: number;
}
