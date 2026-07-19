import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Zap,
  TrendingUp,
  MessageSquare,
  Image as ImageIcon,
  ArrowRight,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  Tv,
  Sparkles,
  ShieldAlert,
  Sliders,
  UserCheck
} from "lucide-react";
import { ActiveScreen, User } from "../types";
import { useGetAssetsQuery } from "../redux/api/apiSlice";
import { formatCredits } from "../helpers/utils";

interface DashboardPageProps {
  currentUser: User;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export default function DashboardPage({
  currentUser,
  setActiveScreen
}: DashboardPageProps) {
  const { data: assets = [], isLoading: loading } = useGetAssetsQuery();

  const quickActions = [
    {
      title: "Start Chat Core",
      desc: "Connect server-side with Gemini 3.5 Flash",
      screen: "chat" as ActiveScreen,
      icon: MessageSquare,
      color: "from-amber-400 to-amber-600"
    },
    {
      title: "Generate Image",
      desc: "Render high-definition visuals instantly",
      screen: "image" as ActiveScreen,
      icon: ImageIcon,
      color: "from-amber-500 to-yellow-600"
    },
    {
      title: "Render Motion Video",
      desc: "Animate custom text prompts using Veo Lite",
      screen: "video" as ActiveScreen,
      icon: Tv,
      color: "from-amber-600 to-amber-800"
    },
    {
      title: "Venture Capital Plan",
      desc: "Compile detailed financial & strategic plans",
      screen: "business-plan" as ActiveScreen,
      icon: FileText,
      color: "from-yellow-500 to-amber-600"
    },
    {
      title: "Prompt Engineer",
      desc: "Compile and curate advanced visual styles",
      screen: "prompt-studio" as ActiveScreen,
      icon: Sliders,
      color: "from-amber-500 to-amber-700"
    }
  ];

  const valuePillars = [
    {
      title: "True Obsidian Contrast",
      desc: "Strictly bound to 100% true dark workspace styles using pure Obsidian bases (#090909) and selective golden Amber highlights.",
      icon: CheckCircle
    },
    {
      title: "Secured Server Proxies",
      desc: "No sensitive API tokens or Google Workspace secrets are exposed to client browsers. Node proxies shield your private infrastructure.",
      icon: UserCheck
    },
    {
      title: "Typography Pairings",
      desc: "Inter typography pairs cleanly with geometric monospaces (JetBrains Mono) for display stats, providing an uncompromised high-end look.",
      icon: Sparkles
    },
    {
      title: "Immutable Security Audits",
      desc: "Every model generation, user state change, or branding configuration update writes live logs to the central administrator panel.",
      icon: ShieldAlert
    }
  ];

  return (
    <div className="space-y-8 p-1 text-left selection:bg-amber-500 selection:text-black">
      {/* 1. TOP HEADER WITH GREETING */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none">
            Good afternoon, {currentUser.name.split(" ")[0]}
          </h2>
          <p className="text-xs text-zinc-500 mt-1.5">
            Optimize your administrative workspace. All systems are performing at sub-second latencies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider">
            Operational Server v3.5
          </span>
        </div>
      </div>

      {/* 2. CIRCULAR RADIAL HIGHLIGHTS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Widget 1: Models Available */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 relative flex flex-col items-center justify-between min-h-[190px] overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/[0.01] group-hover:bg-amber-500/[0.03] blur-lg rounded-full" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Available Engines</p>
          
          <div className="relative flex items-center justify-center my-3">
            {/* SVG circle */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="38" stroke="#1F1F1F" strokeWidth="4" fill="transparent" />
              <circle cx="48" cy="48" r="38" stroke="#F59E0B" strokeWidth="4.5" fill="transparent" 
                strokeDasharray={238} strokeDashoffset={0} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-extrabold text-white font-sans">5 / 5</span>
              <span className="text-[8px] text-zinc-500 uppercase tracking-wider">Allocated</span>
            </div>
          </div>

          <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> High Speed Channels Online
          </p>
        </div>

        {/* Widget 2: Credits Remaining */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 relative flex flex-col items-center justify-between min-h-[190px] overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/[0.01] group-hover:bg-amber-500/[0.03] blur-lg rounded-full" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Credits Balance</p>

          <div className="relative flex items-center justify-center my-3">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="38" stroke="#1F1F1F" strokeWidth="4" fill="transparent" />
              <circle cx="48" cy="48" r="38" stroke="#F59E0B" strokeWidth="4.5" fill="transparent" 
                strokeDasharray={238} strokeDashoffset={60} strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-base font-extrabold text-white font-numbers">{formatCredits(currentUser.credits)}</span>
              <span className="text-[8px] text-[#F59E0B] uppercase font-bold tracking-wider">Remaining</span>
            </div>
          </div>

          <p className="text-[10px] text-zinc-500">Auto-refresh schedule verified</p>
        </div>

        {/* Widget 3: Creations Counter */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 relative flex flex-col items-center justify-between min-h-[190px] overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/[0.01] group-hover:bg-amber-500/[0.03] blur-lg rounded-full" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Archived Assets</p>

          <div className="relative flex items-center justify-center my-3">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="38" stroke="#1F1F1F" strokeWidth="4" fill="transparent" />
              <circle cx="48" cy="48" r="38" stroke="#F59E0B" strokeWidth="4.5" fill="transparent" 
                strokeDasharray={238} strokeDashoffset={140} strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-extrabold text-white font-numbers">{loading ? "..." : assets.length}</span>
              <span className="text-[8px] text-zinc-500 uppercase tracking-wider">Generations</span>
            </div>
          </div>

          <p className="text-[10px] text-zinc-500">Saved in Node persistent memory</p>
        </div>
      </div>

      {/* 3. QUICK ACTIONS GRID CARDS */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] border-b border-[#1F1F1F] pb-2">
          Workspace Quick Actions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <div
                id={`quick-action-card-${i}`}
                key={i}
                onClick={() => setActiveScreen(action.screen)}
                className="bg-[#111111] border border-[#242424] hover:border-amber-500/30 p-5 rounded-2xl cursor-pointer transition-all duration-300 group flex flex-col justify-between hover:-translate-y-0.5 space-y-4"
              >
                <div className={`p-2.5 w-fit rounded-xl bg-gradient-to-br ${action.color} text-black shrink-0 shadow-lg shadow-amber-500/10 group-hover:scale-105 transition`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 text-left">
                  <h5 className="text-xs font-bold text-white group-hover:text-amber-500 transition">{action.title}</h5>
                  <p className="text-[10px] text-zinc-500 leading-normal">{action.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. WHY GOCHAT VALUE PILLARS */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] border-b border-[#1F1F1F] pb-2">
          Design & Operational Integrity
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {valuePillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div key={i} className="bg-[#111111] border border-[#242424] p-5 rounded-2xl flex gap-4 text-left items-start">
                <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold text-white">{pillar.title}</h5>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. MEMBERSHIP PROMOTIONAL BANNER */}
      {currentUser.tier !== "enterprise" && (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#111111] via-[#161616] to-[#111111] border border-amber-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-1/2 -translate-y-1/2 right-10 w-48 h-48 bg-amber-500/[0.04] blur-2xl rounded-full" />
          <div className="space-y-1.5 relative z-10 text-left">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-widest w-fit block font-mono">
              Upgrade Incentive
            </span>
            <h4 className="text-base font-bold text-white tracking-tight font-sans">
              Ready to unlock your full generative potential?
            </h4>
            <p className="text-xs text-zinc-400 max-w-xl">
              Upgrade your current account credentials to our VIP Membership and gain access to all systems, including sub-100ms response bands and Veo video frames.
            </p>
          </div>

          <button
            id="dashboard-upgrade-banner-btn"
            onClick={() => setActiveScreen("subscription")}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-amber-500/25 relative z-10 font-sans cursor-pointer shrink-0"
          >
            Claim VIP Membership
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
