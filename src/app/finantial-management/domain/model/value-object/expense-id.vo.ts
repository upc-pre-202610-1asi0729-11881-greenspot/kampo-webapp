export class ExpenseId {
  constructor(private readonly value: number) {}
  getValue(): number {
    return this.value;
  }
  equals(other: ExpenseId): boolean {
    return other instanceof ExpenseId && this.value === other.getValue();
  }
}
