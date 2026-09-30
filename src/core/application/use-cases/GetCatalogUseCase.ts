import { IProductRepository } from '../../domain/interfaces/IProductRepository';
import { ProductDTO } from '../dtos';
import { ProductCategory } from '../../domain/types';

export class GetCatalogUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  public async execute(categoryFilter?: ProductCategory | 'todos'): Promise<ProductDTO[]> {
    const products = await this.productRepository.findAll();

    const filtered = categoryFilter && categoryFilter !== 'todos'
      ? products.filter(p => p.category === categoryFilter)
      : products;

    return filtered.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price.getAmount(),
      formattedPrice: p.price.format(),
      stock: p.stock,
      icon: p.icon,
      colorGradient: p.colorGradient,
      isAvailable: p.isAvailable(),
      isLowStock: p.isLowStock(),
      isOutOfStock: p.isOutOfStock(),
      imageUrl: p.imageUrl
    }));
  }
}
