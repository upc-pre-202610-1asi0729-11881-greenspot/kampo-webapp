import { ExpenseResource, ExpenseResponse } from '../responses/expense-response.response';
import { Expense } from '../../domain/model/entities/expense.entity';
import { ExpenseId } from '../../domain/model/value-object/expense-id.vo';
import { Money } from '../../domain/model/value-object/money.vo';
import { ExpenseCategory } from '../../domain/model/enums/expense-category.enum';

export class ExpenseAssembler {
  toEntityFromResponse(response: ExpenseResponse): Expense {
    const category = ExpenseAssembler.parseCategory(response.category);
    return new Expense(
      new ExpenseId(response.id),
      response.description,
      new Money(response.amount, response.currency),
      category,
      new Date(response.date),
    );
  }

  toResourceFromEntity(entity: Expense): ExpenseResource {
    return {
      description: entity.getDescription(),
      amount: entity.getAmount().getAmount(),
      currency: entity.getAmount().getCurrency(),
      category: entity.getCategory(),
      date: entity.getDate().toISOString(),
    };
  }

  private static parseCategory(raw: string): ExpenseCategory {
    const upper = raw.toUpperCase() as keyof typeof ExpenseCategory;
    if (upper in ExpenseCategory) {
      return ExpenseCategory[upper];
    }
    return ExpenseCategory.OTHER;
  }
}
