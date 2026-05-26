// Importa la entidad Inventory del dominio.
// Representa un insumo o producto almacenado en el sistema.
import { Inventory } from '../../domain/model/entities/inventory.entity';

// Importa el enum de estados posibles del inventario.
import { InventoryStatus } from '../../domain/model/enums/inventory-status.enum';

// Importa los modelos utilizados para transferencia de datos.
// - InventoryResponse: datos recibidos desde el backend.
// - InventoryResource: datos enviados hacia el backend.
import { InventoryResource, InventoryResponse } from '../responses/inventory-response.response';
// Assembler encargado de transformar objetos entre:
// - infraestructura,
// - respuestas HTTP,
// - y entidades del dominio.
//
// Ayuda a desacoplar el dominio de la estructura externa de datos.
export class InventoryAssembler {
  // Convierte una respuesta HTTP del backend
  // en una entidad Inventory del dominio.
  toEntityFromResponse(response: InventoryResponse): Inventory {
    // Determina el estado correcto del inventario.
    // Usa el estado recibido o lo recalcula automáticamente.
    const status = InventoryAssembler.parseStatus(
      response.status,
      response.quantity,
      response.minStock,
    );

    // Retorna una nueva entidad Inventory.
    return new Inventory(
      // Identificador del inventario.
      response.id,

      // Nombre del producto o insumo.
      response.name,

      // Cantidad disponible.
      response.quantity,

      // Unidad de medida.
      response.unit,

      // Stock mínimo permitido.
      // Si no existe, usa 0 por defecto.
      response.minStock ?? 0,

      // Estado calculado del inventario.
      status,
    );
  }

  // Convierte una entidad del dominio
  // en un recurso serializable para enviar al backend.
  toResourceFromEntity(entity: Inventory): InventoryResource {
    return {
      // Nombre del inventario.
      name: entity.getName(),

      // Cantidad disponible.
      quantity: entity.getQuantity(),

      // Unidad de medida.
      unit: entity.getUnit(),

      // Stock mínimo configurado.
      minStock: entity.getMinStock(),
    };
  }

  // Método auxiliar estático que interpreta el estado recibido.
  //
  // Si el backend envía un estado válido:
  // - lo convierte al enum InventoryStatus.
  //
  // Si el estado no es válido:
  // - recalcula automáticamente el estado según reglas del dominio.
  private static parseStatus(raw: string, quantity: number, minStock: number): InventoryStatus {
    // Convierte el texto recibido a mayúsculas
    // para compararlo con el enum.
    const upper = raw?.toUpperCase() as keyof typeof InventoryStatus;

    // Verifica si el estado existe dentro del enum.
    if (upper && upper in InventoryStatus) {
      // Retorna el valor correspondiente del enum.
      return InventoryStatus[upper];
    }

    // Si el estado no es válido,
    // lo calcula usando reglas del dominio.
    return Inventory.resolveStatus(quantity, minStock);
  }
}
