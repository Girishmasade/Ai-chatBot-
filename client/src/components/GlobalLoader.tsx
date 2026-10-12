import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export default function GlobalLoader() {
  const apiLoadingCount = useSelector((state: RootState) => state.ui?.apiLoadingCount || 0);

  if (apiLoadingCount === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      
      <div className="relative flex flex-col items-center justify-center p-8 rounded-3xl bg-[#111111]/80 border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.15)] backdrop-blur-xl pointer-events-auto">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Outer glowing rings */}
          <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-amber-500/50 animate-[spin_2s_linear_infinite_reverse]" />
          
          {/* Custom Logo Image */}
          <img 
            src="/faviconGochat.png" 
            alt="Loading..." 
            className="w-12 h-12 object-contain animate-pulse z-10"
          />
          
          {/* Glow effect behind the logo */}
          <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse z-0" />
        </div>
        
        <p className="mt-4 text-xs font-bold text-amber-500 uppercase tracking-[0.2em] animate-pulse">
          Processing
        </p>
      </div>
    </div>
  );
}
