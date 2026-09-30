import { Money } from '../value-objects/Money';
import { OrderStatus, PaymentMethodType, OrderItem } from '../types';

export interface OrderProps {
  id: string;
  studentName: string;
  items: OrderItem[];
  total?: Money;
  status: OrderStatus;
  paymentMethod: PaymentMethodType;
  paymentAuthCode?: string;
  createdAt: Date;
  isCurrentStudentOrder?: boolean;
}

/**
 * Domain Entity: Order
 * Encapsulates the lifecycle, items, and state transitions of a student meal dispatch
 */
export class Order {
  private readonly _id: string;
  private readonly _studentName: string;
  private readonly _items: OrderItem[];
  private readonly _total: Money;
  private _status: OrderStatus;
  private readonly _paymentMethod: PaymentMethodType;
  private readonly _paymentAuthCode?: string;
  private readonly _createdAt: Date;
  private readonly _isCurrentStudentOrder: boolean;

  constructor(props: OrderProps) {
    if (!props.id || props.id.trim() === '') {
      throw new Error('Order ID cannot be empty');
    }
    if (!props.studentName || props.studentName.trim() === '') {
      throw new Error('Student name cannot be empty');
    }
    if (!props.items || props.items.length === 0) {
      throw new Error('An order must contain at least one item');
    }

    this._id = props.id;
    this._studentName = props.studentName;
    this._items = [...props.items];
    this._status = props.status;
    this._paymentMethod = props.paymentMethod;
    this._paymentAuthCode = props.paymentAuthCode;
    this._createdAt = props.createdAt;
    this._isCurrentStudentOrder = props.isCurrentStudentOrder ?? false;

    // Calculate total if not explicitly provided
    if (props.total) {
      this._total = props.total;
    } else {
      const calculatedSum = this._items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );
      this._total = Money.from(calculatedSum);
    }
  }

  // Getters
  public get id(): string { return this._id; }
  public get studentName(): string { return this._studentName; }
  public get items(): ReadonlyArray<OrderItem> { return this._items; }
  public get total(): Money { return this._total; }
  public get status(): OrderStatus { return this._status; }
  public get paymentMethod(): PaymentMethodType { return this._paymentMethod; }
  public get paymentAuthCode(): string | undefined { return this._paymentAuthCode; }
  public get createdAt(): Date { return this._createdAt; }
  public get isCurrentStudentOrder(): boolean { return this._isCurrentStudentOrder; }

  // State Transition Methods (State Pattern Invariant Enforcement)
  public markAsReady(): void {
    if (this._status !== 'preparacion') {
      throw new Error(`Invalid state transition: Cannot mark order as ready from "${this._status}"`);
    }
    this._status = 'listo';
  }

  public markAsDelivered(): void {
    if (this._status !== 'listo') {
      throw new Error(`Invalid state transition: Cannot deliver order from "${this._status}". Must be ready first.`);
    }
    this._status = 'entregado';
  }

  public revertToPreparing(): void {
    if (this._status !== 'listo') {
      throw new Error(`Invalid state transition: Cannot revert order to preparing from "${this._status}"`);
    }
    this._status = 'preparacion';
  }

  public isPreparing(): boolean {
    return this._status === 'preparacion';
  }

  public isReady(): boolean {
    return this._status === 'listo';
  }

  public isDelivered(): boolean {
    return this._status === 'entregado';
  }

  public getFormattedTime(): string {
    return this._createdAt.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  public clone(): Order {
    return new Order({
      id: this._id,
      studentName: this._studentName,
      items: [...this._items],
      total: Money.from(this._total.getAmount()),
      status: this._status,
      paymentMethod: this._paymentMethod,
      paymentAuthCode: this._paymentAuthCode,
      createdAt: new Date(this._createdAt.getTime()),
      isCurrentStudentOrder: this._isCurrentStudentOrder
    });
  }
}
