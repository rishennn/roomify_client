import React from "react";
import { Trash2, Plus } from "lucide-react";

export default function LeftSidebar({ savedLayouts, onLoadLayout, onDeleteLayout, onResetRoom }) {
  return (
    <aside className="w-full lg:w-64 bg-[#0b111e] lg:border-r border-slate-800/80 p-4 flex flex-col gap-4 overflow-y-auto h-full shrink-0">
      <div className="flex-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Saved Layouts
        </h3>
        {savedLayouts.length === 0 ? (
          <p className="text-[11px] text-slate-600 italic">
            No saved blueprints found.
          </p>
        ) : (
          <div className="space-y-2">
            {savedLayouts.map((layout) => (
              <div
                key={layout._id}
                onClick={() => onLoadLayout(layout)}
                className="w-full bg-[#101625] hover:bg-[#151e33] border border-slate-800/60 p-3 rounded-xl transition-all group flex items-center justify-between cursor-pointer"
              >
                <div className="overflow-hidden pr-2">
                  <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                    {layout.name}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {layout.roomWidth}m × {layout.roomHeight}m Grid Canvas
                  </p>
                </div>
                <button
                  onClick={(e) => onDeleteLayout(e, layout._id)}
                  className="p-1.5 bg-transparent hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-slate-600 hover:text-red-400 rounded-md transition-all shrink-0"
                  title="Delete Blueprint"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={onResetRoom}
        className="w-full mt-4 lg:mt-auto flex items-center justify-center gap-2 bg-[#101625] hover:bg-[#151e33] border border-slate-800 py-2.5 rounded-xl text-xs font-bold text-slate-300 transition-all shrink-0 active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" /> New Canvas Space
      </button>
    </aside>
  );
}