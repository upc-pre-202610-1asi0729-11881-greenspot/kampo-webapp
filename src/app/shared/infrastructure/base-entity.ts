
export class BaseEntity {
  constructor(private id: number) {}

  getId(): number {
    return this.id;
  }
}
