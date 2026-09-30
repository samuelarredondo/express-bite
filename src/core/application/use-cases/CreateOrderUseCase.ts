import { IProductRepository } from '../../domain/interfaces/IProductRepository';
import { IOrderRepository } from '../../domain/interfaces/IOrderRepository';
import { IPaymentGateway } from '../../domain/interfaces/IPaymentGateway';
import { INotificationService } from '../../domain/interfaces/INotificationService';
import { CreateOrderInputDTO, CreateOrderOutputDTO } from '../dtos';
import { Order } from '../../domain/entities/Order';
import { Money } from '../../domain/value-objects/Money';

let orderIdSequence = 106;

export class CreateOrderUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly paymentGateways: Map<string, IPaymentGateway>,
    private readonly notificationService: INotificationService
  ) {}

  public async execute(input: CreateOrderInputDTO): Promise<CreateOrderOutputDTO> {
    const quantity = input.quantity ?? 1;

    // 1. Fetch Product
    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      return {
        success: false,
        error: `Producto con ID "${input.productId}" no encontrado.`
      };
    }

    // 2. Business Rule: Check Stock Availability
    if (!product.canFulfill(quantity)) {
      return {
        success: false,
        error: `Stock insuficiente para "${product.name}". Disponibles: ${product.stock}`
      };
    }

    // 3. Resolve Payment Gateway (Strategy Pattern via OCP)
    const gateway = this.paymentGateways.get(input.paymentMethod);
    if (!gateway) {
      return {
        success: false,
        error: `Método de pago "${input.paymentMethod}" no soportado.`
      };
    }

    const totalAmount = Money.from(product.price.getAmount() * quantity);
    const generatedOrderId = `QB-${orderIdSequence++}`;

    // 4. Process Payment
    const paymentResult = await gateway.processPayment(generatedOrderId, totalAmount, {
      pin: input.paymentPin
    });

    if (!paymentResult.success) {
      // Invariant: Do not decrement stock or persist order if payment was rejected!
      this.notificationService.notify(
        'Transacción Denegada',
        paymentResult.message,
        'rose',
        paymentResult.errorCode
      );

      return {
        success: false,
        error: paymentResult.message,
        errorCode: paymentResult.errorCode,
        missingAmount: paymentResult.missingAmount
      };
    }

    // 5. Decrement Stock on Product Entity
    product.decrementStock(quantity);
    await this.productRepository.save(product);

    // 6. Create & Persist Domain Order Entity
    const order = new Order({
      id: generatedOrderId,
      studentName: input.studentName || (input.isCurrentStudent ? 'Tú (Estudiante)' : 'Alumno Campus'),
      items: [
        {
          productId: product.id,
          name: product.name,
          unitPrice: product.price.getAmount(),
          quantity
        }
      ],
      total: totalAmount,
      status: 'preparacion',
      paymentMethod: input.paymentMethod,
      paymentAuthCode: paymentResult.authCode,
      createdAt: new Date(),
      isCurrentStudentOrder: input.isCurrentStudent ?? true
    });

    await this.orderRepository.create(order);

    // 7. Dispatch Notification
    const paymentBadge = input.paymentMethod === 'JUNAEB' ? 'Beca JUNAEB' : input.paymentMethod === 'Webpay' ? 'Webpay Plus' : 'En Caja';
    this.notificationService.notify(
      '¡Pedido Confirmado!',
      `Orden #${order.id} enviada a cocina. ${order.items[0].quantity}x ${order.items[0].name} (${paymentBadge}).`,
      'emerald',
      order.id
    );

    return {
      success: true,
      order: {
        id: order.id,
        studentName: order.studentName,
        items: [...order.items],
        total: order.total.getAmount(),
        formattedTotal: order.total.format(),
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentAuthCode: order.paymentAuthCode,
        createdAt: order.getFormattedTime(),
        isCurrentStudentOrder: order.isCurrentStudentOrder
      }
    };
  }
}
