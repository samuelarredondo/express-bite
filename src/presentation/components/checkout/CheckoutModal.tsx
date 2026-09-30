import React, { useState, useEffect } from 'react';
import { ProductDTO, OrderDTO } from '../../../core/application/dtos';
import { PaymentMethodType } from '../../../core/domain/types';
import { useStudentWallet } from '../../hooks/useStudentWallet';
import { useOrders } from '../../hooks/useOrders';
import { useServices } from '../../di/ServiceContainer';
import { VoucherReceipt } from './VoucherReceipt';
import { PaymentRejectedScreen } from './PaymentRejectedScreen';

interface CheckoutModalProps {
  product: ProductDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

type ModalStep = 'details' | 'processing' | 'success' | 'failed';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  isOpen,
  onClose,
  onTrackOrder
}) => {
  const { junaebBalance, setBalanceDirectly } = useStudentWallet();
  const { createOrder } = useOrders();
  const { notificationService } = useServices();

  const [step, setStep] = useState<ModalStep>('details');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('Webpay');
  const [pin, setPin] = useState<string>('8492');
  const [processingProgress, setProcessingProgress] = useState<number>(20);
  const [createdOrder, setCreatedOrder] = useState<OrderDTO | null>(null);
  const [rejectedInfo, setRejectedInfo] = useState<{ missingAmount: number } | null>(null);
  const [isRecovered, setIsRecovered] = useState<boolean>(false);

  // Initialize modal state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setProcessingProgress(20);
      setCreatedOrder(null);
      setRejectedInfo(null);
      setIsRecovered(false);
      // Preselect JUNAEB if enough balance, otherwise Webpay
      if (product && junaebBalance >= product.price) {
        setSelectedMethod('junaeb' as unknown as PaymentMethodType === 'JUNAEB' ? 'JUNAEB' : 'Webpay');
      } else {
        setSelectedMethod('Webpay');
      }
    }
  }, [isOpen, product, junaebBalance]);

  if (!isOpen || !product) return null;

  const hasEnoughJunaeb = junaebBalance >= product.price;

  const handleRandomizePin = () => {
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(random);
  };

  const executePayment = async (overrideMethod?: PaymentMethodType) => {
    const methodToUse = overrideMethod || selectedMethod;

    // Transition to processing step
    setStep('processing');
    setProcessingProgress(30);

    setTimeout(() => {
      setProcessingProgress(70);
    }, 400);

    setTimeout(async () => {
      setProcessingProgress(100);

      // Execute through Clean Architecture Use Case!
      const result = await createOrder({
        productId: product.id,
        quantity: 1,
        studentName: 'Tú (Estudiante)',
        paymentMethod: methodToUse,
        paymentPin: pin,
        isCurrentStudent: true
      });

      if (!result.success) {
        setRejectedInfo({
          missingAmount: result.missingAmount ?? (product.price - junaebBalance)
        });
        setStep('failed');
      } else if (result.order) {
        setCreatedOrder(result.order);
        setStep('success');
      }
    }, 900);
  };

  // Recovery flow: Student switches to Webpay after rejection
  const handleRecoverWithWebpay = () => {
    setIsRecovered(true);
    setSelectedMethod('Webpay');
    executePayment('Webpay');
  };

  // Recovery flow: Student recharges balance to $34.500 and re-attempts
  const handleReloadBalance = () => {
    setBalanceDirectly(34500);
    setStep('details');
    setSelectedMethod('JUNAEB');
    notificationService.notify(
      'Saldo Restaurado',
      'Beca JUNAEB recargada a $34.500 CLP. ¡Puedes proceder al cobro!',
      'emerald'
    );
  };

  const handleFinishAndTrack = () => {
    if (createdOrder) {
      onTrackOrder(createdOrder.id);
    }
    onClose();
  };

  const handleDownloadProof = () => {
    notificationService.notify(
      'Comprobante Descargado',
      `Voucher PDF oficial ${createdOrder?.paymentAuthCode || '#TBK-884920'} guardado con éxito.`,
      'blue'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-300 relative my-6">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4.5 px-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm">
              <i className="fa-solid fa-credit-card"></i>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white leading-tight">
                Checkout Express Universitario
              </h3>
              <p className="text-[11px] text-slate-400">Campus Central • Despacho Inmediato</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            title="Cerrar ventana"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* STEP 1: DETALLES Y SELECCIÓN DE PAGO */}
        {step === 'details' && (
          <div className="p-5 space-y-4">
            {/* Resumen del Producto Seleccionado */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${product.colorGradient} text-white flex items-center justify-center text-lg flex-shrink-0 shadow-2xs`}
                >
                  <i className={`fa-solid ${product.icon}`}></i>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.5 rounded">
                      #Orden
                    </span>
                    <span className="text-[10px] text-slate-500">• 1 unidad</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 truncate">{product.name}</h4>
                  <p className="text-xs text-slate-500">Retiro en Counter #2</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-slate-400">Total</div>
                <div className="text-base font-extrabold text-blue-900 font-mono">
                  {product.formattedPrice}
                </div>
              </div>
            </div>

            {/* Selector de Métodos de Pago Chilenos */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Selecciona Método de Pago
              </label>

              <div className="space-y-2">
                {/* 1. Beca JUNAEB */}
                <div
                  onClick={() => setSelectedMethod('JUNAEB')}
                  className={`rounded-2xl p-3 cursor-pointer transition flex items-center justify-between border-2 ${
                    selectedMethod === 'JUNAEB'
                      ? 'border-blue-600 bg-blue-50/60'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                      J
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-slate-900">
                          Beca de Alimentación JUNAEB
                        </span>
                        <span className="text-[9px] uppercase font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300">
                          Sodexo / Edenred
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Saldo actual disponible:{' '}
                        <strong
                          className={`font-mono font-bold ${
                            hasEnoughJunaeb ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          ${junaebBalance.toLocaleString('es-CL')} CLP
                        </strong>
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'JUNAEB' ? 'border-blue-600' : 'border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        selectedMethod === 'JUNAEB' ? 'bg-blue-600' : 'bg-transparent'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* 2. Webpay Plus Transbank */}
                <div
                  onClick={() => setSelectedMethod('Webpay')}
                  className={`rounded-2xl p-3 cursor-pointer transition flex items-center justify-between border-2 ${
                    selectedMethod === 'Webpay'
                      ? 'border-blue-600 bg-blue-50/60'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white flex items-center justify-center text-sm shadow-xs font-bold">
                      <i className="fa-solid fa-wallet"></i>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-slate-900">
                          Webpay Plus Transbank
                        </span>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          Débito / Redcompra
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Tarjetas bancarias chilenas sin comisión
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'Webpay' ? 'border-blue-600' : 'border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        selectedMethod === 'Webpay' ? 'bg-blue-600' : 'bg-transparent'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* 3. Pago en Caja */}
                <div
                  onClick={() => setSelectedMethod('Caja')}
                  className={`rounded-2xl p-3 cursor-pointer transition flex items-center justify-between border-2 ${
                    selectedMethod === 'Caja'
                      ? 'border-blue-600 bg-blue-50/60'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center text-sm shadow-xs">
                      <i className="fa-solid fa-coins"></i>
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-slate-900">
                        Pago en Caja (Al Retirar)
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Efectivo o POS directo en mesón #2
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'Caja' ? 'border-blue-600' : 'border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        selectedMethod === 'Caja' ? 'bg-blue-600' : 'bg-transparent'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-panel condicional de parámetros según método */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              {selectedMethod === 'JUNAEB' ? (
                <div className="space-y-3">
                  {/* Balance Sandbox Controller */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between text-[11px] mb-2 font-bold text-slate-700">
                      <span className="flex items-center text-blue-700">
                        <i className="fa-solid fa-sliders mr-1.5"></i>Simulador de Saldo BAE
                      </span>
                      <span
                        className={`font-mono text-xs ${
                          hasEnoughJunaeb ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {hasEnoughJunaeb ? 'Saldo Aprobable' : 'Saldo Insuficiente'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setBalanceDirectly(34500)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 border ${
                          hasEnoughJunaeb
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <i className="fa-solid fa-circle-check text-emerald-600 text-[10px]"></i>
                        <span>Normal ($34.500)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBalanceDirectly(500)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 border ${
                          !hasEnoughJunaeb
                            ? 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-500/20'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <i className="fa-solid fa-triangle-exclamation text-rose-600 text-[10px]"></i>
                        <span>Insuficiente ($500)</span>
                      </button>
                    </div>
                  </div>

                  {!hasEnoughJunaeb && (
                    <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-start space-x-2">
                      <i className="fa-solid fa-circle-exclamation text-rose-600 text-xs mt-0.5 flex-shrink-0"></i>
                      <div className="text-[11px] text-rose-800 leading-tight">
                        <span className="font-extrabold block">
                          Alerta: Saldo Menor al Total del Pedido
                        </span>
                        Tu tarjeta tiene{' '}
                        <strong className="font-mono">${junaebBalance.toLocaleString('es-CL')}</strong> y
                        el pedido cuesta{' '}
                        <strong className="font-mono">{product.formattedPrice}</strong>. Al pulsar abajo
                        podrás verificar el <strong>rechazo oficial emitido por el procesador BAE</strong>.
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600">
                        <i className="fa-solid fa-fingerprint mr-1 text-emerald-600"></i>
                        Clave Dinámica o PIN JUNAEB:
                      </span>
                      <span className="text-emerald-700 font-bold">App Sodexo / Edenred</span>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="password"
                        maxLength={4}
                        value={pin}
                        onChange={e => setPin(e.target.value)}
                        className="w-full text-center font-mono font-bold tracking-widest text-slate-800 bg-white border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        placeholder="••••"
                      />
                      <button
                        type="button"
                        onClick={handleRandomizePin}
                        className="px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[10px] font-bold"
                      >
                        Auto
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedMethod === 'Webpay' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">
                      <i className="fa-solid fa-credit-card mr-1 text-blue-600"></i>
                      Tarjeta Asociada Simulada:
                    </span>
                    <span className="text-slate-500 font-mono">Redcompra Débito •••• 4291</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-8 h-5 rounded bg-red-600 text-white font-black text-[9px] flex items-center justify-center">
                        TBK
                      </span>
                      <div>
                        <span className="font-bold text-slate-800 text-xs block leading-tight">
                          Banco Estado / Santander
                        </span>
                        <span className="text-[10px] text-slate-500">Transbank Webpay Plus Débito</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded flex items-center">
                      <i className="fa-solid fa-circle-check text-[9px] mr-1"></i>Habilitada
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-600 space-y-1">
                  <p>
                    <i className="fa-solid fa-hand-holding-dollar text-amber-500 mr-1"></i>
                    Pagarás <strong>{product.formattedPrice} CLP</strong> en el mesón al momento de retirar
                    con efectivo o tarjeta física.
                  </p>
                  <p className="text-slate-400">Tu orden comenzará a prepararse de inmediato.</p>
                </div>
              )}
            </div>

            {/* Desglose de Pago */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal producto</span>
                <span className="font-mono text-slate-800">{product.formattedPrice} CLP</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Comisión de servicio</span>
                <span>$0 CLP (Gratis Campus)</span>
              </div>
              <div className="flex justify-between items-baseline pt-1 border-t border-dashed border-slate-200 text-slate-900">
                <span className="font-bold">Total a Transferir</span>
                <span className="text-lg font-black text-blue-900 font-mono">
                  {product.formattedPrice} CLP
                </span>
              </div>
            </div>

            {/* Botón de acción principal */}
            <button
              onClick={() => executePayment()}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2 active:scale-98 ${
                selectedMethod === 'JUNAEB' && !hasEnoughJunaeb
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
              }`}
            >
              <i className="fa-solid fa-lock text-xs"></i>
              <span>
                {selectedMethod === 'JUNAEB'
                  ? hasEnoughJunaeb
                    ? 'Confirmar y Pagar con JUNAEB'
                    : 'Probar Pago JUNAEB (Ver Rechazo)'
                  : selectedMethod === 'Webpay'
                  ? 'Pagar vía Webpay Transbank'
                  : 'Confirmar Orden y Pagar en Caja'}
              </span>
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Transacción cifrada SSL 256-bit • Quick-Bite University Pay
            </p>
          </div>
        )}

        {/* STEP 2: SIMULACIÓN DE PROCESAMIENTO */}
        {step === 'processing' && (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[360px]">
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-blue-600 text-xl">
                <i
                  className={
                    selectedMethod === 'JUNAEB'
                      ? 'fa-solid fa-id-card'
                      : selectedMethod === 'Webpay'
                      ? 'fa-solid fa-shield-halved'
                      : 'fa-solid fa-receipt'
                  }
                ></i>
              </div>
            </div>

            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                {selectedMethod === 'JUNAEB'
                  ? 'Conectando con Servidor JUNAEB / Edenred...'
                  : selectedMethod === 'Webpay'
                  ? 'Conectando con Transbank Webpay...'
                  : 'Registrando Pedido en Mostrador...'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {selectedMethod === 'JUNAEB'
                  ? 'Verificando clave dinámica y comprobando saldo disponible en subsidio alimentario...'
                  : selectedMethod === 'Webpay'
                  ? 'Autorizando transacción segura con el banco emisor...'
                  : 'Enviando comanda a pantalla de preparación de cafetería...'}
              </p>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden max-w-xs">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Por favor no cierres esta ventana</span>
          </div>
        )}

        {/* STEP 3: VOUCHER DIGITAL EXITOSO */}
        {step === 'success' && createdOrder && (
          <VoucherReceipt
            order={createdOrder}
            isRecoveredFromFailedJunaeb={isRecovered}
            onFinishAndTrack={handleFinishAndTrack}
            onDownloadProof={handleDownloadProof}
            onSimulateFailedAgain={() => setStep('failed')}
          />
        )}

        {/* STEP 4: OFICIAL PANTALLA DE RECHAZO POR SALDO INSUFICIENTE JUNAEB */}
        {step === 'failed' && (
          <PaymentRejectedScreen
            product={product}
            currentBalance={junaebBalance}
            missingAmount={rejectedInfo?.missingAmount ?? (product.price - junaebBalance)}
            onRetryWithWebpay={handleRecoverWithWebpay}
            onReloadBalanceAndRetry={handleReloadBalance}
            onCancel={onClose}
          />
        )}

      </div>
    </div>
  );
};
