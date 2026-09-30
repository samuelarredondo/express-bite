import React, { createContext, useContext, useMemo } from 'react';
import { InMemoryProductRepository } from '../../infrastructure/repositories/InMemoryProductRepository';
import { InMemoryOrderRepository } from '../../infrastructure/repositories/InMemoryOrderRepository';
import { PaymentGatewayRegistry } from '../../infrastructure/payment/PaymentGatewayFactory';
import { ToastNotificationService } from '../../infrastructure/services/ToastNotificationService';
import { GetCatalogUseCase } from '../../core/application/use-cases/GetCatalogUseCase';
import { CreateOrderUseCase } from '../../core/application/use-cases/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from '../../core/application/use-cases/UpdateOrderStatusUseCase';
import { DeliverOrderUseCase } from '../../core/application/use-cases/DeliverOrderUseCase';
import { AdjustStockUseCase, ReplenishStockUseCase } from '../../core/application/use-cases/AdjustStockUseCase';
import { SimulateIncomingOrderUseCase } from '../../core/application/use-cases/SimulateIncomingOrderUseCase';

export interface ServiceContainerContextValue {
  productRepository: InMemoryProductRepository;
  orderRepository: InMemoryOrderRepository;
  paymentRegistry: PaymentGatewayRegistry;
  notificationService: ToastNotificationService;
  getCatalogUseCase: GetCatalogUseCase;
  createOrderUseCase: CreateOrderUseCase;
  updateOrderStatusUseCase: UpdateOrderStatusUseCase;
  deliverOrderUseCase: DeliverOrderUseCase;
  adjustStockUseCase: AdjustStockUseCase;
  replenishStockUseCase: ReplenishStockUseCase;
  simulateIncomingOrderUseCase: SimulateIncomingOrderUseCase;
  resetAllDemoData: () => Promise<void>;
}

const ServiceContext = createContext<ServiceContainerContextValue | null>(null);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const services = useMemo(() => {
    // 1. Instantiate Infrastructure Repositories & Services
    const productRepository = new InMemoryProductRepository();
    const orderRepository = new InMemoryOrderRepository();
    const paymentRegistry = new PaymentGatewayRegistry();
    const notificationService = new ToastNotificationService();

    // 2. Instantiate Application Use Cases (Injecting dependencies)
    const getCatalogUseCase = new GetCatalogUseCase(productRepository);
    const createOrderUseCase = new CreateOrderUseCase(
      productRepository,
      orderRepository,
      paymentRegistry.getMap(),
      notificationService
    );
    const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository, notificationService);
    const deliverOrderUseCase = new DeliverOrderUseCase(orderRepository, notificationService);
    const adjustStockUseCase = new AdjustStockUseCase(productRepository, notificationService);
    const replenishStockUseCase = new ReplenishStockUseCase(productRepository, notificationService);
    const simulateIncomingOrderUseCase = new SimulateIncomingOrderUseCase(
      productRepository,
      orderRepository,
      notificationService
    );

    const resetAllDemoData = async () => {
      await productRepository.resetToDefault();
      await orderRepository.resetToDefault();
      paymentRegistry.junaebGateway.resetBalance();
      notificationService.notify(
        'Datos Reiniciados',
        'La demo ha vuelto al estado original: Saldo JUNAEB $34.500 CLP y órdenes iniciales.',
        'slate'
      );
    };

    return {
      productRepository,
      orderRepository,
      paymentRegistry,
      notificationService,
      getCatalogUseCase,
      createOrderUseCase,
      updateOrderStatusUseCase,
      deliverOrderUseCase,
      adjustStockUseCase,
      replenishStockUseCase,
      simulateIncomingOrderUseCase,
      resetAllDemoData
    };
  }, []);

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

export function useServices(): ServiceContainerContextValue {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}
