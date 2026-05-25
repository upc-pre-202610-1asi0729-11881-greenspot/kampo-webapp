// Importa el Value Object que representa el identificador único del gasto.
// Se usa para encapsular y validar la identidad de la entidad Expense.
import { ExpenseId } from '../value-object/expense-id.vo';

// Importa el Value Object Money.
// Representa el monto monetario del gasto y permite manejar dinero de forma consistente.
import { Money } from '../value-object/money.vo';

// Importa el enum que define las categorías válidas de gastos dentro del sistema.
import { ExpenseCategory } from '../enums/expense-category.enum';

// Entidad del dominio que representa un gasto registrado en el sistema.
// Contiene información financiera y de clasificación asociada a un egreso.
export class Expense {
  // Constructor de la entidad Expense.
  // Inicializa todos los atributos necesarios para representar un gasto.
  constructor(
    // Identificador único del gasto.
    // Se define como readonly porque la identidad no debe modificarse.
    private readonly id: ExpenseId,

    // Descripción o detalle del gasto realizado.
    private readonly description: string,

    // Monto económico asociado al gasto.
    // Puede modificarse mediante el método updateAmount().
    private amount: Money,

    // Categoría del gasto (transporte, insumos, mantenimiento, etc.).
    private readonly category: ExpenseCategory,

    // Fecha en la que se registró o realizó el gasto.
    private readonly date: Date,
  ) {}

  // Retorna el identificador único del gasto.
  getId(): ExpenseId {
    return this.id;
  }

  // Retorna la descripción del gasto.
  getDescription(): string {
    return this.description;
  }

  // Retorna el monto actual del gasto.
  getAmount(): Money {
    return this.amount;
  }

  // Retorna la categoría asociada al gasto.
  getCategory(): ExpenseCategory {
    return this.category;
  }

  // Retorna la fecha del gasto.
  getDate(): Date {
    return this.date;
  }

  // Actualiza el monto del gasto.
  // Se utiliza cuando es necesario corregir o modificar el valor registrado.
  updateAmount(newAmount: Money): void {
    this.amount = newAmount;
  }
}
