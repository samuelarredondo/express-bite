import { IProductRepository } from '../../domain/interfaces/IProductRepository';
import { IOrderRepository } from '../../domain/interfaces/IOrderRepository';
import { INotificationService } from '../../domain/interfaces/INotificationService';
import { Order } from '../../domain/entities/Order';
import { Money } from '../../domain/value-objects/Money';
import { PaymentMethodType } from '../../domain/types';

let simCounter = 108;

export class SimulateIncomingOrderUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly notificationService: INotificationService
  ) {}

  public async execute(): Promise<boolean> {
    const products = await this.productRepository.findAll();
    const available = products.filter(p => p.isAvailable());

    if (available.length === 0) {
      this.notificationService.notify(
        'Sin stock disponible',
        'Todos los productos de la cafetería están agotados.',
        'rose'
      );
      return false;
    }

    const randomProd = available[Math.floor(Math.random() * available.length)];
    randomProd.decrementStock(1);
    await this.productRepository.save(randomProd);

    const names = [
      'Matías (Derecho)',
      'Sofía (Arquitectura)',
      'Ignacio (Comercial)',
      'Valentina (Ciencias)',
      'Camila (Medicina)',
      'Nicolás (Ingeniería)'
    ];
    const studentName = names[Math.floor(Math.random() * names.length)];

    const paymentMethods: PaymentMethodType[] = ['JUNAEB', 'Webpay'];
    const chosenMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const randomAuthNum = Math.floor(10000 + Math.random() * 90000);
    const authCode = chosenMethod === 'JUNAEB' ? `AUTH-JUN-${randomAuthNum}` : `TBK-${randomAuthNum}`;

    const orderId = `QB-${simCounter++}`;
    const order = new Order({
      id: orderId,
      studentName,
      items: [
        {
          productId: randomProd.id,
          name: randomProd.name,
          unitPrice: randomProd.price.getAmount(),
          quantity: 1
        }
      ],
      total: Money.from(randomProd.price.getAmount()),
      status: 'preparacion',
      paymentMethod: chosenMethod,
      paymentAuthCode: authCode,
      createdAt: new Date(),
      isCurrentStudentOrder: false
    });

    await this.orderRepository.create(order);

    this.notificationService.notify(
      `¡NUEVO PEDIDO ENTRANTE #${order.id}!`,
      `${studentName} • 1x ${randomProd.name} ($${randomProd.price.getAmount().toLocaleString('es-CL')} vía ${chosenMethod}). Ingresado a cocina.`,
      'amber',
      order.id
    );

    return true;
  }
}
