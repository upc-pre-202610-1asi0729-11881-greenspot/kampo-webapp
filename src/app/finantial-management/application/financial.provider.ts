import { FinancialApi } from '../infrastructure/financial-api';
import { Provider } from "@angular/core";
import { FINANCIAL_RECORD_REPOSITORY } from '../domain/model/repository/financial-record-repository.token';

export const financialDomainProviders: Provider[] = [
  FinancialApi,
  { provide: FINANCIAL_RECORD_REPOSITORY, useExisting: FinancialApi },
];
