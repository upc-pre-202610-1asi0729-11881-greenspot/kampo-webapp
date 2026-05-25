export class IncomeId {
  constructor(private readonly value: number) {}
  getValue(): number {
    return this.value;
  }
  equals(other: IncomeId): boolean {
    return other instanceof IncomeId && this.value === other.getValue();
  }
}
