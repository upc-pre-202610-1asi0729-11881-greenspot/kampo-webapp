// Importa el contrato del repositorio financiero del dominio.
import { FinancialRecordRepository } from '../domain/model/repository/financial-record.repository';

// Importa Injectable para registrar el servicio.
import { Injectable } from '@angular/core';

// Importa el assembler encargado de transformar datos.
import { FinancialRecordAssembler } from './assemblers/financial-record-assembler.assembler';

// Importa HttpClient para realizar peticiones HTTP al backend.
import { HttpClient } from '@angular/common/http';

// Importa Value Objects utilizados como identificadores.
import { FundoId } from '../domain/model/value-object/fundo-id.vo';
import { SeasonId } from '../domain/model/value-object/season-id.vo';

// Importa herramientas RxJS.
import { map, Observable } from 'rxjs';

// Importa el Aggregate Root financiero.
import { FinancialRecord } from '../domain/model/aggregates/financial-record.aggregate';

// Importa la estructura de respuesta.
import { FinancialRecordResponse } from './responses/financial-record-response.response';

// IMPORTANTE: Importamos el environment para apuntar a tu localhost (Ajusta la ruta si es necesario)
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FinancialApi implements FinancialRecordRepository {
  private readonly assembler = new FinancialRecordAssembler();

  // CORRECCIÓN 1: Apuntamos al endpoint usando la variable de entorno de tu proyecto
  // Esto asegura que vaya a http://localhost:3000/financial-records
  private readonly endpoint = `${environment.apiBaseUrl}/financial-records`;

  constructor(private readonly http: HttpClient) {}

  // Obtiene un registro financiero específico
  findByFundoAndSeason(fundoId: FundoId, seasonId: SeasonId): Observable<FinancialRecord> {
    // CORRECCIÓN 2: Construimos la URL con query parameters que json-server sí entiende
    const url = `${this.endpoint}?fundoId=${fundoId.getValue()}&seasonId=${seasonId.getValue()}`;

    return (
      this.http
        // CORRECCIÓN 3: json-server siempre devuelve un array cuando filtramos con '?'
        .get<FinancialRecordResponse[]>(url)
        .pipe(
          map((list) => {
            // Verificamos si realmente encontró un documento maestro
            if (list.length > 0) {
              return this.assembler.toEntityFromResponse(list[0]);
            }
            // Si el backend devuelve un array vacío, lanzamos un error que el Store atrapará
            throw new Error('No se encontró el registro financiero para esta temporada');
          }),
        )
    );
  }

  // Guarda o actualiza un registro financiero.
  save(record: FinancialRecord): Observable<FinancialRecord> {
    const body = this.assembler.toResourceFromEntity(record);

    // En un PUT, json-server sí necesita que le apuntemos al ID exacto en la URL
    const url = `${this.endpoint}/${record.getId().getValue()}`;

    return this.http
      .put<FinancialRecordResponse>(url, body)
      .pipe(map((dto) => this.assembler.toEntityFromResponse(dto)));
  }

  // Obtiene todos los registros financieros asociados a un fundo.
  findAllByFundo(fundoId: FundoId): Observable<FinancialRecord[]> {
    const url = `${this.endpoint}?fundoId=${fundoId.getValue()}`;

    return this.http
      .get<FinancialRecordResponse[]>(url)
      .pipe(map((list) => list.map((dto) => this.assembler.toEntityFromResponse(dto))));
  }
}
