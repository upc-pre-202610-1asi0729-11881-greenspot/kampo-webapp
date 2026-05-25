import { IncomeResource, IncomeResponse } from '../responses/income-response.response';
import { Income } from '../../domain/model/entities/income.entity';
import { IncomeId } from '../../domain/model/value-object/income-id.vo';
import { Money } from '../../domain/model/value-object/money.vo';

export class IncomeAssembler {
  toEntityFromResponse(response: IncomeResponse): Income {
    return new Income(
      new IncomeId(response.id),
      response.description,
      new Money(response.amount, response.currency),
      new Date(response.date),
    );
  }

  toResourceFromEntity(entity: Income): IncomeResource {
    return {
      description: entity.getDescription(),
      amount: entity.getAmount().getAmount(),
      currency: entity.getAmount().getCurrency(),
      date: entity.getDate().toISOString(),
    };
  }
}
