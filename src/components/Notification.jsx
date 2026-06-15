import React from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

export default function Notification({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className={`w-full bg-[#0f172a] border ${isSuccess ? "border-emerald-500/40" : "border-red-500/40"} rounded-xl p-4 shadow-2xl shadow-black/80 flex items-start gap-3`}>
        <div className="shrink-0 mt-0.5">
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-200 leading-relaxed">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}