// Value Object que representa una cantidad monetaria dentro del sistema.
// Encapsula operaciones financieras y garantiza consistencia entre montos y monedas.
export class Money {
  // Constructor del Value Object Money.
  // Inicializa el monto numérico y la moneda asociada.
  constructor(
    // Valor monetario.
    // Se define como readonly para mantener la inmutabilidad del objeto.
    private readonly amount: number,

    // Tipo de moneda del monto (PEN, USD, EUR, etc.).
    // También es readonly para evitar cambios posteriores.
    private readonly currency: string,
  ) {}

  // Retorna el valor numérico del dinero.
  getAmount(): number {
    return this.amount;
  }

  // Retorna la moneda asociada al monto.
  getCurrency(): string {
    return this.currency;
  }

  // Realiza la suma de dos montos monetarios.
  // Solo se permite si ambas cantidades tienen la misma moneda.
  add(other: Money): Money {
    // Valida que ambas monedas sean compatibles.
    this.assertSameCurrency(other);

    // Retorna un nuevo objeto Money con el resultado de la suma.
    return new Money(this.amount + other.getAmount(), this.currency);
  }

  // Realiza la resta entre dos montos monetarios.
  // Solo se permite entre valores de la misma moneda.
  subtract(other: Money): Money {
    // Verifica compatibilidad de monedas.
    this.assertSameCurrency(other);

    // Retorna un nuevo objeto Money con el resultado de la resta.
    return new Money(this.amount - other.getAmount(), this.currency);
  }

  // Multiplica el monto por un factor numérico.
  // Útil para cálculos financieros, impuestos, cantidades, etc.
  multiply(factor: number): Money {
    // Retorna un nuevo objeto Money con el resultado.
    return new Money(this.amount * factor, this.currency);
  }

  // Compara si dos objetos Money son equivalentes.
  // Dos montos son iguales si tienen el mismo valor y la misma moneda.
  equals(other: Money): boolean {
    return (
      // Verifica que el objeto sea una instancia de Money.
      other instanceof Money &&
      // Compara el monto.
      this.amount === other.getAmount() &&
      // Compara la moneda.
      this.currency === other.getCurrency()
    );
  }

  // Método privado que valida que dos montos pertenezcan a la misma moneda.
  // Evita operaciones inválidas como sumar USD con PEN.
  private assertSameCurrency(other: Money): void {
    // Si las monedas son distintas, lanza un error.
    if (this.currency !== other.getCurrency()) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.getCurrency()}`);
    }
  }
}
