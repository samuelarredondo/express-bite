import React, { useState } from 'react';

interface CleanArchitectureViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CleanArchitectureViewerModal: React.FC<CleanArchitectureViewerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'domain' | 'application' | 'solid' | 'mocks'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 text-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh] my-6">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
                <span>Clean Architecture &amp; SOLID Principles</span>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-indigo-500/30">
                  Quick-Bite Core
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Diseño empresarial desacoplado con Entidades Product y Order, Interfaces y Casos de Uso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-circle-nodes mr-1.5"></i>
            Visión General
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'domain'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-cube mr-1.5"></i>
            Entidades (Product &amp; Order)
          </button>
          <button
            onClick={() => setActiveTab('application')}
            className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'application'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-gears mr-1.5"></i>
            Casos de Uso (Application)
          </button>
          <button
            onClick={() => setActiveTab('solid')}
            className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'solid'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-shield-halved mr-1.5"></i>
            Principios SOLID
          </button>
          <button
            onClick={() => setActiveTab('mocks')}
            className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'mocks'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-database mr-1.5"></i>
            Mocks de Prueba
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center">
                  <i className="fa-solid fa-arrows-spin text-indigo-400 mr-2"></i>
                  Flujo de Dependencias (The Dependency Rule)
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Las dependencias del código fuente <strong>apuntan siempre hacia adentro</strong>. Las entidades de negocio no conocen React, Vite ni pasarelas externas. El dominio es 100% puro y TypeScript nativo.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-indigo-500/30">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold mb-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs">1</span>
                    <span className="text-sm">Domain Layer (Núcleo)</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li><strong>Product Entity:</strong> Invariantes de inventario y estado.</li>
                    <li><strong>Order Entity:</strong> Agregado con máquina de estados finitos.</li>
                    <li><strong>Money Value Object:</strong> Aritmética inmutable en pesos CLP.</li>
                    <li><strong>Interfaces (Ports):</strong> <code className="text-indigo-300">IProductRepository</code>, <code className="text-indigo-300">IOrderRepository</code>, <code className="text-indigo-300">IPaymentGateway</code>.</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-2xl border border-blue-500/30">
                  <div className="flex items-center space-x-2 text-blue-400 font-bold mb-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs">2</span>
                    <span className="text-sm">Application Layer</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li><strong>CreateOrderUseCase:</strong> Orquesta cobro, decremento atómico y persistencia.</li>
                    <li><strong>UpdateOrderStatusUseCase:</strong> Transiciones preparacion ➔ listo.</li>
                    <li><strong>DeliverOrderUseCase:</strong> Archiva orden y suma entregas.</li>
                    <li><strong>DTOs:</strong> Aislamiento de datos de frontera.</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-2xl border border-emerald-500/30">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-xs">3</span>
                    <span className="text-sm">Infrastructure Layer</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li><strong>Repositories:</strong> InMemory con patrón Observer reactivo.</li>
                    <li><strong>Gateways:</strong> JunaebPaymentGateway (valida saldo BAE $34.500 vs $500), WebpayPaymentGateway (Transbank).</li>
                    <li><strong>PaymentGatewayRegistry:</strong> Extensibilidad abierta.</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-2xl border border-amber-500/30">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold mb-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-xs">4</span>
                    <span className="text-sm">Presentation Layer</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li><strong>ServiceContainer (DI):</strong> Inyección de dependencias centralizada.</li>
                    <li><strong>Custom Hooks:</strong> useCatalog, useOrders, useStudentWallet.</li>
                    <li><strong>Vistas Modulares:</strong> Estudiante Mobile-first &amp; Kanban de Cafetería.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'domain' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-emerald-400">
                <span className="text-slate-500">// Entidad de Negocio: Product (/src/core/domain/entities/Product.ts)</span>
                {`
export class Product {
  private readonly _id: string;
  private _name: string;
  private _category: ProductCategory;
  private _price: Money;
  private _stock: number;

  public isAvailable(): boolean { return this._stock > 0; }
  public isLowStock(): boolean { return this._stock > 0 && this._stock <= 3; }
  public isOutOfStock(): boolean { return this._stock <= 0; }

  public decrementStock(quantity: number = 1): void {
    if (this._stock < quantity) throw new Error("Stock insuficiente");
    this._stock -= quantity;
  }
}`}
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-blue-400">
                <span className="text-slate-500">// Entidad de Negocio: Order (/src/core/domain/entities/Order.ts)</span>
                {`
export class Order {
  private readonly _id: string;
  private readonly _studentName: string;
  private readonly _items: OrderItem[];
  private readonly _total: Money;
  private _status: OrderStatus; // 'preparacion' | 'listo' | 'entregado'

  public markAsReady(): void {
    if (this._status !== 'preparacion') throw new Error("Transición inválida");
    this._status = 'listo';
  }

  public markAsDelivered(): void {
    if (this._status !== 'listo') throw new Error("Debe estar listo antes de entregar");
    this._status = 'entregado';
  }
}`}
              </div>
            </div>
          )}

          {activeTab === 'application' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <h4 className="text-sm font-bold text-white mb-1">
                  Orquestación del Caso de Uso: CreateOrderUseCase
                </h4>
                <p className="text-slate-300">
                  Garantiza la transacción de negocio: primero verifica producto y stock, luego procesa el cobro con la pasarela correspondiente. <strong>Si el saldo JUNAEB es insuficiente, no descuenta inventario ni crea la orden</strong>, devolviendo código de rechazo para el flujo de rescate.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-amber-300">
                {`const paymentResult = await gateway.processPayment(orderId, totalAmount, { pin });
if (!paymentResult.success) {
  // Invariante: no se muta el stock si el cobro fue denegado
  return { success: false, error: paymentResult.message, errorCode: paymentResult.errorCode };
}

product.decrementStock(quantity);
await this.productRepository.save(product);
await this.orderRepository.create(new Order({ ... }));`}
              </div>
            </div>
          )}

          {activeTab === 'solid' && (
            <div className="space-y-3">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
                <span className="font-extrabold text-indigo-400 block mb-1">S - Single Responsibility Principle (SRP)</span>
                <p className="text-slate-300">Cada caso de uso (`CreateOrderUseCase`, `DeliverOrderUseCase`, etc.) tiene una única razón de cambio. Las entidades solo guardan estado e invariantes del negocio.</p>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
                <span className="font-extrabold text-blue-400 block mb-1">O - Open/Closed Principle (OCP)</span>
                <p className="text-slate-300">El sistema de pagos está abierto a nuevas pasarelas (ej. MercadoPago, Fpay) registrando implementaciones de `IPaymentGateway` sin modificar `CreateOrderUseCase`.</p>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
                <span className="font-extrabold text-emerald-400 block mb-1">L - Liskov Substitution Principle (LSP)</span>
                <p className="text-slate-300">Tanto `JunaebPaymentGateway` como `WebpayPaymentGateway` pueden intercambiarse sin alterar la corrección del programa.</p>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
                <span className="font-extrabold text-amber-400 block mb-1">I - Interface Segregation Principle (ISP)</span>
                <p className="text-slate-300">Interfaces segregadas y precisas (`IProductRepository`, `IOrderRepository`, `INotificationService`, `IPaymentGateway`) en lugar de una interfaz monolítica.</p>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
                <span className="font-extrabold text-rose-400 block mb-1">D - Dependency Inversion Principle (DIP)</span>
                <p className="text-slate-300">Los módulos de alto nivel no dependen de módulos de bajo nivel; ambos dependen de abstracciones inyectadas por el `ServiceContainer`.</p>
              </div>
            </div>
          )}

          {activeTab === 'mocks' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <h4 className="text-sm font-bold text-white mb-1">
                  Datos de Prueba Iniciales (Mocks)
                </h4>
                <p className="text-slate-300">
                  Semillas de productos universitarios realistas y órdenes operativas en preparación y listas para retiro.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-indigo-400 font-bold block mb-1">Productos Mocks:</span>
                  <ul className="text-slate-300 space-y-1">
                    <li>• Empanada de Horno Criolla ($2.400)</li>
                    <li>• Café Espresso Doble ($1.800)</li>
                    <li>• Sándwich Mechada Queso ($3.600 - Stock crítico: 2 un.)</li>
                    <li>• Muffin de Arándanos &amp; Vainilla ($1.500 - Agotado)</li>
                    <li>• Jugo Natural Naranja &amp; Zanahoria ($2.200)</li>
                    <li>• Wrap Vegetariano &amp; Hummus ($3.200)</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-blue-400 font-bold block mb-1">Órdenes Mocks Iniciales:</span>
                  <ul className="text-slate-300 space-y-1">
                    <li>• <strong>#QB-104:</strong> Tú (Estudiante) - Empanada (Webpay)</li>
                    <li>• <strong>#QB-105:</strong> Camila (Medicina) - Café + Sándwich (Webpay)</li>
                    <li>• <strong>#QB-103:</strong> Diego (Ingeniería) - Jugo Natural (JUNAEB)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
          >
            Entendido, volver a la App
          </button>
        </div>

      </div>
    </div>
  );
};
