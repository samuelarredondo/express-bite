import React from 'react';
import { ProductDTO } from '../../../core/application/dtos';

interface PaymentRejectedScreenProps {
  product: ProductDTO;
  currentBalance: number;
  missingAmount: number;
  onRetryWithWebpay: () => void;
  onReloadBalanceAndRetry: () => void;
  onCancel: () => void;
}

export const PaymentRejectedScreen: React.FC<PaymentRejectedScreenProps> = ({
  product,
  currentBalance,
  missingAmount,
  onRetryWithWebpay,
  onReloadBalanceAndRetry,
  onCancel
}) => {
  return (
    <div className="p-6 flex flex-col items-center text-center space-y-4">
      {/* Failure Shake Icon */}
      <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl shadow-inner border border-rose-200 animate-shake">
        <i className="fa-solid fa-circle-xmark"></i>
      </div>

      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
          <i className="fa-solid fa-triangle-exclamation text-rose-600"></i>
          <span>Transacción Denegada</span>
        </div>
        <h4 className="text-lg font-black text-slate-900 mt-1">
          Pago Rechazado - Saldo Insuficiente
        </h4>
        <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
          Tu Tarjeta JUNAEB (Beca de Alimentación) no cuenta con saldo suficiente para completar esta compra de{' '}
          <strong className="font-mono text-slate-900">{product.formattedPrice} CLP</strong>.
        </p>
      </div>

      {/* Technical Breakdown of Banking Rejection */}
      <div className="w-full bg-rose-50/70 rounded-2xl p-4 border border-rose-200 text-left font-sans space-y-2 relative overflow-hidden">
        <div className="absolute right-2 -bottom-2 opacity-5 text-rose-900 text-7xl font-mono pointer-events-none">
          <i className="fa-solid fa-ban"></i>
        </div>

        <div className="flex justify-between items-center pb-2 border-b border-rose-200/80 text-xs">
          <span className="text-slate-500 font-medium">Estado del Subsidio:</span>
          <span className="font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-[11px] border border-rose-200">
            ERR-JUNAEB-51
          </span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Monto del Pedido:</span>
          <span className="font-mono font-bold text-slate-800">{product.formattedPrice} CLP</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Saldo Disponible en Tarjeta:</span>
          <span className="font-mono font-extrabold text-rose-600">
            ${currentBalance.toLocaleString('es-CL')} CLP
          </span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Monto Faltante:</span>
          <span className="font-mono font-extrabold text-amber-600">
            -${missingAmount.toLocaleString('es-CL')} CLP
          </span>
        </div>

        <div className="pt-2 border-t border-rose-200/80 flex justify-between text-[11px] text-slate-500">
          <span>Comercio:</span>
          <span className="font-semibold text-slate-700">Quick-Bite • Campus Central</span>
        </div>
      </div>

      {/* Assurance Notice */}
      <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-left flex items-start space-x-2.5">
        <i className="fa-solid fa-circle-info text-amber-600 text-xs mt-0.5 flex-shrink-0"></i>
        <p className="text-[11px] text-amber-900 leading-relaxed">
          <strong>No te preocupes:</strong> Tu producto sigue reservado y no se ha descontado de cocina ni de inventario. Puedes reintentar directamente con Webpay Plus o abonar saldo.
        </p>
      </div>

      {/* Immediate Recovery Actions */}
      <div className="w-full pt-1 flex flex-col space-y-2">
        <button
          onClick={onRetryWithWebpay}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-xs transition shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5"
        >
          <i className="fa-solid fa-credit-card"></i>
          <span>Reintentar con Webpay Plus</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onReloadBalanceAndRetry}
            className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition border border-slate-200 flex items-center justify-center space-x-1"
          >
            <i className="fa-solid fa-rotate-right text-emerald-600"></i>
            <span>Recargar $34.500</span>
          </button>
          <button
            onClick={onCancel}
            className="py-2.5 bg-white hover:bg-rose-50 text-rose-600 rounded-xl font-bold text-xs transition border border-rose-200 flex items-center justify-center space-x-1"
          >
            <i className="fa-solid fa-xmark"></i>
            <span>Cancelar pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
};
