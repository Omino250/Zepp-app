import React from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useZepp } from '../../context/ZeppContext';

export const ToastStack: React.FC = () => {
  const { toasts, dismissToast } = useZepp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] sm:w-auto pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto zepp-glass rounded-2xl px-4 py-3 flex items-center gap-3 text-sm text-[#1C2B45] dark:text-[#F0F5FF] shadow-lg"
        >
          {toast.tone === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-[#20A574] shrink-0" />
          )}
          {toast.tone === 'warning' && (
            <AlertTriangle className="w-4 h-4 text-[#EBAA43] shrink-0" />
          )}
          {toast.tone === 'info' && (
            <Info className="w-4 h-4 text-[#1769E8] dark:text-[#60A5FA] shrink-0" />
          )}
          <span className="flex-1 text-[13px] font-medium leading-snug">{toast.text}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-[#71819C]" />
          </button>
        </div>
      ))}
    </div>
  );
};
