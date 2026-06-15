import React from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

export default function Notification({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className={`w-full bg-[#0f172a] border ${isSuccess ? "border-emerald-500/40" : "border-red-500/40"} rounded-xl p-3.5 shadow-xl shadow-black/60 flex items-start gap-3`}>
        <div className="shrink-0 mt-0.5">
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-200 leading-tight">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="shrink-0 p-0.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}