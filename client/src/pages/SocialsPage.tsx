import React from "react";
import { Globe, Cpu, Network, Zap, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SocialsPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] bg-[#090909] text-white p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl space-y-8 p-8 bg-[#111111]/80 backdrop-blur-xl border border-[#242424] rounded-3xl shadow-2xl shadow-amber-500/5">
        
        {/* Animated Icon Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
          <div className="w-24 h-24 bg-[#1A1A1A] border-2 border-amber-500/30 rounded-2xl flex items-center justify-center relative rotate-3 hover:rotate-0 transition-transform duration-500 group">
            <Network className="w-10 h-10 text-amber-500 group-hover:scale-110 transition-transform duration-500" />
            <Cpu className="w-4 h-4 text-zinc-400 absolute top-2 right-2 animate-bounce" />
            <Zap className="w-4 h-4 text-amber-400 absolute bottom-2 left-2 animate-pulse" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            System Notice
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
            Social Matrix Offline
          </h1>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-lg mx-auto">
            You've reached the edge of our digital ecosystem. 
            <br className="hidden md:block" />
            <span className="text-zinc-300 font-medium">GoChat AI operates outside traditional social networks.</span>
          </p>
          <p className="text-xs text-zinc-500 italic max-w-md mx-auto">
            We don't have social accounts because we're busy building the future of artificial intelligence. Welcome to the actual grid.
          </p>
        </div>

        {/* Call to Action */}
        <div className="pt-6 border-t border-[#1F1F1F] w-full flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={() => navigate("/app/dashboard")}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Globe className="w-4 h-4" />
            Return to Dashboard
          </button>
        </div>
        
      </div>
    </div>
  );
}
