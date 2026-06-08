// Importa la entidad Sale, que representa una venta registrada.
import { Sale } from '../entities/sale.entity';

// Importa la entidad Expense, que representa un gasto financiero.
import { Expense } from '../entities/expense.entity';

// Importa la entidad Income, que representa un ingreso económico.
import { Income } from '../entities/income.entity';

// Importa el Value Object que representa el identificador único del registro financiero.
import { FinancialRecordId } from '../value-object/financial-record-id.vo';

// Importa el identificador del fundo asociado al registro financiero.
import { FundoId } from '../value-object/fundo-id.vo';

// Importa el identificador de la campaña o temporada agrícola.
import { SeasonId } from '../value-object/season-id.vo';

// Importa el Value Object Money para manejar montos monetarios.
import { Money } from '../value-object/money.vo';

// Importa el enum que define las categorías válidas de gastos.
import { ExpenseCategory } from '../enums/expense-category.enum';

// Importa identificadores específicos para cada entidad financiera.
import { ExpenseId } from '../value-object/expense-id.vo';
import { IncomeId } from '../value-object/income-id.vo';
import { SaleId } from '../value-object/sale-id.vo';

// Importa el Value Object que representa el resultado de rentabilidad.
import { Profitability } from '../value-object/profitability.vo';

// Aggregate Root del dominio financiero.
// Centraliza la gestión de ingresos, gastos y ventas asociados
// a un fundo y una temporada agrícola específica.
export class FinancialRecord {
  // Colección de gastos registrados.
  private expenses: Expense[] = [];

  // Colección de ingresos registrados.
  private readonly incomes: Income[] = [];

  // Colección de ventas registradas.
  private readonly sales: Sale[] = [];

  // Constructor del aggregate FinancialRecord.
  // Inicializa las relaciones financieras del fundo y temporada.
  constructor(
    // Identificador único del registro financiero.
    private readonly id: FinancialRecordId,

    // Identificador del fundo asociado.
    private readonly fundoId: FundoId,

    // Identificador de la campaña agrícola.
    private readonly seasonId: SeasonId,

    // Lista inicial de gastos.
    expenses: Expense[] = [],

    // Lista inicial de ingresos.
    incomes: Income[] = [],

    // Lista inicial de ventas.
    sales: Sale[] = [],
  ) {
    // Agrega los elementos iniciales a las colecciones internas.
    this.expenses = [...expenses];
    this.incomes.push(...incomes);
    this.sales.push(...sales);
  }

  // Retorna el identificador del registro financiero.
  getId(): FinancialRecordId {
    return this.id;
  }

  // Retorna el identificador del fundo asociado.
  getFundoId(): FundoId {
    return this.fundoId;
  }

  // Retorna el identificador de la temporada agrícola.
  getSeasonId(): SeasonId {
    return this.seasonId;
  }

  // Registra un nuevo gasto dentro del aggregate.
  addExpense(
    description: string,
    amount: Money,
    category: ExpenseCategory,
    date: Date,
    id: string = Math.random().toString(36).substr(2, 9),
  ): void {
    this.expenses.push(new Expense(new ExpenseId(id as any), description, amount, category, date));
  }

  // Registra un nuevo ingreso económico.
  addIncome(
    // Descripción del ingreso.
    description: string,

    // Monto recibido.
    amount: Money,

    // Fecha del ingreso.
    date: Date,

    // Identificador único del ingreso.
    id: IncomeId = new IncomeId(FinancialRecord.nextNumericId()),
  ): void {
    // Agrega una nueva entidad Income.
    this.incomes.push(new Income(id, description, amount, date));
  }

  // Registra una nueva venta agrícola.
  addSale(
    // Nombre del cultivo vendido.
    cropName: string,

    // Cantidad vendida.
    quantity: number,

    // Precio unitario del producto.
    pricePerUnit: Money,

    // Fecha de la venta.
    date: Date,

    // Identificador único de la venta.
    id: SaleId = new SaleId(FinancialRecord.nextNumericId()),
  ): void {
    // Agrega una nueva entidad Sale.
    this.sales.push(new Sale(id, cropName, quantity, pricePerUnit, date));
  }

  // Calcula la rentabilidad financiera total del registro.
  // Evalúa ingresos, ventas, gastos y utilidad neta.
  calculateProfitability(): Profitability {
    // Determina la moneda utilizada en el registro financiero.
    const currency = this.resolveCurrency();

    // Representa un monto cero inicial.
    const zero = new Money(0, currency);

    // Calcula el total de gastos acumulados.
    const totalExpenses = this.expenses.reduce((acc, e) => acc.add(e.getAmount()), zero);

    // Calcula el total de ingresos acumulados.
    const totalIncome = this.incomes.reduce((acc, i) => acc.add(i.getAmount()), zero);

    // Calcula el total generado por ventas.
    const totalSales = this.sales.reduce((acc, s) => acc.add(s.getTotalAmount()), zero);

    // Calcula el ingreso total (ingresos + ventas).
    const revenue = totalIncome.add(totalSales);

    // Calcula la utilidad neta.
    const netProfit = revenue.subtract(totalExpenses);

    // Calcula el margen de rentabilidad porcentual.
    const margin =
      revenue.getAmount() === 0 ? 0 : (netProfit.getAmount() / revenue.getAmount()) * 100;

    // Retorna el resultado encapsulado en un Value Object Profitability.
    return new Profitability(totalIncome, totalExpenses, totalSales, netProfit, margin);
  }

  // Retorna una copia de la lista de gastos.
  getExpenses(): Expense[] {
    return [...this.expenses];
  }

  // Retorna una copia de la lista de ingresos.
  getIncomes(): Income[] {
    return [...this.incomes];
  }

  // Retorna una copia de la lista de ventas.
  getSales(): Sale[] {
    return [...this.sales];
  }

  private resolveCurrency(): string {
    const currencies = [
      ...this.expenses.map((e) => e.getAmount().getCurrency()),
      ...this.incomes.map((i) => i.getAmount().getCurrency()),
      ...this.sales.map((s) => s.getPricePerUnit().getCurrency()),
    ];
    const uniqueCurrencies = Array.from(new Set(currencies.filter((c) => !!c)));
    if (uniqueCurrencies.length > 1) {
      throw new Error(`Conflicto de monedas detectado: ${uniqueCurrencies.join(', ')}.
      Todos los registros deben usar la misma moneda.`);
    }

    return uniqueCurrencies[0] ?? 'PEN';
  }

  // Genera identificadores numéricos únicos de forma simple.
  // Combina un número aleatorio con el timestamp actual.
  private static nextNumericId(): number {
    return Math.floor(Math.random() * 1_000_000_000) + Date.now();
  }

  removeExpense(expenseId: string): void {
    this.expenses = this.expenses.filter((expense) => {
      const idVO = expense.getId();
      if (!idVO) return true;
      const idAsString = String(idVO.getValue());
      return idAsString !== expenseId;
    });
  }

  removeIncome(incomeId: string): void {
    const idx = this.incomes.findIndex((i) => String(i.getId().getValue()) === incomeId);
    if (idx !== -1) this.incomes.splice(idx, 1);
  }
}
