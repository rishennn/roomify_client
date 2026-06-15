import React from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Notification({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-2xl transition-all duration-300 ${
        toast.type === "success"
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}
    >
      {toast.type === "success" ? (
        <CheckCircle2 className="w-4 h-4 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0" />
      )}
      <span className="text-xs font-bold tracking-wide">{toast.message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/5 rounded-md transition-colors ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}