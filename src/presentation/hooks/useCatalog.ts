import { useState, useEffect } from 'react';
import { useServices } from '../di/ServiceContainer';
import { ProductDTO } from '../../core/application/dtos';
import { ProductCategory } from '../../core/domain/types';

export function useCatalog(categoryFilter: ProductCategory | 'todos' = 'todos') {
  const { productRepository, getCatalogUseCase, adjustStockUseCase, replenishStockUseCase } = useServices();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const updateProducts = async () => {
      const dtos = await getCatalogUseCase.execute(categoryFilter);
      if (isMounted) {
        setProducts(dtos);
        setLoading(false);
      }
    };

    updateProducts();

    // Subscribe to real-time changes from product repository
    const unsubscribe = productRepository.subscribe(() => {
      updateProducts();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [categoryFilter, productRepository, getCatalogUseCase]);

  const adjustStock = async (productId: string, delta: number) => {
    return await adjustStockUseCase.execute(productId, delta);
  };

  const replenishStock = async (amount: number = 10) => {
    await replenishStockUseCase.execute(amount);
  };

  return {
    products,
    loading,
    adjustStock,
    replenishStock
  };
}
