import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { ToastType } from '../../../core/domain/interfaces/INotificationService';

const colorStyles: Record<ToastType, { bg: string; border: string; text: string; iconBg: string; icon: string }> = {
  emerald: {
    bg: 'bg-emerald-600',
    border: 'border-emerald-500',
    text: 'text-white',
    iconBg: 'bg-white text-emerald-600',
    icon: 'fa-solid fa-circle-check'
  },
  amber: {
    bg: 'bg-slate-900',
    border: 'border-amber-400',
    text: 'text-white',
    iconBg: 'bg-amber-500 text-slate-950',
    icon: 'fa-solid fa-bell-concierge'
  },
  blue: {
    bg: 'bg-blue-600',
    border: 'border-blue-500',
    text: 'text-white',
    iconBg: 'bg-white text-blue-600',
    icon: 'fa-solid fa-bolt'
  },
  rose: {
    bg: 'bg-rose-600',
    border: 'border-rose-500',
    text: 'text-white',
    iconBg: 'bg-white text-rose-600',
    icon: 'fa-solid fa-triangle-exclamation'
  },
  slate: {
    bg: 'bg-slate-800',
    border: 'border-slate-700',
    text: 'text-white',
    iconBg: 'bg-slate-700 text-slate-200',
    icon: 'fa-solid fa-rotate-right'
  }
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm sm:max-w-md w-full px-4 sm:px-0">
      {toasts.map(toast => {
        const style = colorStyles[toast.type] || colorStyles.emerald;

        return (
          <div
            key={toast.id}
            className={`p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center space-x-3 pointer-events-auto transform transition-all duration-300 text-sm ${style.bg} ${style.text} border ${style.border}`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 shadow-sm ${style.iconBg}`}>
              <i className={style.icon}></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs uppercase tracking-wider opacity-90 flex items-center space-x-1.5">
                <span className="truncate">{toast.title}</span>
                {toast.badge && (
                  <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                    {toast.badge}
                  </span>
                )}
              </div>
              <div className="text-xs mt-0.5 opacity-95 leading-snug line-clamp-2">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-white/70 hover:text-white p-1 rounded-lg transition"
              title="Cerrar notificación"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
};
