import React from 'react';
import { OrderDTO } from '../../../core/application/dtos';

interface KanbanDispatchBoardProps {
  prepOrders: OrderDTO[];
  readyOrders: OrderDTO[];
  onMarkReady: (orderId: string) => void;
  onRevertToPrep: (orderId: string) => void;
  onDeliver: (orderId: string) => void;
  onSimulateIncoming: () => void;
}

export const KanbanDispatchBoard: React.FC<KanbanDispatchBoardProps> = ({
  prepOrders,
  readyOrders,
  onMarkReady,
  onRevertToPrep,
  onDeliver,
  onSimulateIncoming
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center">
            <i className="fa-solid fa-clipboard-list mr-2.5 text-blue-600"></i>
            Tablero de Despacho Operativo
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Control de órdenes entrantes con validación de pago JUNAEB/Webpay.
          </p>
        </div>

        {/* Action to simulate incoming order */}
        <button
          onClick={onSimulateIncoming}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition border border-slate-300 self-start sm:self-auto"
        >
          <i className="fa-solid fa-plus text-blue-600"></i>
          <span>Simular Pedido Entrante</span>
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 flex-1">
        {/* ========================================= */}
        {/* Column 1: En Preparación                  */}
        {/* ========================================= */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-amber-200/80 flex flex-col min-h-[460px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-200">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 pulse-amber"></span>
              <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                En Preparación
              </h4>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 font-mono">
              {prepOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[540px] pr-1">
            {prepOrders.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                <i className="fa-solid fa-mug-saucer text-2xl mb-1.5 text-slate-300"></i>
                <span>Sin pedidos en cola de cocina</span>
              </div>
            ) : (
              prepOrders.map(order => {
                const isTbkRescued = order.id === 'QB-104';
                const payBadge =
                  order.paymentMethod === 'JUNAEB' ? (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center">
                      <i className="fa-solid fa-id-card mr-1 text-[9px]"></i>JUNAEB
                    </span>
                  ) : order.paymentMethod === 'Webpay' ? (
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center shadow-2xs">
                      <i className="fa-solid fa-circle-check text-emerald-600 mr-1 text-[10px]"></i>
                      Webpay Plus
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 flex items-center">
                      <i className="fa-solid fa-coins mr-1 text-[9px]"></i>Caja
                    </span>
                  );

                return (
                  <div
                    key={order.id}
                    className={`p-4 rounded-xl border transition relative ${
                      isTbkRescued
                        ? 'bg-emerald-50/40 border-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 shadow-xs hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-black bg-slate-900 text-white px-2 py-0.5 rounded">
                          {order.id}
                        </span>
                        {payBadge}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        <i className="fa-regular fa-clock mr-1"></i>
                        {order.createdAt}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm mb-1 flex items-center justify-between">
                      <span className="truncate pr-2">{order.studentName}</span>
                      <span className="text-xs text-blue-800 font-extrabold font-mono flex-shrink-0">
                        {order.formattedTotal}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 mb-2 font-mono flex items-center justify-between">
                      <span>{order.paymentAuthCode || 'TBK-APROBADO'}</span>
                      <span className="text-emerald-700 font-bold flex items-center">
                        <i className="fa-solid fa-circle-check mr-1"></i>Cobro Confirmado
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 bg-white/95 p-2 rounded-lg border border-slate-200 mb-3 space-y-1">
                      {order.items.map(item => (
                        <div key={item.productId} className="flex justify-between items-center">
                          <span className="font-semibold text-slate-800">• {item.name}</span>
                          <span className="text-xs font-bold text-slate-500">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => onMarkReady(order.id)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <i className="fa-solid fa-check"></i>
                      <span>Marcar como "¡Listo!"</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================= */}
        {/* Column 2: Listo para Recoger              */}
        {/* ========================================= */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-emerald-200/80 flex flex-col min-h-[460px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-200">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                ¡Listo para Retirar!
              </h4>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[540px] pr-1">
            {readyOrders.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                <i className="fa-solid fa-bell-slash text-2xl mb-1.5 text-slate-300"></i>
                <span>Sin pedidos esperando retiro</span>
              </div>
            ) : (
              readyOrders.map(order => {
                const payBadge =
                  order.paymentMethod === 'JUNAEB' ? (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      JUNAEB
                    </span>
                  ) : order.paymentMethod === 'Webpay' ? (
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                      Webpay
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      Caja
                    </span>
                  );

                return (
                  <div
                    key={order.id}
                    className="bg-white p-4 rounded-xl border-2 border-emerald-300 shadow-md relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-black bg-emerald-600 text-white px-2 py-0.5 rounded shadow-xs">
                          {order.id}
                        </span>
                        {payBadge}
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center">
                        <i className="fa-solid fa-bell mr-1 animate-wiggle text-[9px]"></i>
                        Esperando al alumno
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm mb-1.5 flex items-center justify-between">
                      <span className="truncate pr-2">{order.studentName}</span>
                      <span className="text-xs text-slate-700 font-bold font-mono flex-shrink-0">
                        {order.formattedTotal}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3 space-y-1">
                      {order.items.map(item => (
                        <div key={item.productId} className="flex justify-between items-center">
                          <span className="font-medium text-slate-800">• {item.name}</span>
                          <span className="text-xs font-bold text-slate-500">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onRevertToPrep(order.id)}
                        title="Regresar a preparación si falta algún complemento"
                        className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1"
                      >
                        <i className="fa-solid fa-rotate-left mr-1"></i>
                        <span>Devolver</span>
                      </button>
                      <button
                        onClick={() => onDeliver(order.id)}
                        className="py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 shadow-sm"
                      >
                        <i className="fa-solid fa-hand-holding-dollar"></i>
                        <span>Entregado</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
