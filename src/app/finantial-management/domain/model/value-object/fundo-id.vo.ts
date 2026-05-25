export class FundoId {
  constructor(private readonly value: number) {}
  getValue(): number {
    return this.value;
  }
  equals(other: FundoId): boolean {
    return other instanceof FundoId && this.value === other.getValue();
  }
}
