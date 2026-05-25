import { Supplier } from '../../domain/model/entities/supplier.entity';
import { SupplierResource, SupplierResponse } from '../responses/supplier-response.response';

export class SupplierAssembler {
  toEntityFromResponse(response: SupplierResponse): Supplier {
    return new Supplier(response.id, response.name, response.contact, response.email);
  }

  toResourceFromEntity(entity: Supplier): SupplierResource {
    return {
      name: entity.getName(),
      contact: entity.getContact(),
      email: entity.getEmail(),
    };
  }
}
