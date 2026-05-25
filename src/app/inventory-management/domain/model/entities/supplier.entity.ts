export class Supplier {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly contact: string,
    private readonly email: string,
  ) {}

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getContact(): string {
    return this.contact;
  }

  getEmail(): string {
    return this.email;
  }
}
