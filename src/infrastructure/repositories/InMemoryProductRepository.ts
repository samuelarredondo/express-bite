import { IProductRepository } from '../../core/domain/interfaces/IProductRepository';
import { Product } from '../../core/domain/entities/Product';
import { createInitialMockProducts } from '../mocks/mockData';

export class InMemoryProductRepository implements IProductRepository {
  private products: Map<string, Product> = new Map();
  private listeners: Set<(products: Product[]) => void> = new Set();

  constructor() {
    this.seed();
  }

  private seed(): void {
    this.products.clear();
    const mocks = createInitialMockProducts();
    mocks.forEach(p => this.products.set(p.id, p));
  }

  public async findAll(): Promise<Product[]> {
    return Array.from(this.products.values()).map(p => p.clone());
  }

  public async findById(id: string): Promise<Product | null> {
    const found = this.products.get(id);
    return found ? found.clone() : null;
  }

  public async save(product: Product): Promise<void> {
    this.products.set(product.id, product.clone());
    this.notify();
  }

  public async resetToDefault(): Promise<void> {
    this.seed();
    this.notify();
  }

  public subscribe(listener: (products: Product[]) => void): () => void {
    this.listeners.add(listener);
    // Emit initial snapshot
    listener(Array.from(this.products.values()).map(p => p.clone()));
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = Array.from(this.products.values()).map(p => p.clone());
    this.listeners.forEach(fn => fn(snapshot));
  }
}
