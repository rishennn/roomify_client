import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Notification({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] w-full max-w-sm px-4">
      <div className={`w-full bg-[#0f172a] border ${toast.type === 'success' ? 'border-emerald-500/40' : 'border-red-500/40'} rounded-xl p-3.5 shadow-2xl flex items-start gap-3`}>
        <div className="shrink-0 mt-0.5">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
        </div>
        <p className="text-sm font-medium flex-1 text-slate-200">{toast.message}</p>
        <button onClick={onClose} className="text-slate-500 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}