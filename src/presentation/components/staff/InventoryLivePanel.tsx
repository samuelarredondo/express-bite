import React from 'react';
import { ProductDTO } from '../../../core/application/dtos';

interface InventoryLivePanelProps {
  products: ProductDTO[];
  onAdjustStock: (productId: string, delta: number) => void;
  onReplenishStock: () => void;
}

export const InventoryLivePanel: React.FC<InventoryLivePanelProps> = ({
  products,
  onAdjustStock,
  onReplenishStock
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center">
            <i className="fa-solid fa-boxes-stacked mr-2 text-indigo-600"></i>
            Stock en Vivo
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Ajuste de inventario en tiempo real</p>
        </div>
        <button
          onClick={onReplenishStock}
          title="Restablecer stock a niveles óptimos (+10 a todo)"
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2.5 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-100 shadow-2xs"
        >
          + Restock
        </button>
      </div>

      <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <i className="fa-solid fa-circle-info text-blue-600 mr-1"></i>
        Cada checkout aprobado descuenta <strong>1 unidad</strong> de stock automáticamente.
      </div>

      {/* Inventory Items List */}
      <div className="divide-y divide-slate-100 mt-3 flex-1 overflow-y-auto max-h-[520px]">
        {products.map(p => {
          return (
            <div key={p.id} className="py-3 flex items-center justify-between px-1">
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 text-xs flex-shrink-0">
                  <i className={`fa-solid ${p.icon}`}></i>
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-slate-900 truncate">{p.name}</h5>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[11px] text-slate-500 font-mono">
                      {p.formattedPrice}
                    </span>
                    {p.isOutOfStock ? (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded border border-rose-200">
                        Agotado
                      </span>
                    ) : p.isLowStock ? (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 rounded border border-amber-200">
                        Bajo ({p.stock} un.)
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-100">
                        Óptimo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper Controls */}
              <div className="flex items-center space-x-1.5 flex-shrink-0">
                <button
                  onClick={() => onAdjustStock(p.id, -1)}
                  disabled={p.stock <= 0}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Restar 1 unidad"
                >
                  <i className="fa-solid fa-minus text-[10px]"></i>
                </button>
                <span
                  className={`w-8 text-center font-mono font-black text-xs ${
                    p.isOutOfStock
                      ? 'text-rose-600'
                      : p.isLowStock
                      ? 'text-amber-600'
                      : 'text-slate-800'
                  }`}
                >
                  {p.stock}
                </span>
                <button
                  onClick={() => onAdjustStock(p.id, 1)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center transition"
                  title="Sumar 1 unidad"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inventory Summary Footer */}
      <div className="pt-4 border-t border-slate-100 mt-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Catálogo activo:</span>
          <span className="font-bold text-slate-800">{products.length} productos</span>
        </div>
      </div>
    </div>
  );
};
