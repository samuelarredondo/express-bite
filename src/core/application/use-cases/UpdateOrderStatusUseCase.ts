import { IOrderRepository } from '../../domain/interfaces/IOrderRepository';
import { INotificationService } from '../../domain/interfaces/INotificationService';
import { OrderStatus } from '../../domain/types';

export class UpdateOrderStatusUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly notificationService: INotificationService
  ) {}

  public async execute(orderId: string, newStatus: OrderStatus): Promise<boolean> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      this.notificationService.notify('Error', `Orden #${orderId} no encontrada`, 'rose');
      return false;
    }

    if (newStatus === 'listo') {
      order.markAsReady();
      await this.orderRepository.update(order);

      this.notificationService.notify(
        `PEDIDO #${order.id} ¡LISTO PARA RETIRO!`,
        `Notificación enviada a ${order.studentName} para retiro en Counter #2. Comanda lista.`,
        'emerald',
        order.id
      );
      return true;
    }

    if (newStatus === 'preparacion') {
      order.revertToPreparing();
      await this.orderRepository.update(order);

      this.notificationService.notify(
        `Orden #${order.id} Devuelta`,
        `Pedido devuelto a estación de preparación por el operador.`,
        'amber',
        order.id
      );
      return true;
    }

    return false;
  }
}
