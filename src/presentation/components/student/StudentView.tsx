import React, { useState } from 'react';
import { VirtualQueueWidget } from './VirtualQueueWidget';
import { JunaebBalancePill } from './JunaebBalancePill';
import { ActiveOrderTracker } from './ActiveOrderTracker';
import { CategoryFilters } from './CategoryFilters';
import { ProductCard } from './ProductCard';
import { useCatalog } from '../../hooks/useCatalog';
import { useOrders } from '../../hooks/useOrders';
import { ProductCategory } from '../../../core/domain/types';
import { ProductDTO } from '../../../core/application/dtos';

interface StudentViewProps {
  onInitiateCheckout: (product: ProductDTO) => void;
}

export const StudentView: React.FC<StudentViewProps> = ({ onInitiateCheckout }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todos'>('todos');
  const { products, loading } = useCatalog(selectedCategory);
  const { orders, activeStudentOrder, dismissActiveStudentOrder } = useOrders();

  const pendingCount = orders.length;

  return (
    <div className="py-6 px-4 flex justify-center items-start min-h-[calc(100vh-4rem)]">
      {/* Phone Mockup Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col relative transition-all duration-300">
        
        {/* Top Header Widget: Fila Virtual & JUNAEB balance */}
        <div>
          <VirtualQueueWidget pendingCount={pendingCount} />
          <div className="px-5 -mt-2 pb-3 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-b-2xl">
            <JunaebBalancePill />
          </div>
        </div>

        {/* Active Order Status Tracker (Dynamic) */}
        <ActiveOrderTracker
          order={activeStudentOrder}
          onDismiss={dismissActiveStudentOrder}
        />

        {/* Catalog Section Header */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Menú del Día</h2>
              <p className="text-xs text-slate-500">Pide ahora y retira en el counter #2</p>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 flex items-center shadow-2xs">
              <i className="fa-solid fa-rotate text-xs mr-1 animate-spin" style={{ animationDuration: '4s' }}></i>
              Stock en vivo
            </span>
          </div>

          <CategoryFilters
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Product Cards Catalog List */}
        <div className="px-4 pb-4 space-y-3 overflow-y-auto max-h-[520px]">
          {loading ? (
            <div className="flex justify-center items-center py-16 text-slate-400">
              <i className="fa-solid fa-circle-notch fa-spin text-2xl text-blue-600 mr-2"></i>
              <span className="text-xs font-semibold">Cargando catálogo...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <i className="fa-solid fa-utensils text-3xl mb-2 text-slate-300"></i>
              <p className="text-sm">No hay productos en esta categoría.</p>
            </div>
          ) : (
            products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onOrderClick={onInitiateCheckout}
              />
            ))
          )}
        </div>

        {/* Sticky Student Footer Bar */}
        <div className="p-3 bg-white border-t border-slate-200 text-center text-xs text-slate-400 flex items-center justify-around">
          <div className="flex items-center space-x-1.5 text-slate-600 font-medium">
            <i className="fa-solid fa-shield-halved text-blue-600"></i>
            <span>Pago Seguro JUNAEB &amp; Webpay</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center space-x-1.5 text-slate-600 font-medium">
            <i className="fa-solid fa-bolt text-amber-500"></i>
            <span>Retiro exprés</span>
          </div>
        </div>

      </div>
    </div>
  );
};
