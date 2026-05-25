// Importa InjectionToken desde Angular.
// Se utiliza para definir tokens personalizados de inyección de dependencias.
import { InjectionToken } from '@angular/core';

// Importa la interfaz del repositorio financiero.
// Define el contrato que deben implementar los repositorios del dominio.
import { FinancialRecordRepository } from './financial-record.repository';

// Token de inyección utilizado por Angular DI (Dependency Injection).
//
// Permite asociar una implementación concreta al contrato
// FinancialRecordRepository sin acoplar el código a una clase específica.
//
// Esto facilita:
// - desacoplamiento,
// - pruebas unitarias,
// - reemplazo de implementaciones,
// - y arquitectura limpia.
export const FINANCIAL_RECORD_REPOSITORY = new InjectionToken<FinancialRecordRepository>(
  // Nombre descriptivo del token dentro del sistema de inyección.
  'FinancialRecordRepository',
);
