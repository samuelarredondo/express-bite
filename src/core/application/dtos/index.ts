import { ProductCategory, OrderStatus, PaymentMethodType, OrderItem } from '../../domain/types';

export interface ProductDTO {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  formattedPrice: string;
  stock: number;
  icon: string;
  colorGradient: string;
  isAvailable: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
  imageUrl?: string;
}

export interface OrderDTO {
  id: string;
  studentName: string;
  items: OrderItem[];
  total: number;
  formattedTotal: string;
  status: OrderStatus;
  paymentMethod: PaymentMethodType;
  paymentAuthCode?: string;
  createdAt: string;
  isCurrentStudentOrder: boolean;
}

export interface CreateOrderInputDTO {
  productId: string;
  quantity?: number;
  studentName?: string;
  paymentMethod: PaymentMethodType;
  paymentPin?: string;
  isCurrentStudent?: boolean;
}

export interface CreateOrderOutputDTO {
  success: boolean;
  order?: OrderDTO;
  error?: string;
  errorCode?: string;
  missingAmount?: number;
}
