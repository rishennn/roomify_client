import React from "react";

export const Sidebar = ({ templates, activeItem, onAdd, onRotate, onRemove }) => {
  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-6 z-10 text-slate-200">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Furniture Catalog</h3>
        <div className="flex flex-col gap-3">
          {templates.map((tmpl) => (
            <button
              key={tmpl.type}
              className="w-full text-left p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-medium transition-all"
              onClick={() => onAdd(tmpl)}
            >
              Add {tmpl.name} ({tmpl.width}m × {tmpl.height}m)
            </button>
          ))}
        </div>
      </div>

      {activeItem && (
        <div className="mt-auto pt-6 border-t border-slate-800">
          <h4 className="text-sm font-medium text-slate-400 mb-3">
            Selected: <span className="text-white">{activeItem.name}</span>
          </h4>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onRotate(activeItem.id)}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-colors"
            >
              Rotate 90°
            </button>
            <button
              onClick={() => onRemove(activeItem.id)}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};