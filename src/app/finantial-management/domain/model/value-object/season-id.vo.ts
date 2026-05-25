export class SeasonId {
  constructor(private readonly value: number) {}
  getValue(): number {
    return this.value;
  }
  equals(other: SeasonId): boolean {
    return other instanceof SeasonId && this.value === other.getValue();
  }
}
