// Importa herramientas reactivas de Angular.
// - signal: manejo reactivo de estado.
// - computed: valores derivados.
// - inject: inyección de dependencias.
// - Injectable: permite registrar la clase como servicio.
import { computed, inject, Injectable, signal } from '@angular/core';

// Importa el contrato del repositorio del dominio.
// Define las operaciones disponibles para acceder a registros financieros.
import { FinancialRecordRepository } from '../domain/model/repository/financial-record.repository';

// Token de inyección utilizado para resolver la implementación concreta del repositorio.
import { FINANCIAL_RECORD_REPOSITORY } from '../domain/model/repository/financial-record-repository.token';

// Importa el Aggregate Root del dominio financiero.
import { FinancialRecord } from '../domain/model/aggregates/financial-record.aggregate';

// Importa el Value Object que representa la rentabilidad calculada.
import { Profitability } from '../domain/model/value-object/profitability.vo';

// Importa identificadores de fundo y campaña agrícola.
import { FundoId } from '../domain/model/value-object/fundo-id.vo';
import { SeasonId } from '../domain/model/value-object/season-id.vo';

// Operador RxJS utilizado para ejecutar lógica al finalizar un Observable.
import { finalize } from 'rxjs';

// Importa el Value Object Money para manejar montos monetarios.
import { Money } from '../domain/model/value-object/money.vo';

// Importa el enum de categorías de gastos.
import { ExpenseCategory } from '../domain/model/enums/expense-category.enum';

// Define el Store global de gestión financiera.
// Centraliza el estado reactivo del módulo financiero dentro del frontend.
@Injectable({ providedIn: 'root' })
export class FinancialStore {
  // Inyección del repositorio financiero.
  // Se utiliza para obtener datos desde infraestructura/API.
  private readonly repository = inject<FinancialRecordRepository>(FINANCIAL_RECORD_REPOSITORY);

  // Signal reactivo que almacena el registro financiero actual.
  readonly record = signal<FinancialRecord | null>(null);

  // Signal reactivo que almacena la rentabilidad calculada.
  readonly profitability = signal<Profitability | null>(null);

  // Signal utilizado para controlar estados de carga en la interfaz.
  readonly isLoading = signal(false);

  // Fundo actualmente seleccionado por el usuario.
  readonly selectedFundoId = signal<FundoId | null>(null);

  // Campaña agrícola actualmente seleccionada.
  readonly selectedSeasonId = signal<SeasonId | null>(null);

  // Valor computado que indica si existe un registro cargado.
  readonly hasRecord = computed(() => this.record() !== null);

  // Carga un registro financiero según fundo y temporada.
  // Obtiene información desde el repositorio y actualiza el estado reactivo.
  loadRecord(fundoId: FundoId, seasonId: SeasonId): void {
    // Activa el indicador de carga.
    this.isLoading.set(true);

    // Guarda los filtros seleccionados.
    this.selectedFundoId.set(fundoId);
    this.selectedSeasonId.set(seasonId);

    // Solicita el registro financiero al repositorio.
    this.repository
      .findByFundoAndSeason(fundoId, seasonId)

      // Finaliza el loading al terminar la operación.
      .pipe(finalize(() => this.isLoading.set(false)))

      // Se suscribe al Observable recibido.
      .subscribe({
        // Caso exitoso.
        next: (loaded) => {
          // Guarda el registro obtenido.
          this.record.set(loaded);

          // Recalcula la rentabilidad automáticamente.
          this.computeProfitability();
        },

        // Caso de error.
        error: () => {
          // Limpia el estado.
          this.record.set(null);
          this.profitability.set(null);
        },
      });
  }

