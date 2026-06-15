import React from "react";
import { Store, ChevronLeft, Plus } from "lucide-react";

export default function RightSidebar({
  companiesData,
  selectedCompany,
  roomConfig,
  onSelectCompanyId,
  onAddFurniture,
}) {
  return (
    <aside className="w-72 bg-[#0b111e] border-l border-slate-800/80 p-4 flex flex-col overflow-y-auto shrink-0">
      {!selectedCompany ? (
        <div className="flex flex-col h-full">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5" /> Brands & Providers
          </h3>
          <div className="space-y-3">
            {companiesData.map((comp) => (
              <button
                key={comp.id}
                onClick={() => onSelectCompanyId(comp.id)}
                className="w-full bg-[#101625] hover:bg-[#151e33] border border-slate-800/80 hover:border-slate-700/80 p-4 rounded-xl transition-all flex items-center gap-3.5 group text-left shadow-lg shadow-black/10"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${comp.logoBg} flex items-center justify-center font-black text-xs tracking-tighter uppercase shrink-0 shadow-inner group-hover:scale-105 transition-transform`}
                >
                  {comp.logoText}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-black text-white group-hover:text-blue-400 transition-colors truncate">
                    {comp.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    {comp.catalog?.length || 0} items available
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <button
            onClick={() => onSelectCompanyId(null)}
            className="flex items-center gap-1 text-slate-400 hover:text-white text-xs font-bold mb-4 transition-colors group w-fit"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />{" "}
            Back to Brands
          </button>

          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800/60 mb-4">
            <div
              className={`w-8 h-8 rounded-md ${selectedCompany.logoBg} flex items-center justify-center font-black text-[10px] uppercase shrink-0`}
            >
              {selectedCompany.logoText}
            </div>
            <div>
              <h3 className="text-xs font-black text-white">{selectedCompany.name}</h3>
              <p className="text-[9px] font-bold text-blue-500 tracking-wider uppercase">
                Catalog Selection
              </p>
            </div>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
            {selectedCompany.catalog?.map((item) => {
              const fitsInRoom = roomConfig
                ? (item.width <= roomConfig.width && item.height <= roomConfig.height) ||
                  (item.height <= roomConfig.width && item.width <= roomConfig.height)
                : true;

              return (
                <div
                  key={item.id}
                  className={`bg-[#101625] border p-3.5 rounded-xl flex items-center justify-between group transition-all ${
                    fitsInRoom
                      ? "border-slate-800/60 hover:border-slate-700"
                      : "border-red-900/20 opacity-40 select-none"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-black text-white">{item.name}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">
                      Размер: {item.width}м × {item.height}м
                    </p>
                    {!fitsInRoom && (
                      <p className="text-[9px] text-red-400 font-medium mt-0.5">
                        Too large for this room
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => fitsInRoom && onAddFurniture(item)}
                    disabled={!fitsInRoom}
                    className={`p-2 rounded-lg transition-all border ${
                      fitsInRoom
                        ? "bg-[#172033] hover:bg-blue-500 text-slate-400 hover:text-white border-slate-800/80 hover:border-blue-400/40 shadow-inner group-hover:scale-105 active:scale-95"
                        : "bg-slate-900 text-slate-600 border-slate-900 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}