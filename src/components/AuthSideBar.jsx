import { Home, LayoutGrid, Move, Download } from 'lucide-react';

const steps = [
  {
    step: 'Step 1',
    title: 'Define room dimensions',
    description: 'Set your exact wall lengths, and the system will instantly generate an interactive grid layout of your space.',
    icon: <LayoutGrid className="w-5 h-5 text-blue-400" />,
    badge: '12.0m × 12.0m',
    badgeClass: "border border-blue-500/30 bg-blue-500/5 text-blue-400 font-mono font-bold tracking-wide"
  },
  {
    step: 'Step 2',
    title: 'Drag & drop furniture',
    description: 'Choose items from the catalog, rotate them precisely, and easily position them directly onto your grid canvas.',
    icon: <Move className="w-5 h-5 text-amber-400" />,
    badge: '🛋️ LUXURY SOFA',
    badgeClass: "bg-amber-500 text-black font-black shadow-lg shadow-amber-500/10 transform -rotate-2 tracking-wide"
  },
  {
    step: 'Step 3',
    title: 'Save & export design',
    description: 'Download your finished layout, get furniture specifications, or share the interactive link with friends.',
    icon: <Download className="w-5 h-5 text-emerald-400" />,
    badge: 'READY TO EXPORT',
    badgeClass: "border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold tracking-wider"
  }
];

function StepCard({ item }) {
  return (
    <div className="group relative bg-[#131c2e] border border-slate-800/60 rounded-2xl p-4 transition-all duration-300 hover:border-blue-500/30 hover:bg-[#162238] shadow-xl shadow-black/15">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{item.step}</span>
        <div className="opacity-40 group-hover:opacity-100 transition-opacity duration-300">{item.icon}</div>
      </div>

      <h3 className="text-base font-extrabold mt-1 text-white">{item.title}</h3>
      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-normal">{item.description}</p>

      <div className="mt-3 h-14 bg-[#090d16] rounded-xl border border-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className={`px-4 py-1 rounded-md text-[11px] ${item.badgeClass}`}>
          {item.badge}
        </div>
      </div>
    </div>
  );
}

export default function AuthSidebar() {
  return (
    <div className="hidden md:flex w-1/2 h-screen bg-[#0b111e] text-white px-12 py-8 flex-col justify-between items-center select-none border-r border-slate-800/40 overflow-hidden relative">
      
      <div className="w-full max-w-[440px] flex items-center gap-3 pt-1">
        <div className="bg-blue-600/10 p-2 rounded-xl border border-blue-500/20">
          <Home className="w-5 h-5 text-blue-500" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Roomify
        </span>
      </div>

      <div className="w-full max-w-[440px] flex-1 flex flex-col justify-center space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 inline-block">
            Smart Assistant
          </span>
          <h2 className="text-2xl font-black tracking-tight leading-tight text-slate-100 xl:text-3xl">
            Design your space in three simple steps
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Transform your interior concepts instantly using our smart 2D planners and automated layout engines.
          </p>
        </div>

        <div className="space-y-3.5">
          {steps.map((item, index) => (
            <StepCard key={index} item={item} />
          ))}
        </div>
      </div>

      <div className="w-full max-w-[440px] text-[11px] text-slate-500 font-medium pb-1">
        &copy; {new Date().getFullYear()} Roomify AI Inc. All rights reserved.
      </div>
    </div>
  );
}