import { ExpenseAssembler } from './expense-assembler.assembler';
import { IncomeAssembler } from './income-assembler.assembler';
import { SaleAssembler } from './sale-assembler.assembler';
import {
  FinancialRecordResource,
  FinancialRecordResponse,
} from '../responses/financial-record-response.response';
import { FinancialRecord } from '../../domain/model/aggregates/financial-record.aggregate';
import { FinancialRecordId } from '../../domain/model/value-object/financial-record-id.vo';
import { FundoId } from '../../domain/model/value-object/fundo-id.vo';
import { SeasonId } from '../../domain/model/value-object/season-id.vo';

export class FinancialRecordAssembler {
  private readonly expenseAssembler = new ExpenseAssembler();
  private readonly incomeAssembler = new IncomeAssembler();
  private readonly saleAssembler = new SaleAssembler();

  toEntityFromResponse(response: FinancialRecordResponse): FinancialRecord {
    return new FinancialRecord(
      new FinancialRecordId(response.id),
      new FundoId(response.fundoId),
      new SeasonId(response.seasonId),
      response.expenses.map((e) => this.expenseAssembler.toEntityFromResponse(e)),
      response.incomes.map((i) => this.incomeAssembler.toEntityFromResponse(i)),
      response.sales.map((s) => this.saleAssembler.toEntityFromResponse(s)),
    );
  }

  toResourceFromEntity(entity: FinancialRecord): FinancialRecordResource {
    return {
      fundoId: entity.getFundoId().getValue(),
      seasonId: entity.getSeasonId().getValue(),
      expenses: entity.getExpenses().map((e) => this.expenseAssembler.toResourceFromEntity(e)),
      incomes: entity.getIncomes().map((i) => this.incomeAssembler.toResourceFromEntity(i)),
      sales: entity.getSales().map((s) => this.saleAssembler.toResourceFromEntity(s)),
    };
  }
}
