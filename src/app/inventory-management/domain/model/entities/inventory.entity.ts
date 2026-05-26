// Importa el enum que define los posibles estados del inventario.
// Permite clasificar automáticamente el nivel de stock disponible.
import { InventoryStatus } from '../enums/inventory-status.enum';

// Entidad del dominio que representa un insumo o producto almacenado.
// Modela información relacionada al control de stock dentro del sistema.
export class Inventory {
  // Constructor de la entidad Inventory.
  // Inicializa todos los atributos necesarios del inventario.
  constructor(
    // Identificador único del inventario.
    private readonly id: number,
    // Nombre del insumo o producto.
    private readonly name: string,
    // Cantidad disponible en stock.
    private quantity: number,
    // Unidad de medida del inventario.
    // Ejemplos: kg, litros, cajas, unidades.
    private readonly unit: string,
    // Cantidad mínima permitida antes de considerar bajo stock.
    private readonly minStock: number,
    // Estado actual del inventario.
    // Puede ser AVAILABLE, LOW_STOCK u OUT_OF_STOCK.
    private status: InventoryStatus,
  ) {}
  // Retorna el identificador del inventario.
  getId(): number {
    return this.id;
  }
  // Retorna el nombre del inventario.
  getName(): string {
    return this.name;
  }
  // Retorna la cantidad disponible.
  getQuantity(): number {
    return this.quantity;
  }
  // Retorna la unidad de medida.
  getUnit(): string {
    return this.unit;
  }
  // Retorna el stock mínimo configurado.
  getMinStock(): number {
    return this.minStock;
  }
  // Retorna el estado actual del inventario.
  getStatus(): InventoryStatus {
    return this.status;
  }
  // Actualiza la cantidad disponible del inventario.
  // Además recalcula automáticamente el estado del stock.
  setQuantity(quantity: number): void {
    // Actualiza la cantidad almacenada.
    this.quantity = quantity;
    // Recalcula el estado del inventario según las reglas del negocio.
    this.status = Inventory.resolveStatus(quantity, this.minStock);
  }

  // Método estático que determina el estado del inventario
  // en función de la cantidad disponible y el stock mínimo.
  static resolveStatus(quantity: number, minStock: number): InventoryStatus {
    // Si no hay stock disponible.
    if (quantity <= 0) {
      return InventoryStatus.OUT_OF_STOCK;
    }

    // Si la cantidad está por debajo o igual al mínimo permitido.
    if (quantity <= minStock) {
      return InventoryStatus.LOW_STOCK;
    }

    // Si el stock es suficiente.
    return InventoryStatus.AVAILABLE;
  }
}
