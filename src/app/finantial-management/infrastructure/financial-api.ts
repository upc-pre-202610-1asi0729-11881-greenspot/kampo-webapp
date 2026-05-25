// Importa el contrato del repositorio financiero del dominio.
// Define las operaciones que debe implementar la infraestructura.
import { FinancialRecordRepository } from '../domain/model/repository/financial-record.repository';

// Importa Injectable para registrar el servicio
// dentro del sistema de inyección de dependencias de Angular.
import { Injectable } from '@angular/core';

// Importa el assembler encargado de transformar:
// - DTOs,
// - recursos HTTP,
// - entidades del dominio.
import { FinancialRecordAssembler } from './assemblers/financial-record-assembler.assembler';

// Importa HttpClient para realizar peticiones HTTP al backend.
import { HttpClient } from '@angular/common/http';

// Importa Value Objects utilizados como identificadores del dominio.
import { FundoId } from '../domain/model/value-object/fundo-id.vo';
import { SeasonId } from '../domain/model/value-object/season-id.vo';

// Importa herramientas RxJS.
// - Observable: manejo reactivo de datos asíncronos.
// - map: transformación de respuestas HTTP.
import { map, Observable } from 'rxjs';

// Importa el Aggregate Root financiero.
import { FinancialRecord } from '../domain/model/aggregates/financial-record.aggregate';

// Importa la estructura de respuesta recibida desde el backend.
import { FinancialRecordResponse } from './responses/financial-record-response.response';

// Servicio de infraestructura encargado de consumir
// los endpoints REST relacionados al módulo financiero.
//
// Además implementa el contrato FinancialRecordRepository,
// actuando como repositorio concreto del dominio.
@Injectable({ providedIn: 'root' })
export class FinancialApi implements FinancialRecordRepository {
  // Assembler utilizado para transformar datos
  // entre infraestructura y dominio.
  private readonly assembler = new FinancialRecordAssembler();

  // Endpoint base del módulo financiero.
  private readonly endpoint = '/api/financial-records';

  // Constructor del servicio.
  // Inyecta HttpClient para realizar peticiones HTTP.
  constructor(private readonly http: HttpClient) {}

  // Obtiene un registro financiero específico
  // según el fundo y la temporada agrícola.
  findByFundoAndSeason(fundoId: FundoId, seasonId: SeasonId): Observable<FinancialRecord> {
    // Construye la URL dinámica utilizando IDs del dominio.
    const url = `${this.endpoint}/${fundoId.getValue()}/seasons/${seasonId.getValue()}`;

    return (
      this.http

        // Realiza petición GET al backend.
        .get<FinancialRecordResponse>(url)

        // Convierte la respuesta HTTP en un aggregate del dominio.
        .pipe(map((dto) => this.assembler.toEntityFromResponse(dto)))
    );
  }

  // Guarda o actualiza un registro financiero.
  save(record: FinancialRecord): Observable<FinancialRecord> {
    // Convierte el aggregate en un recurso serializable.
    const body = this.assembler.toResourceFromEntity(record);

    // Construye la URL utilizando el ID del aggregate.
    const url = `${this.endpoint}/${record.getId().getValue()}`;

    return (
      this.http

        // Realiza petición PUT para actualizar información.
        .put<FinancialRecordResponse>(url, body)

        // Convierte la respuesta en aggregate del dominio.
        .pipe(map((dto) => this.assembler.toEntityFromResponse(dto)))
    );
  }

  // Obtiene todos los registros financieros
  // asociados a un fundo específico.
  findAllByFundo(fundoId: FundoId): Observable<FinancialRecord[]> {
    // Construye URL con query parameter.
    const url = `${this.endpoint}?fundoId=${fundoId.getValue()}`;

    return (
      this.http

        // Realiza petición GET.
        .get<FinancialRecordResponse[]>(url)

        // Convierte cada DTO recibido en aggregate del dominio.
        .pipe(map((list) => list.map((dto) => this.assembler.toEntityFromResponse(dto))))
    );
  }
}
