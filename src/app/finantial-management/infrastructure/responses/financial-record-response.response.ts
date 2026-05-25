// Importa las estructuras relacionadas a gastos.
//
// - ExpenseResponse:
//   Representa la información recibida desde el backend.
//
// - ExpenseResource:
//   Representa la información enviada hacia el backend.
import { ExpenseResource, ExpenseResponse } from './expense-response.response';

// Importa estructuras relacionadas a ingresos.
//
// - IncomeResponse:
//   DTO recibido desde la API.
//
// - IncomeResource:
//   DTO enviado hacia la API.
import { IncomeResource, IncomeResponse } from './income-response.response';

// Importa estructuras relacionadas a ventas.
//
// - SaleResponse:
//   Información recibida desde el backend.
//
// - SaleResource:
//   Información enviada al backend.
import { SaleResource, SaleResponse } from './sale-response.response';

// Interface que representa la respuesta HTTP
// de un registro financiero proveniente del backend.
//
// Se utiliza principalmente para:
// - consumo de APIs,
// - deserialización,
// - transformación hacia aggregates del dominio.
export interface FinancialRecordResponse {
  // Identificador único del registro financiero.
  id: number;

  // Identificador del fundo asociado.
  fundoId: number;

  // Identificador de la campaña o temporada agrícola.
  seasonId: number;

  // Lista de gastos asociados al registro financiero.
  expenses: ExpenseResponse[];

  // Lista de ingresos asociados al registro financiero.
  incomes: IncomeResponse[];

  // Lista de ventas asociadas al registro financiero.
  sales: SaleResponse[];
}

// Interface que representa el recurso enviado
// desde el frontend hacia el backend.
//
// Se utiliza para:
// - creación,
// - actualización,
// - persistencia de registros financieros.
export interface FinancialRecordResource {
  // Identificador del fundo asociado.
  fundoId: number;

  // Identificador de la campaña agrícola.
  seasonId: number;

  // Lista serializable de gastos.
  expenses: ExpenseResource[];

  // Lista serializable de ingresos.
  incomes: IncomeResource[];

  // Lista serializable de ventas.
  sales: SaleResource[];
}
