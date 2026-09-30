import { IProductRepository } from '../../domain/interfaces/IProductRepository';
import { INotificationService } from '../../domain/interfaces/INotificationService';

export class AdjustStockUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly notificationService: INotificationService
  ) {}

  public async execute(productId: string, delta: number): Promise<boolean> {
    const product = await this.productRepository.findById(productId);
    if (!product) return false;

    product.adjustStock(delta);
    await this.productRepository.save(product);

    if (product.stock === 0) {
      this.notificationService.notify(
        'Stock Agotado',
        `"${product.name}" ha quedado sin unidades disponibles.`,
        'rose'
      );
    } else if (product.isLowStock()) {
      this.notificationService.notify(
        'Nivel de Stock Crítico',
        `"${product.name}" tiene solo ${product.stock} unidades restantes.`,
        'amber'
      );
    }

    return true;
  }
}

export class ReplenishStockUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly notificationService: INotificationService
  ) {}

  public async execute(amount: number = 10): Promise<void> {
    const products = await this.productRepository.findAll();
    for (const product of products) {
      product.replenishStock(amount);
      await this.productRepository.save(product);
    }

    this.notificationService.notify(
      'Inventario Reabastecido',
      `Se sumaron +${amount} unidades a todos los productos del menú de la cafetería.`,
      'blue'
    );
  }
}
