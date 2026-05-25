export class FinancialRecordId {
  constructor(private readonly value: number) {}
  getValue(): number {
    return this.value;
  }
  equals(other: FinancialRecordId): boolean {
    return other instanceof FinancialRecordId && this.value === other.getValue();
  }
}
