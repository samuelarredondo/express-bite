import { IOrderRepository } from '../../domain/interfaces/IOrderRepository';
import { INotificationService } from '../../domain/interfaces/INotificationService';

export class DeliverOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly notificationService: INotificationService
  ) {}

  public async execute(orderId: string): Promise<boolean> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      this.notificationService.notify('Error', `Orden #${orderId} no encontrada`, 'rose');
      return false;
    }

    // Mark as delivered in domain entity
    order.markAsDelivered();
    await this.orderRepository.delete(orderId);
    await this.orderRepository.incrementDeliveredCount();

    const itemsSummary = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');

    this.notificationService.notify(
      `PEDIDO #${order.id} ¡ENTREGADO CON ÉXITO!`,
      `${itemsSummary} entregado a ${order.studentName}. Orden finalizada y archivada.`,
      'emerald',
      order.id
    );

    return true;
  }
}
