import { SaleResource, SaleResponse } from '../responses/sale-response.response';
import { Sale } from '../../domain/model/entities/sale.entity';
import { SaleId } from '../../domain/model/value-object/sale-id.vo';
import { Money } from '../../domain/model/value-object/money.vo';

export class SaleAssembler {
  toEntityFromResponse(response: SaleResponse): Sale {
    return new Sale(
      new SaleId(response.id),
      response.cropName,
      response.quantity,
      new Money(response.pricePerUnit, response.currency),
      new Date(response.date),
    );
  }

  toResourceFromEntity(entity: Sale): SaleResource {
    return {
      cropName: entity.getCropName(),
      quantity: entity.getQuantity(),
      pricePerUnit: entity.getPricePerUnit().getAmount(),
      currency: entity.getPricePerUnit().getCurrency(),
      date: entity.getDate().toISOString(),
    };
  }
}
