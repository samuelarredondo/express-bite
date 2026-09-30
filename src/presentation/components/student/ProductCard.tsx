import React from 'react';
import { ProductDTO } from '../../../core/application/dtos';

interface ProductCardProps {
  product: ProductDTO;
  onOrderClick: (product: ProductDTO) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOrderClick }) => {
  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
        product.isOutOfStock
          ? 'bg-slate-50/80 border-slate-200 opacity-60'
          : 'bg-white border-slate-200/90 hover:border-blue-400 shadow-xs hover:shadow-sm'
      }`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0 pr-3">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${product.colorGradient} text-white flex items-center justify-center text-lg flex-shrink-0 shadow-xs`}
        >
          <i className={`fa-solid ${product.icon}`}></i>
        </div>

        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-sm text-slate-900 truncate">{product.name}</h3>
          </div>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{product.description}</p>

          <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-1">
            <span className="text-sm font-extrabold text-blue-900 font-mono">
              {product.formattedPrice}
            </span>

            {product.isOutOfStock ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                <i className="fa-solid fa-ban mr-1 text-[9px]"></i> Agotado
              </span>
            ) : product.isLowStock ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                ¡Solo {product.stock} disponibles!
              </span>
            ) : (
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                Disponibles: {product.stock}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <button
          onClick={() => onOrderClick(product)}
          disabled={product.isOutOfStock}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            product.isOutOfStock
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md shadow-blue-600/20'
          }`}
        >
          <i className={`fa-solid ${product.isOutOfStock ? 'fa-lock' : 'fa-plus'}`}></i>
          <span>{product.isOutOfStock ? 'Sin Stock' : 'Pedir'}</span>
        </button>
      </div>
    </div>
  );
};
