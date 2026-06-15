import React, { useState } from "react";

export default function RoomSizeModal({ onConfirm }) {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [name, setName] = useState("My Custom Room");

  const handleSubmit = (e) => {
    e.preventDefault();
    const validatedWidth = Math.max(4, Math.min(Number(width), 20));
    const validatedHeight = Math.max(4, Math.min(Number(height), 20));
    onConfirm({ name, width: validatedWidth, height: validatedHeight });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-[#0b111e] border border-slate-800 p-5 mobile-xs:p-6 rounded-2xl shadow-2xl my-auto">
        <h2 className="text-lg mobile-sm:text-xl font-black text-white mb-1">
          Canvas Parameters
        </h2>
        <p className="text-[11px] mobile-sm:text-xs text-slate-400 mb-5 mobile-sm:mb-6">
          Define your room dimension grid size in meters (max 20×20 m).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] mobile-sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Room Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#101625] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] mobile-sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Width in Meters
              </label>
              <input
                type="number"
                min="4"
                max="20"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full bg-[#101625] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-[10px] mobile-sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Height in Meters
              </label>
              <input
                type="number"
                min="4"
                max="20"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-[#101625] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-2.5 mobile-sm:py-3 rounded-lg transition-all text-sm mt-2 active:scale-[0.98]"
          >
            Generate Grid Canvas
          </button>
        </form>
      </div>
    </div>
  );
}