  // Agrega un nuevo gasto al registro financiero actual.
  addExpense(description: string, amount: Money, category: ExpenseCategory, date: Date): void {
    const current = this.record();
    if (!current) return;

    const next = FinancialStore.cloneRecord(current);
    next.addExpense(description, amount, category, date);

    // Activamos la carga y ejecutamos la persistencia en el backend
    this.isLoading.set(true);

    this.repository.save(next)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (savedRecord) => {
          // Si el backend responde OK, actualizamos la vista
          this.record.set(savedRecord);
          this.computeProfitability();
        },
        error: (err) => console.error('Error al guardar el gasto:', err)
      });
  }

  // Agrega un nuevo ingreso financiero.
  addIncome(description: string, amount: Money, date: Date): void {
    const current = this.record();
    if (!current) return;

    const next = FinancialStore.cloneRecord(current);
    next.addIncome(description, amount, date);

    this.isLoading.set(true);
    this.repository.save(next)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (savedRecord) => {
          this.record.set(savedRecord);
          this.computeProfitability();
        },
        error: (err) => console.error('Error al guardar ingreso:', err)
      });
  }

  // Registra una nueva venta agrícola.
  addSale(cropName: string, quantity: number, pricePerUnit: Money, date: Date): void {
    const current = this.record();
    if (!current) return;

    const next = FinancialStore.cloneRecord(current);
    next.addSale(cropName, quantity, pricePerUnit, date);

    this.isLoading.set(true);
    this.repository.save(next)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (savedRecord) => {
          this.record.set(savedRecord);
          this.computeProfitability();
        },
        error: (err) => console.error('Error al guardar venta:', err)
      });
  }

  // Calcula la rentabilidad financiera del aggregate actual.
  computeProfitability(): void {
    const current = this.record();

    // Si no existe registro, limpia resultados.
    if (!current) {
      this.profitability.set(null);
      return;
    }

    // Calcula y almacena la rentabilidad.
    this.profitability.set(current.calculateProfitability());
  }

  // Actualiza el fundo seleccionado.
  selectFundo(fundoId: FundoId): void {
    this.selectedFundoId.set(fundoId);
  }

  // Actualiza la campaña agrícola seleccionada.
  selectSeason(seasonId: SeasonId): void {
    this.selectedSeasonId.set(seasonId);
  }

  // Método auxiliar estático para clonar aggregates.
  // Permite mantener un enfoque inmutable en el manejo del estado.
  private static cloneRecord(source: FinancialRecord): FinancialRecord {
    return new FinancialRecord(
      // Copia identificadores principales.
      source.getId(),
      source.getFundoId(),
      source.getSeasonId(),

      // Copia entidades internas del aggregate.
      source.getExpenses(),
      source.getIncomes(),
      source.getSales(),
    );
  }
  deleteExpense(expenseId: string): void {
    const current = this.record();
    if (!current) {
      return;
    }
    const next = FinancialStore.cloneRecord(current);
    next.removeExpense(expenseId);
    this.isLoading.set(true);

    this.repository.save(next).subscribe({
      next: (savedRecord) => {
        // Esto fuerza a Angular a detectar un cambio de referencia
        this.record.set(new FinancialRecord(
          savedRecord.getId(),
          savedRecord.getFundoId(),
          savedRecord.getSeasonId(),
          savedRecord.getExpenses(),
          savedRecord.getIncomes(),
          savedRecord.getSales()
        ));
        this.computeProfitability();
      }
    });
  }

  deleteIncome(incomeId: string): void {
    const current = this.record();
    if (!current) return;

    const next = FinancialStore.cloneRecord(current);
    next.removeIncome(incomeId);

    this.isLoading.set(true);
    this.repository.save(next)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (savedRecord) => {
          this.record.set(new FinancialRecord(
            savedRecord.getId(),
            savedRecord.getFundoId(),
            savedRecord.getSeasonId(),
            savedRecord.getExpenses(),
            savedRecord.getIncomes(),
            savedRecord.getSales()
          ));
          this.computeProfitability();
        },
        error: (err) => console.error('Error al eliminar ingreso:', err)
      });
  }
}
