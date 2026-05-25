// Importa el Value Object que representa el identificador único de un fundo.
import { FundoId } from '../value-object/fundo-id.vo';

// Importa el Value Object que representa el identificador de una campaña agrícola.
import { SeasonId } from '../value-object/season-id.vo';

// Importa Observable de RxJS.
// Se utiliza para manejar operaciones asíncronas en Angular.
import { Observable } from 'rxjs';

// Importa el Aggregate Root del dominio financiero.
import { FinancialRecord } from '../aggregates/financial-record.aggregate';

// Define el contrato del repositorio financiero.
// Esta interfaz abstrae el acceso y persistencia de registros financieros.
export interface FinancialRecordRepository {
  // Busca un registro financiero específico según:
  // - fundo agrícola
  // - temporada agrícola
  //
  // Retorna un Observable que emite un FinancialRecord.
  findByFundoAndSeason(fundoId: FundoId, seasonId: SeasonId): Observable<FinancialRecord>;

  // Guarda o actualiza un registro financiero.
  //
  // Retorna el aggregate persistido dentro de un Observable.
  save(record: FinancialRecord): Observable<FinancialRecord>;

  // Obtiene todos los registros financieros asociados a un fundo.
  //
  // Retorna una colección de registros financieros.
  findAllByFundo(fundoId: FundoId): Observable<FinancialRecord[]>;
}
