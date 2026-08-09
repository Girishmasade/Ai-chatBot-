import React from "react";
import { motion } from "motion/react";
import {
  MessageSquare,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Check,
  Zap,
  Activity,
  BarChart2,
  Lock,
  Cpu,
  Layers
} from "lucide-react";
import Tilt3DCard from "./Tilt3DCard";

export default function BranchingServicesTree() {
  return (
    <section className="py-24 relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12 z-10 overflow-hidden">
      {/* Background ambient light reflections */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center space-y-4 mb-14">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-purple-500/20 border border-amber-500/30 text-amber-400 text-[11px] font-extrabold uppercase tracking-widest rounded-full shadow-lg shadow-amber-500/10"
        >
          <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
          Connected Neural Ecosystem
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-white tracking-tight font-sans"
        >
          Our Services
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto"
        >
          Engineered as a synchronized AI intelligence graph. Hover any card to activate interactive 3D perspective depth.
        </motion.p>
      </div>

      {/* Central Hub Origin Node */}
      <div className="flex flex-col items-center justify-center relative mb-2">
        <motion.div
          animate={{ scale: [1, 1.25, 1], boxShadow: ["0 0 20px rgba(16, 185, 129, 0.4)", "0 0 40px rgba(16, 185, 129, 0.8)", "0 0 20px rgba(16, 185, 129, 0.4)"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-6 rounded-full bg-emerald-400 border-4 border-[#090909] z-20 flex items-center justify-center cursor-pointer"
        >
          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
        </motion.div>
        <span className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase tracking-widest mt-2 bg-[#090909] px-2.5 py-0.5 rounded-full border border-emerald-500/30">
          DISPATCH CORE
        </span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-400 to-amber-500 mt-1" />
      </div>

      {/* SVG Animated Tree Connector Lines (Desktop) */}
      <div className="hidden lg:block w-full h-28 relative my-[-10px] pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 110">
          <defs>
            {/* Color Gradients */}
            <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
            <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#D946EF" />
            </linearGradient>

            {/* Glowing Drop Shadows */}
            <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Animated Paths */}
          {/* Path 1: Blue */}
          <path id="path-1" d="M 500 0 C 500 55, 125 55, 125 110" fill="none" stroke="url(#grad-blue)" strokeWidth="3" filter="url(#glow-blue)" />
          {/* Path 2: Amber */}
          <path id="path-2" d="M 500 0 C 500 55, 375 55, 375 110" fill="none" stroke="url(#grad-amber)" strokeWidth="3" filter="url(#glow-amber)" />
          {/* Path 3: Emerald */}
          <path id="path-3" d="M 500 0 C 500 55, 625 55, 625 110" fill="none" stroke="url(#grad-emerald)" strokeWidth="3" filter="url(#glow-emerald)" />
          {/* Path 4: Purple */}
          <path id="path-4" d="M 500 0 C 500 55, 875 55, 875 110" fill="none" stroke="url(#grad-purple)" strokeWidth="3" filter="url(#glow-purple)" />

          {/* Traveling Energy Pulse Dots along each branch */}
          <circle r="5" fill="#38BDF8">
            <animateMotion dur="2.4s" repeatCount="indefinite" path="M 500 0 C 500 55, 125 55, 125 110" />
          </circle>
          <circle r="5" fill="#FBBF24">
            <animateMotion dur="2.1s" repeatCount="indefinite" path="M 500 0 C 500 55, 375 55, 375 110" />
          </circle>
          <circle r="5" fill="#34D399">
            <animateMotion dur="2.6s" repeatCount="indefinite" path="M 500 0 C 500 55, 625 55, 625 110" />
          </circle>
          <circle r="5" fill="#E879F9">
            <animateMotion dur="2.2s" repeatCount="indefinite" path="M 500 0 C 500 55, 875 55, 875 110" />
          </circle>

          {/* Glowing Junction Dots */}
          <circle cx="125" cy="110" r="5" fill="#38BDF8" className="animate-ping" />
          <circle cx="375" cy="110" r="5" fill="#FBBF24" className="animate-ping" />
          <circle cx="625" cy="110" r="5" fill="#34D399" className="animate-ping" />
          <circle cx="875" cy="110" r="5" fill="#E879F9" className="animate-ping" />
        </svg>
      </div>

      {/* 4 Richly Colored Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 lg:pt-0">
        
        {/* Card 1: Electric Blue / Cyan Theme */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="h-full"
        >
          <Tilt3DCard maxTilt={14} glowColor="rgba(6, 182, 212, 0.4)" className="h-full">
            <div className="bg-gradient-to-b from-[#0B172B] via-[#0D1F3C] to-[#0A1220] border-2 border-cyan-500/40 hover:border-cyan-400 rounded-3xl p-6 text-left flex flex-col justify-between h-full space-y-6 transition duration-300 shadow-2xl shadow-cyan-500/10 relative overflow-hidden group">
              
              {/* Dynamic Top Ambient Glow Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 shadow-lg shadow-cyan-500" />
              <div className="absolute -top-24 -right-24 w-44 h-44 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition duration-500" />

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-md shadow-cyan-500/20 group-hover:scale-110 transition duration-300">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full">
                    AI CHAT ENGINE
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white tracking-wide group-hover:text-cyan-300 transition">
                    Conversational AI
                  </h3>
                  <p className="text-xs text-cyan-100/70 mt-1 leading-relaxed">
                    High-speed conversational matrix capable of logic reasoning and code synthesis.
                  </p>
                </div>

                {/* Checklist items */}
                <ul className="space-y-2.5 text-xs text-zinc-200">
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-cyan-300" />
                    </div>
                    <span>Streaming response generation</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-cyan-300" />
                    </div>
                    <span>Full syntax & code debugging</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-cyan-300" />
                    </div>
                    <span>Multilingual translation buffer</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-cyan-300" />
                    </div>
                    <span>Executive chat history memory</span>
                  </li>
                </ul>
              </div>

              {/* Embedded Live Widget */}
              <div className="bg-[#060D19]/90 border border-cyan-500/30 rounded-2xl p-3.5 space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 font-bold">
                  <span>LATENCY SPEED</span>
                  <span className="text-emerald-400">0.38s (FAST)</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-cyan-500/20">
                  <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full w-[96%] animate-pulse" />
                </div>
              </div>
            </div>
          </Tilt3DCard>
        </motion.div>

        {/* Card 2: Radiant Gold / Amber Theme */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full"
        >
          <Tilt3DCard maxTilt={14} glowColor="rgba(245, 158, 11, 0.4)" className="h-full">
            <div className="bg-gradient-to-b from-[#241709] via-[#2E1E0B] to-[#170E05] border-2 border-amber-500/40 hover:border-amber-400 rounded-3xl p-6 text-left flex flex-col justify-between h-full space-y-6 transition duration-300 shadow-2xl shadow-amber-500/10 relative overflow-hidden group">
              
              {/* Dynamic Top Ambient Glow Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-lg shadow-amber-500" />
              <div className="absolute -top-24 -right-24 w-44 h-44 bg-amber-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition duration-500" />

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-300 shadow-md shadow-amber-500/20 group-hover:scale-110 transition duration-300">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full">
                    IMAGE STUDIO
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white tracking-wide group-hover:text-amber-300 transition">
                    Image Studio 3D
                  </h3>
                  <p className="text-xs text-amber-100/70 mt-1 leading-relaxed">
                    Render ultra-realistic 4K visuals with customizable aspect ratios and style presets.
                  </p>
                </div>

                {/* Checklist items */}
                <ul className="space-y-2.5 text-xs text-zinc-200">
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-amber-300" />
                    </div>
                    <span>4K PNG high-definition exports</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-amber-300" />
                    </div>
                    <span>Multi-format aspect ratios (16:9, 1:1)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-amber-300" />
                    </div>
                    <span>Cyberpunk & Obsidian Gold styles</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-amber-300" />
                    </div>
                    <span>Instant asset library memory</span>
                  </li>
                </ul>
              </div>

              {/* Embedded Live Widget */}
              <div className="bg-[#120B04]/90 border border-amber-500/30 rounded-2xl p-3.5 space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 font-bold">
                  <span>RENDER RESOLUTION</span>
                  <span className="text-amber-400">3840 x 2160 (4K)</span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-zinc-400">
                  <span>Asset Quality: High</span>
                  <span className="text-emerald-400 font-bold">Verified</span>
                </div>
              </div>
            </div>
          </Tilt3DCard>
        </motion.div>

        {/* Card 3: Cyber Emerald / Green Theme */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="h-full"
        >
          <Tilt3DCard maxTilt={14} glowColor="rgba(16, 185, 129, 0.4)" className="h-full">
            <div className="bg-gradient-to-b from-[#0A2218] via-[#0E2D20] to-[#071710] border-2 border-emerald-500/40 hover:border-emerald-400 rounded-3xl p-6 text-left flex flex-col justify-between h-full space-y-6 transition duration-300 shadow-2xl shadow-emerald-500/10 relative overflow-hidden group">
              
              {/* Dynamic Top Ambient Glow Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-lg shadow-emerald-500" />
              <div className="absolute -top-24 -right-24 w-44 h-44 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition duration-500" />

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 shadow-md shadow-emerald-500/20 group-hover:scale-110 transition duration-300">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full">
                    VENTURE ENGINE
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white tracking-wide group-hover:text-emerald-300 transition">
                    Venture Strategist
                  </h3>
                  <p className="text-xs text-emerald-100/70 mt-1 leading-relaxed">
                    Formulate structured business plans, TAM/SAM sizing, and unit economics models.
                  </p>
                </div>

                {/* Checklist items */}
                <ul className="space-y-2.5 text-xs text-zinc-200">
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-300" />
                    </div>
                    <span>TAM / SAM market sizing analytics</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-300" />
                    </div>
                    <span>90-day operational sprint roadmaps</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-300" />
                    </div>
                    <span>Unit economics & financial models</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-300" />
                    </div>
                    <span>Competitor moat evaluation engine</span>
                  </li>
                </ul>
              </div>

              {/* Embedded Live Widget */}
              <div className="bg-[#05120C]/90 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300 font-bold">
                  <span>STRATEGY SCORE</span>
                  <span className="text-emerald-400 font-bold">920 / 950 EXCELLENT</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-emerald-500/20">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full w-[94%]" />
                </div>
              </div>
            </div>
          </Tilt3DCard>
        </motion.div>

        {/* Card 4: Neon Purple / Fuchsia Theme */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="h-full"
        >
          <Tilt3DCard maxTilt={14} glowColor="rgba(139, 92, 246, 0.4)" className="h-full">
            <div className="bg-gradient-to-b from-[#1C0D30] via-[#24113E] to-[#120820] border-2 border-purple-500/40 hover:border-purple-400 rounded-3xl p-6 text-left flex flex-col justify-between h-full space-y-6 transition duration-300 shadow-2xl shadow-purple-500/10 relative overflow-hidden group">
              
              {/* Dynamic Top Ambient Glow Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-fuchsia-400 to-pink-400 shadow-lg shadow-purple-500" />
              <div className="absolute -top-24 -right-24 w-44 h-44 bg-purple-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition duration-500" />

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-purple-500/15 border border-purple-400/40 text-purple-300 shadow-md shadow-purple-500/20 group-hover:scale-110 transition duration-300">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-full">
                    MODEL TELEMETRY
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white tracking-wide group-hover:text-purple-300 transition">
                    Model & Telemetry
                  </h3>
                  <p className="text-xs text-purple-100/70 mt-1 leading-relaxed">
                    Custom system prompt engineering, zero-log privacy shielding, and proxy routing.
                  </p>
                </div>

                {/* Checklist items */}
                <ul className="space-y-2.5 text-xs text-zinc-200">
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-purple-300" />
                    </div>
                    <span>Custom system prompt studio</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-purple-300" />
                    </div>
                    <span>Server-side API proxy shielding</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-purple-300" />
                    </div>
                    <span>100% encrypted telemetry logs</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-purple-300" />
                    </div>
                    <span>Multi-model dynamic switcher</span>
                  </li>
                </ul>
              </div>

              {/* Embedded Live Widget */}
              <div className="bg-[#0E061A]/90 border border-purple-500/30 rounded-2xl p-3.5 space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between text-[10px] font-mono text-purple-300 font-bold">
                  <span>TELEMETRY STATUS</span>
                  <span className="text-purple-400">100% ENCRYPTED</span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-zinc-400">
                  <span>Zero Data Leakage</span>
                  <span className="text-emerald-400 font-bold">Verified</span>
                </div>
              </div>
            </div>
          </Tilt3DCard>
        </motion.div>

      </div>
    </section>
  );
}
