import { IOrderRepository } from '../../core/domain/interfaces/IOrderRepository';
import { Order } from '../../core/domain/entities/Order';
import { createInitialMockOrders } from '../mocks/mockData';

export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Map<string, Order> = new Map();
  private deliveredCount: number = 14;
  private listeners: Set<(orders: Order[]) => void> = new Set();

  constructor() {
    this.seed();
  }

  private seed(): void {
    this.orders.clear();
    this.deliveredCount = 14;
    const mocks = createInitialMockOrders();
    mocks.forEach(o => this.orders.set(o.id, o));
  }

  public async findAll(): Promise<Order[]> {
    return Array.from(this.orders.values()).map(o => o.clone());
  }

  public async findById(id: string): Promise<Order | null> {
    const order = this.orders.get(id);
    return order ? order.clone() : null;
  }

  public async create(order: Order): Promise<void> {
    this.orders.set(order.id, order.clone());
    this.notify();
  }

  public async update(order: Order): Promise<void> {
    this.orders.set(order.id, order.clone());
    this.notify();
  }

  public async delete(id: string): Promise<void> {
    this.orders.delete(id);
    this.notify();
  }

  public async getDeliveredCount(): Promise<number> {
    return this.deliveredCount;
  }

  public async incrementDeliveredCount(): Promise<number> {
    this.deliveredCount += 1;
    this.notify();
    return this.deliveredCount;
  }

  public async resetToDefault(): Promise<void> {
    this.seed();
    this.notify();
  }

  public subscribe(listener: (orders: Order[]) => void): () => void {
    this.listeners.add(listener);
    listener(Array.from(this.orders.values()).map(o => o.clone()));
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = Array.from(this.orders.values()).map(o => o.clone());
    this.listeners.forEach(fn => fn(snapshot));
  }
}
