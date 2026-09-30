import { Product } from '../../core/domain/entities/Product';
import { Order } from '../../core/domain/entities/Order';
import { Money } from '../../core/domain/value-objects/Money';

export function createInitialMockProducts(): Product[] {
  return [
    new Product({
      id: 'p1',
      name: 'Empanada de Horno Criolla',
      category: 'comida',
      description: 'Carne picada seleccionada, cebolla caramelizada, huevo y aceituna.',
      price: Money.from(2400),
      stock: 7, // 1 sold
      icon: 'fa-bread-slice',
      colorGradient: 'from-amber-500 to-orange-500'
    }),
    new Product({
      id: 'p2',
      name: 'Café Espresso Doble',
      category: 'bebida',
      description: 'Café de grano arábica tostado medio con notas achocolatadas.',
      price: Money.from(1800),
      stock: 14,
      icon: 'fa-mug-saucer',
      colorGradient: 'from-amber-700 to-amber-900'
    }),
    new Product({
      id: 'p3',
      name: 'Sándwich Mechada Queso',
      category: 'comida',
      description: 'Pan ciabatta tostado, abundante carne mechada y queso mantecoso fundido.',
      price: Money.from(3600),
      stock: 2, // Low stock on purpose for testing critical stock alert
      icon: 'fa-burger',
      colorGradient: 'from-red-500 to-amber-600'
    }),
    new Product({
      id: 'p4',
      name: 'Muffin de Arándanos & Vainilla',
      category: 'snacks',
      description: 'Receta horneada hoy con arándanos frescos de estación.',
      price: Money.from(1500),
      stock: 0, // Out of stock on purpose
      icon: 'fa-cookie-bite',
      colorGradient: 'from-purple-500 to-pink-500'
    }),
    new Product({
      id: 'p5',
      name: 'Jugo Natural Naranja & Zanahoria',
      category: 'bebida',
      description: '100% natural prensado en frío, 400ml sin azúcar añadida.',
      price: Money.from(2200),
      stock: 6,
      icon: 'fa-glass-water',
      colorGradient: 'from-orange-400 to-amber-500'
    }),
    new Product({
      id: 'p6',
      name: 'Wrap Vegetariano & Hummus',
      category: 'comida',
      description: 'Tortilla integral, espinacas frescas, pimentón asado y hummus casero.',
      price: Money.from(3200),
      stock: 5,
      icon: 'fa-leaf',
      colorGradient: 'from-emerald-500 to-teal-600'
    })
  ];
}

export function createInitialMockOrders(): Order[] {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

  return [
    new Order({
      id: 'QB-104',
      studentName: 'Tú (Estudiante)',
      items: [
        {
          productId: 'p1',
          name: 'Empanada de Horno Criolla',
          unitPrice: 2400,
          quantity: 1
        }
      ],
      total: Money.from(2400),
      status: 'preparacion',
      paymentMethod: 'Webpay',
      paymentAuthCode: 'TBK-884920',
      createdAt: twoMinutesAgo,
      isCurrentStudentOrder: true
    }),
    new Order({
      id: 'QB-105',
      studentName: 'Camila (Medicina)',
      items: [
        {
          productId: 'p2',
          name: 'Café Espresso Doble',
          unitPrice: 1800,
          quantity: 1
        },
        {
          productId: 'p3',
          name: 'Sándwich Mechada Queso',
          unitPrice: 3600,
          quantity: 1
        }
      ],
      total: Money.from(5400),
      status: 'preparacion',
      paymentMethod: 'Webpay',
      paymentAuthCode: 'AUTH-99401',
      createdAt: fiveMinutesAgo,
      isCurrentStudentOrder: false
    }),
    new Order({
      id: 'QB-103',
      studentName: 'Diego (Ingeniería)',
      items: [
        {
          productId: 'p5',
          name: 'Jugo Natural Naranja',
          unitPrice: 2200,
          quantity: 1
        }
      ],
      total: Money.from(2200),
      status: 'listo',
      paymentMethod: 'JUNAEB',
      paymentAuthCode: 'AUTH-JUN-44120',
      createdAt: tenMinutesAgo,
      isCurrentStudentOrder: false
    })
  ];
}
