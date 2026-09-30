import { Order } from '../entities/Order';

/**
 * Port: IOrderRepository
 * Clean Architecture interface for order dispatch persistence
 */
export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  create(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
  delete(id: string): Promise<void>;
  getDeliveredCount(): Promise<number>;
  incrementDeliveredCount(): Promise<number>;
  resetToDefault(): Promise<void>;
  subscribe(listener: (orders: Order[]) => void): () => void;
}
