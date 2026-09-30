import { Product } from '../entities/Product';

/**
 * Port: IProductRepository
 * Clean Architecture interface for product data persistence
 */
export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
  resetToDefault(): Promise<void>;
  subscribe(listener: (products: Product[]) => void): () => void;
}
