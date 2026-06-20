export class ExpenseId {
  constructor(private readonly value: string | number) {}
  getValue(): string | number {
    return this.value;
  }
  equals(other: ExpenseId): boolean {
    return other instanceof ExpenseId && String(this.value) === String(other.getValue());
  }
}
