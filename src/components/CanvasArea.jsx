import React from "react";
import { MousePointer, RotateCw, Trash2 } from "lucide-react";

export default function CanvasArea({
  roomConfig,
  placedFurniture,
  activeItem,
  activeId,
  cellSize,
  onRotate,
  onRemove,
  onCanvasClick,
  onMouseDown,
}) {
  return (
    <main className="flex-1 bg-[#080c14] flex flex-col overflow-hidden relative">
      <div className="w-full bg-[#0b111e]/90 border-b border-slate-800/60 px-6 py-3 flex items-center justify-between shrink-0 min-h-[56px]">
        {activeItem ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                <MousePointer className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-white">{activeItem.name}</span>
                <span className="text-[10px] text-slate-500 font-bold ml-2 uppercase bg-[#101625] px-2 py-0.5 rounded border border-slate-800">
                  {activeItem.width}m × {activeItem.height}m
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRotate(activeItem.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#101625] hover:bg-[#162035] border border-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-lg transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" /> Rotate Object
              </button>
              <button
                onClick={() => onRemove(activeItem.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-500 italic text-xs font-medium">
            <MousePointer className="w-3.5 h-3.5" />
            Select an item on the grid canvas to drag, rotate or remove it.
          </div>
        )}
      </div>

      <div
        className="flex-1 overflow-auto p-8 flex items-center justify-center"
        onClick={onCanvasClick}
      >
        {roomConfig && (
          <div
            id="grid-canvas"
            className="bg-[#0b111e]/40 border border-slate-800/80 rounded-xl relative shadow-2xl transition-all"
            style={{
              width: roomConfig.width * cellSize,
              height: roomConfig.height * cellSize,
              backgroundImage:
                "linear-gradient(to right, rgba(30, 41, 59, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 41, 59, 0.4) 1px, transparent 1px)",
              backgroundSize: `${cellSize}px ${cellSize}px`,
            }}
          >
            {placedFurniture.map((item) => (
              <div
                key={item.id}
                onMouseDown={(e) => onMouseDown(e, item)}
                className={`absolute bg-blue-500/10 border-2 ${
                  activeId === item.id
                    ? "border-blue-400 bg-blue-500/20 shadow-xl shadow-blue-500/5 z-30"
                    : "border-blue-500/40 hover:border-blue-500/60"
                } rounded-lg p-1 flex flex-col justify-between select-none cursor-move`}
                style={{
                  left: item.x * cellSize,
                  top: item.y * cellSize,
                  width: item.width * cellSize,
                  height: item.height * cellSize,
                }}
              >
                <div className="overflow-hidden pointer-events-none">
                  <p className="text-[9px] font-black text-white truncate leading-tight">
                    {item.name}
                  </p>
                  <p className="text-[8px] text-blue-400 font-bold tracking-wide truncate uppercase mt-0.5">
                    {item.width}m × {item.height}m
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}