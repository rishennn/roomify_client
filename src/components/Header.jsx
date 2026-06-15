import React from "react";
import { LayoutGrid, Save, LogOut } from "lucide-react";

export default function Header({ roomConfig, onSave, onLogout }) {
  return (
    <header className="w-full bg-[#0b111e] border-b border-slate-800/80 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between shadow-xl shrink-0">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500 shrink-0">
          <LayoutGrid className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm sm:text-md font-black text-white tracking-tight truncate">
            {roomConfig ? roomConfig.name : "Roomify Canvas"}
          </h1>
          <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
            Internal Layout Framework Platform
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end sm:justify-start">
        <button
          onClick={onSave}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/10 active:scale-[0.98]"
        >
          <Save className="w-4 h-4 shrink-0" /> <span className="inline">Save Design</span>
        </button>
        <button
          onClick={onLogout}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-[#141b2b] hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-bold rounded-lg transition-all active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4 shrink-0" /> <span className="inline sm:hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}