/**
 * Clean Architecture - Domain Types
 * Core business definitions independent of frameworks
 */

export type OrderStatus = 'preparacion' | 'listo' | 'entregado';

export type ProductCategory = 'comida' | 'bebida' | 'snacks';

export type PaymentMethodType = 'JUNAEB' | 'Webpay' | 'Caja';

export interface PaymentResult {
  success: boolean;
  authCode?: string;
  transactionId?: string;
  message: string;
  errorCode?: string;
  missingAmount?: number;
  provider?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}
