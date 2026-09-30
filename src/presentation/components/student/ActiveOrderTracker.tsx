import React from 'react';
import { OrderDTO } from '../../../core/application/dtos';

interface ActiveOrderTrackerProps {
  order: OrderDTO | null;
  onDismiss: () => void;
}

export const ActiveOrderTracker: React.FC<ActiveOrderTrackerProps> = ({ order, onDismiss }) => {
  if (!order) return null;

  const isReady = order.status === 'listo';
  const isDelivered = order.status === 'entregado';

  const paymentBadge =
    order.paymentMethod === 'JUNAEB' ? (
      <span className="bg-emerald-800/80 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center">
        <i className="fa-solid fa-id-card mr-1 text-[9px]"></i>Beca JUNAEB
      </span>
    ) : order.paymentMethod === 'Webpay' ? (
      <span className="bg-emerald-700 text-emerald-100 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/40 shadow-xs flex items-center">
        <i className="fa-solid fa-shield-check mr-1 text-[10px]"></i>Webpay Plus
      </span>
    ) : (
      <span className="bg-slate-700 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
        <i className="fa-solid fa-coins mr-1 text-[9px]"></i>Paga en Caja
      </span>
    );

  if (isDelivered) {
    return (
      <div className="p-4 mx-4 mt-3 bg-blue-50 border border-blue-200 rounded-2xl shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg shadow-sm">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                ¡Pedido Entregado!
              </span>
              <p className="text-xs text-blue-700">Esperamos que disfrutes tu comida en Quick-Bite.</p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-xs text-slate-400 hover:text-slate-600 p-1"
            title="Cerrar ticket"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
      </div>
    );
  }

  if (isReady) {
    return (
      <div className="p-4 mx-4 mt-3 bg-emerald-500 text-white rounded-2xl shadow-lg glow-green transition-all transform animate-bounce-short">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-white text-emerald-600 flex items-center justify-center text-xl shadow">
              <i className="fa-solid fa-bell animate-wiggle"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-1">
                <span className="text-xs uppercase tracking-wider font-black bg-emerald-700/60 px-2 py-0.5 rounded-full">
                  ¡Tu turno ha llegado!
                </span>
                <span className="font-mono text-xs font-bold bg-white/20 px-1.5 py-0.5 rounded">
                  {order.id}
                </span>
              </div>
              <h4 className="text-lg font-black mt-0.5">¡LISTO PARA RECOGER!</h4>
              <p className="text-xs text-emerald-100">
                Dirígete inmediatamente al Counter #2 para retirar.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2.5 pt-2.5 border-t border-emerald-400/40 flex items-center justify-between text-xs text-emerald-100 font-medium">
          <div className="flex items-center space-x-2">
            <span>{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
            {paymentBadge}
          </div>
          <span className="font-bold text-white font-mono">{order.formattedTotal}</span>
        </div>
      </div>
    );
  }

  // Status: En Preparación
  return (
    <div className="p-4 mx-4 mt-3 bg-amber-50 border-2 border-amber-300 rounded-2xl shadow-sm transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-sm pulse-amber">
            <i className="fa-solid fa-fire-burner"></i>
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                En Preparación
              </span>
              <span className="font-mono text-xs font-bold text-slate-800">{order.id}</span>
              {paymentBadge}
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
              El personal está armando tu pedido
            </h4>
            <p className="text-xs text-slate-600">
              Te avisaremos con pantalla verde apenas esté listo en el mesón.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-amber-200/70 flex items-center justify-between text-xs text-slate-700 font-medium">
        <span className="truncate pr-2">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
        <span className="font-bold text-slate-900 flex-shrink-0 font-mono">
          {order.formattedTotal}
        </span>
      </div>
    </div>
  );
};
