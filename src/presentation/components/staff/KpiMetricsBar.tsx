import React from 'react';

interface KpiMetricsBarProps {
  prepCount: number;
  readyCount: number;
  deliveredCount: number;
  criticalCount: number;
}

export const KpiMetricsBar: React.FC<KpiMetricsBarProps> = ({
  prepCount,
  readyCount,
  deliveredCount,
  criticalCount
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* 1. En Preparación */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            En Preparación
          </span>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">{prepCount}</div>
          <span className="text-xs text-slate-500 mt-0.5 block">Cocina activa</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
          <i className="fa-solid fa-fire-burner"></i>
        </div>
      </div>

      {/* 2. Listos para Retiro */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Listos para Retiro
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">{readyCount}</div>
          <span className="text-xs text-slate-500 mt-0.5 block">En mostrador #2</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
          <i className="fa-solid fa-bell-concierge"></i>
        </div>
      </div>

      {/* 3. Entregados Hoy */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Entregados Hoy
          </span>
          <div className="text-3xl font-extrabold text-blue-700 mt-1">{deliveredCount}</div>
          <span className="text-xs text-slate-500 mt-0.5 block">Flujo continuo</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl">
          <i className="fa-solid fa-circle-check"></i>
        </div>
      </div>

      {/* 4. Artículos Críticos */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Artículos Críticos
          </span>
          <div className="text-3xl font-extrabold text-rose-600 mt-1">{criticalCount}</div>
          <span className="text-xs text-slate-500 mt-0.5 block">Stock ≤ 3 un.</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
      </div>
    </div>
  );
};
