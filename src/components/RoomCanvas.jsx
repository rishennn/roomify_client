import React from "react";

export const RoomCanvas = ({
  roomConfig,
  placedFurniture,
  activeId,
  canvasRef,
  onMouseMove,
  onMouseUp,
  onMouseDown,
  onSelect,
  cellSize,
}) => {
  if (!roomConfig) return null;

  return (
    <div
      className="relative border-2 border-slate-700 rounded shadow-2xl bg-slate-950/40 dynamic-grid"
      style={{
        width: roomConfig.width * cellSize,
        height: roomConfig.height * cellSize,
        backgroundImage: "linear-gradient(to right, rgba(51, 65, 85, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(51, 65, 85, 0.3) 1px, transparent 1px)",
        backgroundSize: `${cellSize}px ${cellSize}px`,
      }}
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {placedFurniture.map((item) => (
        <div
          key={item.id}
          onMouseDown={(e) => onMouseDown(e, item)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item.id);
          }}
          className={`absolute flex items-center justify-center select-none rounded border transition-colors cursor-move ${
            item.id === activeId
              ? "bg-sky-500/80 border-sky-400 text-white shadow-lg shadow-sky-500/20"
              : "bg-emerald-500/80 border-emerald-400 text-slate-900 font-semibold"
          }`}
          style={{
            left: item.x * cellSize,
            top: item.y * cellSize,
            width: item.width * cellSize,
            height: item.height * cellSize,
          }}
        >
          <span
            className="text-xs uppercase tracking-wider block"
            style={{ transform: `rotate(${item.rotation}deg)` }}
          >
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
};