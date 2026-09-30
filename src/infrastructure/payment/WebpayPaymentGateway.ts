import { IPaymentGateway } from '../../core/domain/interfaces/IPaymentGateway';
import { Money } from '../../core/domain/value-objects/Money';
import { PaymentMethodType, PaymentResult } from '../../core/domain/types';

export class WebpayPaymentGateway implements IPaymentGateway {
  public getMethod(): PaymentMethodType {
    return 'Webpay';
  }

  public async processPayment(
    orderId: string,
    amount: Money
  ): Promise<PaymentResult> {
    const randomAuthNum = Math.floor(10000 + Math.random() * 90000);
    return {
      success: true,
      authCode: `TBK-${randomAuthNum}`,
      transactionId: `TBK-TX-${orderId}`,
      message: `Pago aprobado exitosamente mediante Transbank Webpay Plus Débito por ${amount.format(true)}.`,
      provider: 'Transbank Webpay Plus'
    };
  }
}

export class CashPaymentGateway implements IPaymentGateway {
  public getMethod(): PaymentMethodType {
    return 'Caja';
  }

  public async processPayment(
    orderId: string
  ): Promise<PaymentResult> {
    return {
      success: true,
      authCode: 'OFFLINE-CAJA',
      transactionId: `POS-CASH-${orderId}`,
      message: 'Comanda registrada para cobro presencial en mesón #2 al momento del retiro.',
      provider: 'Mostrador Cafetería'
    };
  }
}
