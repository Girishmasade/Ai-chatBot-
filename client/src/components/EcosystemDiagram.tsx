import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  MessageSquare,
  Image as ImageIcon,
  TrendingUp,
  Shield,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  ArrowRight
} from "lucide-react";

interface EcosystemDiagramProps {
  onSelectFeature?: (featureId: string) => void;
}

export default function EcosystemDiagram({ onSelectFeature }: EcosystemDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-driven 3D tilt animation on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const branches = [
    {
      id: 1,
      title: "AI Reasoning & Chat",
      category: "Conversational Hub",
      color: "#3B82F6", // Blue
      gradient: "from-blue-500/20 to-blue-600/5",
      borderColor: "border-blue-500/30",
      glowColor: "rgba(59, 130, 246, 0.4)",
      badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: MessageSquare,
      path: "M 500 24 C 500 70, 125 40, 125 110",
      midPoint: { x: 312, y: 55 },
      items: [
        "Multi-turn Conversational Memory",
        "Code Refactoring & Bug Fixing",
        "Document & Text Analysis",
        "Context-Aware Prompt Pipeline"
      ],
      widget: (
        <div className="bg-[#090909] border border-blue-500/20 rounded-xl p-3 text-[11px] space-y-2 mt-3 font-mono">
          <div className="flex items-center justify-between text-blue-400 border-b border-blue-500/10 pb-1.5">
            <span className="font-bold tracking-wider">EXECUTION HISTORY</span>
            <span className="text-[9px] bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-300">ACTIVE</span>
          </div>
          <div className="space-y-1 text-zinc-400 text-[10px]">
            <div className="flex justify-between">
              <span>Model Routing</span>
              <span className="text-zinc-200">Gemini 3.5 Flash</span>
            </div>
            <div className="flex justify-between">
              <span>Optimized Output</span>
              <span className="text-emerald-400 font-semibold">0.38s Latency</span>
            </div>
            <div className="flex justify-between items-center text-amber-400/90 pt-1 border-t border-zinc-800/80">
              <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Context Check</span>
              <span className="text-zinc-300">Verified</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Image Studio AI",
      category: "Asset Generation",
      color: "#F59E0B", // Amber
      gradient: "from-amber-500/20 to-amber-600/5",
      borderColor: "border-amber-500/30",
      glowColor: "rgba(245, 158, 11, 0.4)",
      badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: ImageIcon,
      path: "M 500 24 C 500 70, 375 40, 375 110",
      midPoint: { x: 437, y: 55 },
      items: [
        "Photorealistic 4K Render Engine",
        "Multi-Aspect Ratio Formats",
        "Direct Asset Gallery Memory",
        "Prompt Guidance & Enhancement"
      ],
      widget: (
        <div className="bg-[#090909] border border-amber-500/20 rounded-xl p-3 text-[11px] space-y-2 mt-3">
          <div className="flex items-center justify-between text-amber-400 border-b border-amber-500/10 pb-1.5">
            <span className="font-bold tracking-wider font-mono">CANVAS PREVIEW</span>
            <span className="text-[9px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300 font-mono">1024x1024</span>
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/30 to-amber-700/40 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div className="text-[10px] space-y-0.5">
              <p className="text-zinc-200 font-medium line-clamp-1">Obsidian Amber Cyberpunk City</p>
              <p className="text-amber-500/80 font-mono">Status: Render Completed</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Venture Strategist",
      category: "Market Analytics",
      color: "#10B981", // Emerald
      gradient: "from-emerald-500/20 to-emerald-600/5",
      borderColor: "border-emerald-500/30",
      glowColor: "rgba(16, 185, 129, 0.4)",
      badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: TrendingUp,
      path: "M 500 24 C 500 70, 625 40, 625 110",
      midPoint: { x: 563, y: 55 },
      items: [
        "Real Demographics & Target Audience",
        "Financial Projection & Revenue Plan",
        "Operational Roadmap Generation",
        "Risk Mitigation Framework"
      ],
      widget: (
        <div className="bg-[#090909] border border-emerald-500/20 rounded-xl p-3 text-[11px] space-y-2 mt-3">
          <div className="flex items-center justify-between border-b border-emerald-500/10 pb-1.5">
            <span className="font-bold text-emerald-400 tracking-wider font-mono">VIABILITY SCORE</span>
            <div className="text-right">
              <span className="text-base font-extrabold text-emerald-400 font-mono">98.5</span>
              <span className="text-[9px] text-zinc-400 block font-sans">Out of 100</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[98.5%]" />
            </div>
            <div className="flex justify-between text-[10px] pt-1">
              <span className="text-emerald-400 font-semibold">Feasibility: High</span>
              <span className="text-zinc-400 font-mono">Risk Level: <strong className="text-emerald-400">Low</strong></span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Security & Governance",
      category: "Enterprise Trust",
      color: "#A855F7", // Purple
      gradient: "from-purple-500/20 to-purple-600/5",
      borderColor: "border-purple-500/30",
      glowColor: "rgba(168, 85, 247, 0.4)",
      badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: Shield,
      path: "M 500 24 C 500 70, 875 40, 875 110",
      midPoint: { x: 687, y: 55 },
      items: [
        "End-to-End Encryption Architecture",
        "Granular Ledger Audit Logging",
        "Role-Based Admin Oversight",
        "Instant System Health Checks"
      ],
      widget: (
        <div className="bg-[#090909] border border-purple-500/20 rounded-xl p-3 text-[11px] space-y-1.5 mt-3">
          <div className="flex items-center justify-between text-purple-400 border-b border-purple-500/10 pb-1.5">
            <span className="font-bold tracking-wider font-mono">SECURITY LOGS</span>
            <span className="text-[9px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-300 font-mono">VERIFIED</span>
          </div>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between items-center text-zinc-300">
              <span>Token Billing Ledger</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Synced
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-300">
              <span>AES-256 Vault Encryption</span>
              <span className="text-purple-400 font-mono">Locked</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400 pt-0.5 border-t border-zinc-800/80 text-[9px] font-mono">
              <span>Audit Stamp</span>
              <span>2026-LIVE-OK</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative my-12" style={{ perspective: "1200px" }}>
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformStyle: "preserve-3d"
        }}
        className="w-full"
      >
        {/* Top Header Hub */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-zinc-900 via-[#151515] to-zinc-900 border border-amber-500/40 shadow-xl shadow-amber-500/10 cursor-pointer group"
          >
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute -top-0.5 -right-0.5" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5" />
            
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-180 transition-transform duration-700" />
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide uppercase font-sans">
              Our Ecosystem Architecture
            </h2>
          </motion.div>
          
          <p className="text-xs text-zinc-400 max-w-md">
            Curated intelligent pathways connecting conversational models, graphics creation, analytics, and security.
          </p>

          {/* Central Root Pulse Dot */}
          <div className="relative mt-2">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/50">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* SVG Connecting Tree Diagram (Desktop & Tablet) */}
        <div className="hidden md:block relative w-full h-[100px] -mt-2 pointer-events-none">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Multi-colored Line Gradients */}
              <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>

              {/* Glowing filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render 4 Bezier Curved Paths with Glowing Flowing Dots */}
            {branches.map((branch) => {
              const isHovered = hoveredCard === branch.id;
              const strokeWidth = isHovered ? 3.5 : 2;
              let strokeGradient = `url(#grad-blue)`;
              if (branch.id === 2) strokeGradient = `url(#grad-amber)`;
              if (branch.id === 3) strokeGradient = `url(#grad-emerald)`;
              if (branch.id === 4) strokeGradient = `url(#grad-purple)`;

              return (
                <g key={branch.id}>
                  {/* Background Shadow Line for Depth */}
                  <path
                    d={branch.path}
                    fill="none"
                    stroke="#1E1E24"
                    strokeWidth={strokeWidth + 2}
                    strokeLinecap="round"
                  />

                  {/* Main Curved Colored Path */}
                  <path
                    d={branch.path}
                    fill="none"
                    stroke={strokeGradient}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    filter={isHovered ? "url(#glow)" : undefined}
                    className="transition-all duration-300"
                  />

                  {/* Animated Light Pulse traveling down the path */}
                  <circle r={isHovered ? "5" : "3.5"} fill={branch.color} filter="url(#glow)">
                    <animateMotion
                      path={branch.path}
                      dur={`${2.8 + branch.id * 0.4}s`}
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Secondary offset pulse for continuous energy flow */}
                  <circle r="2.5" fill="#FFFFFF">
                    <animateMotion
                      path={branch.path}
                      dur={`${2.8 + branch.id * 0.4}s`}
                      begin={`${1.4 + branch.id * 0.2}s`}
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Mid-point Junction Dot */}
                  <circle
                    cx={branch.midPoint.x}
                    cy={branch.midPoint.y}
                    r={isHovered ? 5 : 4}
                    fill={branch.color}
                    stroke="#090909"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  
                  {/* Destination Node Circle at Card Top */}
                  <circle
                    cx={branch.id === 1 ? 125 : branch.id === 2 ? 375 : branch.id === 3 ? 625 : 875}
                    cy={110}
                    r={isHovered ? 6 : 4.5}
                    fill={branch.color}
                    stroke="#090909"
                    strokeWidth="2.5"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 md:pt-0 relative z-20">
          {branches.map((branch) => {
            const Icon = branch.icon;
            const isHovered = hoveredCard === branch.id;

            return (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: branch.id * 0.1 }}
                onMouseEnter={() => setHoveredCard(branch.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-gradient-to-b ${branch.gradient} bg-[#111111] border ${
                  isHovered ? branch.borderColor : "border-[#1F1F1F]"
                } rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.02]`}
                style={{
                  boxShadow: isHovered ? `0 15px 35px -10px ${branch.glowColor}` : "none",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Top Accent Line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
                  style={{
                    backgroundColor: branch.color,
                    opacity: isHovered ? 1 : 0.4
                  }}
                />

                <div>
                  {/* Header: Icon + Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${branch.color}15`, color: branch.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${branch.badgeBg}`}
                    >
                      {branch.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white tracking-wide mb-3 flex items-center gap-1.5">
                    {branch.title}
                  </h3>

                  {/* Checklist items */}
                  <ul className="space-y-2 mb-4">
                    {branch.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-zinc-300">
                        <CheckCircle2
                          className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                          style={{ color: branch.color }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Dynamic Live Widget */}
                  {branch.widget}
                </div>

                {/* Action Button at Card Footer */}
                <div className="pt-4 mt-3 border-t border-zinc-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-mono">STATUS: OPERATIONAL</span>
                  <button
                    onClick={() => onSelectFeature && onSelectFeature(branch.title)}
                    className="text-xs font-semibold flex items-center gap-1 transition-colors duration-200"
                    style={{ color: branch.color }}
                  >
                    Explore
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
