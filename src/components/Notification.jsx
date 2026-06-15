import React from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Notification({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div
      className={`fixed top-4 left-4 right-4 bottom-auto mx-auto z-50 md:top-auto md:bottom-6 md:right-6 md:left-auto md:mx-0 max-w-md w-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border shadow-2xl transition-all duration-300 ${
        toast.type === "success"
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}
    >
      <div className="flex items-center gap-3">
        {toast.type === "success" ? (
          <CheckCircle2 className="w-4 h-4 shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 shrink-0" />
        )}
        <span className="text-xs font-bold tracking-wide break-words">{toast.message}</span>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/5 rounded-md transition-colors ml-2 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}