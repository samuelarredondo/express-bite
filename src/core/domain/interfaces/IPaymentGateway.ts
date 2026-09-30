import { Money } from '../value-objects/Money';
import { PaymentMethodType, PaymentResult } from '../types';

/**
 * Port: IPaymentGateway
 * Open-Closed Principle (OCP) payment abstraction
 */
export interface IPaymentGateway {
  getMethod(): PaymentMethodType;
  processPayment(orderId: string, amount: Money, params?: Record<string, unknown>): Promise<PaymentResult>;
}
