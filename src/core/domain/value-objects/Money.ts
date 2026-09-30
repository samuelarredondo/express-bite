/**
 * Value Object: Money
 * Encapsulates currency arithmetic, immutability, and validation for CLP
 */
export class Money {
  private readonly amount: number;

  constructor(amount: number) {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error(`Invalid monetary amount: ${amount}. Must be a non-negative finite number.`);
    }
    this.amount = Math.round(amount);
  }

  public getAmount(): number {
    return this.amount;
  }

  public format(withCurrencySuffix: boolean = false): string {
    const formatted = `$${this.amount.toLocaleString('es-CL')}`;
    return withCurrencySuffix ? `${formatted} CLP` : formatted;
  }

  public add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  public subtract(other: Money): Money {
    if (this.amount < other.amount) {
      throw new Error(`Insufficient funds: Cannot subtract ${other.amount} from ${this.amount}`);
    }
    return new Money(this.amount - other.amount);
  }

  public isGreaterThanOrEqual(other: Money): boolean {
    return this.amount >= other.amount;
  }

  public isZero(): boolean {
    return this.amount === 0;
  }

  public static from(amount: number): Money {
    return new Money(amount);
  }

  public static zero(): Money {
    return new Money(0);
  }
}
