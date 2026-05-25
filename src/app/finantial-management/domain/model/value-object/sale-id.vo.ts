export class SaleId {
  constructor(private readonly value: number) {}
  getValue(): number {
    return this.value;
  }
  equals(other: SaleId): boolean {
    return other instanceof SaleId && this.value === other.getValue();
  }
}
