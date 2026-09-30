import React, { useState, useEffect } from 'react';

interface VirtualQueueWidgetProps {
  pendingCount: number;
}

export const VirtualQueueWidget: React.FC<VirtualQueueWidgetProps> = ({ pendingCount }) => {
  const [liveClock, setLiveClock] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveClock(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Estimation: approx 2 minutes per pending ticket in queue
  const estWaitMin = Math.max(2, pendingCount * 2);

  return (
    <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-b-2xl shadow-lg relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center p-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-semibold">
            <i className="fa-solid fa-bolt mr-1 text-amber-400"></i> Exprés
          </span>
          <span className="text-xs text-slate-300 font-medium">Sin filas ni esperas</span>
        </div>
        <span className="text-xs text-slate-300 font-mono font-bold tracking-wider">
          {liveClock || '10:42 AM'}
        </span>
      </div>

      {/* Virtual Queue Metric Box */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <i className="fa-solid fa-people-line text-lg"></i>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">
              Fila Virtual en Cafetería
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-white">{pendingCount}</span>
              <span className="text-xs text-slate-200 font-medium">pedidos en espera</span>
            </div>
          </div>
        </div>
        <div className="text-right pl-2 border-l border-white/10">
          <div className="text-[10px] uppercase text-slate-300 font-bold">Espera est.</div>
          <div className="text-base font-extrabold text-amber-300 font-mono">
            ~{estWaitMin} min
          </div>
        </div>
      </div>
    </div>
  );
};
