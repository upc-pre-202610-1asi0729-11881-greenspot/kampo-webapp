// Interface que representa la estructura de datos
// recibida desde el backend relacionada a un inventario.
//
// Se utiliza principalmente para:
// - respuestas HTTP,
// - consumo de APIs,
// - transformación hacia entidades del dominio.
export interface InventoryResponse {
  // Identificador único del inventario.
  id: number;

  // Nombre del producto o insumo almacenado.
  name: string;

  // Cantidad disponible en stock.
  quantity: number;

  // Unidad de medida del inventario.
  // Ejemplos: kg, litros, unidades.
  unit: string;

  // Stock mínimo permitido antes de considerarse bajo stock.
  minStock: number;

  // Estado actual del inventario recibido como texto.
  // Ejemplos:
  // - AVAILABLE
  // - LOW_STOCK
  // - OUT_OF_STOCK
  status: string;
}

// Interface que representa los datos enviados
// desde el frontend hacia el backend.
//
// Se utiliza para:
// - creación,
// - actualización,
// - registro de inventarios.
export interface InventoryResource {
  // Nombre del producto o insumo.
  name: string;

  // Cantidad disponible.
  quantity: number;

  // Unidad de medida.
  unit: string;

  // Stock mínimo configurado.
  minStock: number;
}
