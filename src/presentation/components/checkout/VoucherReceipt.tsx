import React from 'react';
import { OrderDTO } from '../../../core/application/dtos';

interface VoucherReceiptProps {
  order: OrderDTO;
  isRecoveredFromFailedJunaeb?: boolean;
  onFinishAndTrack: () => void;
  onDownloadProof: () => void;
  onSimulateFailedAgain: () => void;
}

export const VoucherReceipt: React.FC<VoucherReceiptProps> = ({
  order,
  isRecoveredFromFailedJunaeb,
  onFinishAndTrack,
  onDownloadProof,
  onSimulateFailedAgain
}) => {
  const isWebpay = order.paymentMethod === 'Webpay';
  const isJunaeb = order.paymentMethod === 'JUNAEB';

  return (
    <div className="p-6 flex flex-col items-center text-center space-y-3.5">
      {/* Banner Superior de Rescate si vino de un rechazo previo */}
      {isRecoveredFromFailedJunaeb && (
        <div className="w-full bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300 rounded-2xl p-2.5 text-left flex items-center space-x-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-sm flex-shrink-0 shadow-xs">
            <i className="fa-solid fa-shield-check"></i>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-emerald-600 text-white">
                Rescate Exitoso
              </span>
              <span className="text-[10px] text-slate-500 font-semibold truncate">
                Reintento completado
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-800 leading-tight mt-0.5">
              Recuperado con éxito tras rechazo JUNAEB{' '}
              <span className="text-rose-600 font-medium">
                (Saldo insuficiente $500 vs {order.formattedTotal} requeridos)
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Checkmark Icon Animado */}
      <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center text-2xl shadow-inner animate-bounce">
        <i className="fa-solid fa-check"></i>
      </div>

      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
          <i className="fa-solid fa-circle-check text-emerald-600"></i>
          <span>{isWebpay ? 'Transbank Aprobado' : isJunaeb ? 'JUNAEB BAE Aprobado' : 'Registrado en Caja'}</span>
        </div>
        <h4 className="text-lg font-black text-slate-900 mt-1">
          {isWebpay
            ? '¡Pago Aprobado con Webpay Plus!'
            : isJunaeb
            ? '¡Pago Aprobado con Beca JUNAEB!'
            : '¡Comanda Registrada en Caja!'}
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Tu orden ha sido enviada directo a la cocina del casino.
        </p>
      </div>

      {/* Voucher Digital Oficial */}
      <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left font-sans space-y-2.5 relative overflow-hidden shadow-2xs">
        <div className="absolute right-2 -bottom-2 opacity-5 text-slate-900 text-7xl font-mono pointer-events-none">
          <i className="fa-solid fa-receipt"></i>
        </div>

        {/* Header Voucher */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Nº Pedido de Retiro:</span>
            <div className="font-mono font-black text-blue-900 text-sm flex items-center space-x-1">
              <span>{order.id}</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-sans ml-1">
                En preparación
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Comercio Adherido</span>
            <span className="text-[11px] font-bold text-slate-700">Quick-Bite Campus Central</span>
          </div>
        </div>

        {/* Detalle del Producto */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm shadow-2xs">
              <i className="fa-solid fa-bread-slice"></i>
            </div>
            <div>
              <span className="font-bold text-slate-900 block truncate max-w-[190px]">
                {order.items[0]?.name || 'Producto Universitario'}
              </span>
              <span className="text-[10px] text-slate-500">
                {order.items[0]?.quantity || 1}x Unidad • Casino Central
              </span>
            </div>
          </div>
          <span className="font-black text-slate-900 font-mono text-xs">
            {order.formattedTotal}
          </span>
        </div>

        {/* Filas de Información Bancaria */}
        <div className="space-y-1.5 text-xs pt-0.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 flex items-center">
              <i className="fa-solid fa-credit-card mr-1.5 text-red-500"></i>
              Medio de Pago:
            </span>
            <span className="font-bold text-slate-800 flex items-center space-x-1">
              {isWebpay ? (
                <>
                  <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.2 rounded font-black">
                    WEBPAY PLUS
                  </span>
                  <span>Débito Redcompra</span>
                </>
              ) : isJunaeb ? (
                <>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-black">
                    JUNAEB BAE
                  </span>
                  <span>Sodexo / Edenred</span>
                </>
              ) : (
                <span>Pago Presencial en Caja</span>
              )}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Tarjeta Asociada:</span>
            <span className="font-mono text-slate-700 font-semibold">
              {isWebpay
                ? '•••• 4291 (Banco Estado / Santander)'
                : isJunaeb
                ? 'TNE / Tarjeta JUNAEB Universitaria'
                : 'Mesón Counter #2'}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Cód. Autorización:</span>
            <span className="font-mono text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              {order.paymentAuthCode || '#TBK-884920'}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Fecha y Hora de Transacción:</span>
            <span className="font-mono text-slate-700 font-medium">
              Hoy • {order.createdAt}
            </span>
          </div>
        </div>

        {/* Alerta de Retiro */}
        <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
          <span className="text-slate-500 flex items-center">
            <i className="fa-solid fa-location-dot mr-1 text-blue-600"></i>
            Lugar de Retiro:
          </span>
          <span className="font-extrabold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Counter #2 (Tiempo est. ~5-7 min)
          </span>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="w-full pt-1 flex flex-col space-y-2">
        <button
          onClick={onFinishAndTrack}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-xs transition shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2"
        >
          <i className="fa-solid fa-clock-rotate-left"></i>
          <span>Ver Seguimiento de Pedido</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onDownloadProof}
            className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition border border-slate-200 flex items-center justify-center space-x-1"
          >
            <i className="fa-solid fa-file-arrow-down text-slate-500"></i>
            <span>Descargar Comprobante</span>
          </button>
          <button
            onClick={onSimulateFailedAgain}
            className="py-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs transition border border-slate-200 flex items-center justify-center space-x-1"
            title="Simular visualmente el caso de rechazo"
          >
            <i className="fa-solid fa-rotate-left text-amber-500"></i>
            <span>Simular Rechazo JUNAEB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
