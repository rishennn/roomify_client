import React from "react";
import { LayoutGrid, Save, LogOut } from "lucide-react";

export default function Header({ roomConfig, onSave, onLogout }) {
  return (
    <header className="w-full bg-[#0b111e] border-b border-slate-800/80 px-6 py-4 flex items-center justify-between shadow-xl shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500">
          <LayoutGrid className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-md font-black text-white tracking-tight">
            {roomConfig ? roomConfig.name : "Roomify Canvas"}
          </h1>
          <p className="text-[10px] text-slate-400 font-medium">
            Internal Layout Framework Platform
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/10"
        >
          <Save className="w-4 h-4" /> Save Design
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 bg-[#141b2b] hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-bold rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </header>
  );
}