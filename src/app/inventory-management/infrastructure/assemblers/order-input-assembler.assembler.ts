import { OrderInput } from '../../domain/model/entities/order-input.entity';
import { OrderStatus } from '../../domain/model/enums/order-status.enum';
import { OrderInputResource, OrderInputResponse } from '../responses/order-input-response.response';

export class OrderInputAssembler {
  toEntityFromResponse(response: OrderInputResponse): OrderInput {
    return new OrderInput(
      response.id,
      response.inventoryId,
      response.supplierId,
      response.quantity,
      OrderInputAssembler.parseStatus(response.status),
    );
  }

  toResourceFromEntity(entity: OrderInput): OrderInputResource {
    return {
      inventoryId: entity.getInventoryId(),
      supplierId: entity.getSupplierId(),
      quantity: entity.getQuantity(),
    };
  }

  private static parseStatus(raw: string): OrderStatus {
    const upper = raw?.toUpperCase() as keyof typeof OrderStatus;
    if (upper && upper in OrderStatus) {
      return OrderStatus[upper];
    }
    return OrderStatus.PENDING;
  }
}
