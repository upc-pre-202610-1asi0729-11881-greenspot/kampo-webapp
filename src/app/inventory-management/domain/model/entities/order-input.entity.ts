import { OrderStatus } from '../enums/order-status.enum';

export class OrderInput {
  constructor(
    private readonly id: number,
    private readonly inventoryId: number,
    private readonly supplierId: number,
    private quantity: number,
    private status: OrderStatus,
  ) {}

  getId(): number {
    return this.id;
  }

  getInventoryId(): number {
    return this.inventoryId;
  }

  getSupplierId(): number {
    return this.supplierId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  setStatus(status: OrderStatus): void {
    this.status = status;
  }

  setQuantity(quantity: number): void {
    this.quantity = quantity;
  }
}
