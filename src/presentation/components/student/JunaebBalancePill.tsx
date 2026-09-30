import React from 'react';
import { useStudentWallet } from '../../hooks/useStudentWallet';

export const JunaebBalancePill: React.FC = () => {
  const { junaebBalance, isLowBalance, toggleSimulation } = useStudentWallet();

  return (
    <div className="mt-3 bg-white/10 hover:bg-white/15 transition rounded-xl px-3 py-2 flex items-center justify-between text-xs border border-white/10">
      <div className="flex items-center space-x-2">
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
            isLowBalance
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-emerald-400 text-slate-950'
          }`}
        >
          J
        </span>
        <span className="text-slate-200 text-[11px] font-medium">Saldo Beca JUNAEB</span>
      </div>

      <div className="flex items-center space-x-2">
        <span
          className={`font-extrabold font-mono text-xs transition-colors ${
            isLowBalance ? 'text-rose-300 animate-pulse' : 'text-emerald-300'
          }`}
        >
          ${junaebBalance.toLocaleString('es-CL')} CLP
        </span>

        <button
          onClick={toggleSimulation}
          className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition flex items-center space-x-1"
          title="Alternar simulación de saldo para probar rechazo por fondos insuficientes"
        >
          <i className="fa-solid fa-flask text-amber-300 text-[9px]"></i>
          <span>{isLowBalance ? 'Restaurar $34.500' : 'Simular $500'}</span>
        </button>
      </div>
    </div>
  );
};
