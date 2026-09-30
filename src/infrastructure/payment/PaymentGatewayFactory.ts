import { IPaymentGateway } from '../../core/domain/interfaces/IPaymentGateway';
import { PaymentMethodType } from '../../core/domain/types';
import { JunaebPaymentGateway } from './JunaebPaymentGateway';
import { WebpayPaymentGateway, CashPaymentGateway } from './WebpayPaymentGateway';

export class PaymentGatewayRegistry {
  private gateways: Map<PaymentMethodType, IPaymentGateway> = new Map();

  constructor(
    public readonly junaebGateway: JunaebPaymentGateway = new JunaebPaymentGateway(),
    public readonly webpayGateway: WebpayPaymentGateway = new WebpayPaymentGateway(),
    public readonly cashGateway: CashPaymentGateway = new CashPaymentGateway()
  ) {
    this.register(junaebGateway);
    this.register(webpayGateway);
    this.register(cashGateway);
  }

  public register(gateway: IPaymentGateway): void {
    this.gateways.set(gateway.getMethod(), gateway);
  }

  public get(method: PaymentMethodType): IPaymentGateway | undefined {
    return this.gateways.get(method);
  }

  public getMap(): Map<string, IPaymentGateway> {
    const map = new Map<string, IPaymentGateway>();
    this.gateways.forEach((gateway, key) => {
      map.set(key, gateway);
    });
    return map;
  }
}
