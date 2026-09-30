import React from 'react';
import { useServices } from '../../di/ServiceContainer';

interface HeaderProps {
  currentView: 'student' | 'staff';
  onSwitchView: (view: 'student' | 'staff') => void;
  pendingCount: number;
  onOpenArchitectureModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSwitchView,
  pendingCount,
  onOpenArchitectureModal
}) => {
  const { resetAllDemoData } = useServices();

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-inner font-bold text-xl">
              <i className="fa-solid fa-mug-hot"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">Quick-Bite</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full font-black bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Campus Central
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Sistema Inteligente de Fila &amp; Despacho
              </p>
            </div>
          </div>

          {/* Central Mode Switcher */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => onSwitchView('student')}
              className={`flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                currentView === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-mobile-screen-button text-xs"></i>
              <span>Estudiante</span>
            </button>
            <button
              onClick={() => onSwitchView('staff')}
              className={`flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                currentView === 'staff'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-gauge-high text-xs"></i>
              <span>Personal Cafetería</span>
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full">
                {pendingCount}
              </span>
            </button>
          </div>

          {/* Live Indicator, Clean Architecture Modal Button & Demo Reset */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={onOpenArchitectureModal}
              className="flex items-center space-x-1.5 text-xs bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 px-3 py-1.5 rounded-lg font-bold transition shadow-sm"
              title="Ver arquitectura limpia, SOLID y entidades de negocio Product y Order"
            >
              <i className="fa-solid fa-cubes-stacked text-indigo-400"></i>
              <span>Clean Architecture &amp; SOLID</span>
            </button>

            <div className="flex items-center space-x-2 text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Sincronización en vivo</span>
            </div>

            <button
              onClick={() => resetAllDemoData()}
              title="Reiniciar datos de demo a valores iniciales"
              className="text-xs text-slate-400 hover:text-slate-200 p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <i className="fa-solid fa-rotate-right mr-1"></i> Reiniciar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
