import { IPaymentGateway } from '../../core/domain/interfaces/IPaymentGateway';
import { Money } from '../../core/domain/value-objects/Money';
import { PaymentMethodType, PaymentResult } from '../../core/domain/types';

export class JunaebPaymentGateway implements IPaymentGateway {
  private balance: number = 34500;
  private balanceListeners: Set<(balance: number) => void> = new Set();

  public getMethod(): PaymentMethodType {
    return 'JUNAEB';
  }

  public getBalance(): number {
    return this.balance;
  }

  public setBalance(newBalance: number): void {
    this.balance = Math.max(0, newBalance);
    this.notifyBalance();
  }

  public resetBalance(): void {
    this.balance = 34500;
    this.notifyBalance();
  }

  public subscribeBalance(listener: (balance: number) => void): () => void {
    this.balanceListeners.add(listener);
    listener(this.balance);
    return () => {
      this.balanceListeners.delete(listener);
    };
  }

  private notifyBalance(): void {
    this.balanceListeners.forEach(fn => fn(this.balance));
  }

  public async processPayment(
    orderId: string,
    amount: Money
  ): Promise<PaymentResult> {
    const requiredAmount = amount.getAmount();

    // Check if student has sufficient balance in the BAE wallet
    if (this.balance < requiredAmount) {
      const missing = requiredAmount - this.balance;
      return {
        success: false,
        errorCode: 'ERR-JUNAEB-51',
        missingAmount: missing,
        message: `Tu Tarjeta JUNAEB (Beca de Alimentación) no cuenta con saldo suficiente para completar esta compra de ${amount.format(true)}. Saldo disponible: $${this.balance.toLocaleString('es-CL')} CLP.`
      };
    }

    // Deduct balance upon approval
    this.balance -= requiredAmount;
    this.notifyBalance();

    const randomAuthNum = Math.floor(10000 + Math.random() * 90000);
    return {
      success: true,
      authCode: `AUTH-JUN-#${randomAuthNum}`,
      transactionId: `TX-JUN-${orderId}`,
      message: 'Transacción aprobada y debitada de la Beca de Alimentación JUNAEB (Edenred / Sodexo).',
      provider: 'JUNAEB BAE'
    };
  }
}
