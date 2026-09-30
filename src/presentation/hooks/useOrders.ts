import { useState, useEffect } from 'react';
import { useServices } from '../di/ServiceContainer';
import { OrderDTO, CreateOrderInputDTO, CreateOrderOutputDTO } from '../../core/application/dtos';
import { OrderStatus } from '../../core/domain/types';

export function useOrders() {
  const {
    orderRepository,
    createOrderUseCase,
    updateOrderStatusUseCase,
    deliverOrderUseCase,
    simulateIncomingOrderUseCase
  } = useServices();

  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [deliveredCount, setDeliveredCount] = useState<number>(14);
  const [activeStudentOrderId, setActiveStudentOrderId] = useState<string | null>('QB-104');

  useEffect(() => {
    let isMounted = true;

    const refreshOrders = async () => {
      const allOrders = await orderRepository.findAll();
      const count = await orderRepository.getDeliveredCount();

      if (isMounted) {
        setOrders(
          allOrders.map(o => ({
            id: o.id,
            studentName: o.studentName,
            items: [...o.items],
            total: o.total.getAmount(),
            formattedTotal: o.total.format(),
            status: o.status,
            paymentMethod: o.paymentMethod,
            paymentAuthCode: o.paymentAuthCode,
            createdAt: o.getFormattedTime(),
            isCurrentStudentOrder: o.isCurrentStudentOrder
          }))
        );
        setDeliveredCount(count);
      }
    };

    refreshOrders();

    const unsubscribe = orderRepository.subscribe(() => {
      refreshOrders();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [orderRepository]);

  const createOrder = async (input: CreateOrderInputDTO): Promise<CreateOrderOutputDTO> => {
    const result = await createOrderUseCase.execute(input);
    if (result.success && result.order && input.isCurrentStudent) {
      setActiveStudentOrderId(result.order.id);
    }
    return result;
  };

  const updateStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    return await updateOrderStatusUseCase.execute(orderId, status);
  };

  const deliverOrder = async (orderId: string): Promise<boolean> => {
    return await deliverOrderUseCase.execute(orderId);
  };

  const simulateIncoming = async (): Promise<boolean> => {
    return await simulateIncomingOrderUseCase.execute();
  };

  const dismissActiveStudentOrder = () => {
    setActiveStudentOrderId(null);
  };

  // KPI Calculations
  const prepOrders = orders.filter(o => o.status === 'preparacion');
  const readyOrders = orders.filter(o => o.status === 'listo');
  const activeStudentOrder = orders.find(o => o.id === activeStudentOrderId) || null;

  return {
    orders,
    prepOrders,
    readyOrders,
    deliveredCount,
    activeStudentOrderId,
    activeStudentOrder,
    createOrder,
    updateStatus,
    deliverOrder,
    simulateIncoming,
    dismissActiveStudentOrder,
    setActiveStudentOrderId
  };
}
