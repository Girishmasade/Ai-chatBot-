import React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Zap,
  Cpu,
  Shield,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  FolderLock,
  Boxes
} from "lucide-react";
import LuxuryOrb from "../components/LuxuryOrb";
import EcosystemDiagram from "../components/EcosystemDiagram";
import InteractivePlayground from "../components/InteractivePlayground";
import { ActiveScreen } from "../types";
import { useGetConfigQuery } from "../redux/api/apiSlice";

interface LandingPageProps {
  onEnterApp: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export default function LandingPage({ onEnterApp, setActiveScreen }: LandingPageProps) {
  const { data: configData } = useGetConfigQuery();
  const branding = configData?.branding || (configData as any)?.data?.branding;

  // Stagger animation helpers
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  } as const;

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col selection:bg-amber-500 selection:text-black overflow-x-hidden relative font-sans">
      {/* Background Vector Glow & Ambient Grid Lines */}
      <div className="absolute top-0 left-0 right-0 h-[700px] bg-gradient-to-b from-amber-500/[0.06] via-amber-500/[0.01] to-transparent pointer-events-none" />
      <div className="absolute top-[15%] left-[-10%] w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-blue-500/[0.025] rounded-full blur-[160px] pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f12_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      {/* Landing Navbar */}
      <nav className="border-b border-[#1F1F1F]/70 backdrop-blur-xl sticky top-0 z-50 bg-[#090909]/85 h-16 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          {branding?.mainLogo || branding?.logoImage ? (
            <img 
              src={branding.mainLogo || branding.logoImage} 
              alt="Brand Logo" 
              className="h-8 max-w-[140px] object-contain" 
            />
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm font-bold tracking-wider text-white font-mono">
                {branding?.appName || "GoChat AI"}
              </span>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs">
          <a href="#ecosystem" className="text-zinc-400 hover:text-amber-400 transition-colors duration-200 font-medium flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            Ecosystem Architecture
          </a>
          <a href="#live-demo" className="text-zinc-400 hover:text-amber-400 transition-colors duration-200 font-medium flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            Live Preview
          </a>
          <a href="#services" className="text-zinc-400 hover:text-white transition-colors duration-200 font-medium flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-emerald-400" />
            Our Services
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen("auth")}
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg transition"
          >
            Sign In
          </button>

          <button
            id="landing-nav-btn-enter"
            onClick={onEnterApp}
            className="px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.02] active:scale-[0.98]"
          >
            Enter Workspace
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12 z-10 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 text-left space-y-6 md:max-w-xl"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 text-amber-400 text-[10px] font-extrabold tracking-widest uppercase rounded-full shadow-inner"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>Next-Gen Multi-Model AI Engine</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08] font-sans"
          >
            The Luxury Standard <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">
              For Generative AI
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-lg"
          >
            Experience dynamic conversational reasoning, 4K multi-aspect image creation, and venture business strategy models—seamlessly orchestrated inside our flagship obsidian signature workspace.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3.5 pt-2">
            <button
              id="hero-btn-launch"
              onClick={onEnterApp}
              className="px-7 py-4 text-xs font-extrabold text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Launch Workspace Now
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#ecosystem"
              className="px-6 py-4 text-xs font-bold text-zinc-300 hover:text-white bg-[#121212] border border-[#262626] hover:border-amber-500/40 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
            >
              Explore Architecture
            </a>
          </motion.div>

          {/* Quick Metrics Bar */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-[#1F1F1F]/80"
          >
            <div className="bg-[#111111]/60 border border-zinc-800/60 p-3 rounded-xl">
              <p className="text-lg md:text-xl font-extrabold text-white tracking-tight font-mono text-amber-400">0.38s</p>
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mt-0.5">Average Latency</p>
            </div>
            <div className="bg-[#111111]/60 border border-zinc-800/60 p-3 rounded-xl">
              <p className="text-lg md:text-xl font-extrabold text-white tracking-tight font-mono text-blue-400">10M+</p>
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mt-0.5">Tokens Processed</p>
            </div>
            <div className="bg-[#111111]/60 border border-zinc-800/60 p-3 rounded-xl">
              <p className="text-lg md:text-xl font-extrabold text-white tracking-tight font-mono text-emerald-400">99.9%</p>
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mt-0.5">Uptime SLA</p>
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Luxury Orb Simulator with Animated Status Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 flex items-center justify-center relative min-h-[420px] w-full"
        >
          {/* Radial Backing Glow */}
          <div className="absolute inset-0 bg-radial-gradient from-amber-500/[0.08] via-amber-500/[0.02] to-transparent blur-3xl pointer-events-none" />
          
          <LuxuryOrb size={380} />

          {/* Floating Live Tech Status Tags */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-6 right-2 sm:right-6 p-2.5 bg-[#111111]/90 border border-amber-500/30 rounded-xl backdrop-blur-md text-[10px] font-mono text-amber-300 shadow-xl shadow-amber-500/10 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SYS_MODEL // GEMINI_3.5_READY</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-6 left-2 sm:left-6 p-2.5 bg-[#111111]/90 border border-blue-500/30 rounded-xl backdrop-blur-md text-[10px] font-mono text-blue-300 shadow-xl shadow-blue-500/10 flex items-center gap-2"
          >
            <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>ENCRYPTED_VAULT // AES-256</span>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-2 right-12 hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-emerald-500/30 rounded-full text-[10px] font-bold text-emerald-400 shadow-lg"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Operational Status</span>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: Dynamic Ecosystem Curved Branch Diagram (From user image requirement) */}
      <section id="ecosystem" className="py-16 bg-[#0B0B0D] border-y border-[#1F1F1F]/70 relative">
        <EcosystemDiagram onSelectFeature={() => onEnterApp()} />
      </section>

      {/* SECTION 3: Live Interactive Playground / Studio */}
      <section id="live-demo" className="py-20 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-wider uppercase rounded-full">
            <Terminal className="w-3 h-3" />
            Interactive Workspace Studio
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Test The AI Capabilities In Real-Time
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Select interactive prompts, inspect stream latencies, and preview live multi-model responses below.
          </p>
        </div>

        {/* Studio Window Component */}
        <InteractivePlayground />
      </section>

      {/* SECTION 4: Comprehensive Core Services Offered (Services Showcase) */}
      <section id="services" className="py-24 bg-[#0C0C0E] border-y border-[#1F1F1F]/70 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-extrabold tracking-widest uppercase rounded-full">
              <Boxes className="w-3.5 h-3.5" />
              Core Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our AI Services Suite
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Discover the full spectrum of intelligent generative tools built directly into our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1: AI Reasoning & Code Chat */}
            <div className="bg-[#121216] border border-[#22222E] p-8 rounded-3xl space-y-6 hover:border-blue-500/40 transition duration-300 shadow-xl group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-blue-500/15 text-blue-400 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                  GEMINI 3.5 FLASH
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Conversational AI & Code Intelligence</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Engage in multi-turn reasoning with contextual awareness. Generate production-ready code, diagnose complex software bugs, and format structured technical documentation.
                </p>
              </div>
              <ul className="space-y-2.5 pt-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Real-time code refactoring & bug fixing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Multi-turn conversational context memory</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Structured JSON & Markdown report generation</span>
                </li>
              </ul>
              <button
                onClick={onEnterApp}
                className="w-full py-3 text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition flex items-center justify-center gap-2"
              >
                Launch Chat Assistant <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Service 2: Image Studio */}
            <div className="bg-[#121216] border border-[#22222E] p-8 rounded-3xl space-y-6 hover:border-amber-500/40 transition duration-300 shadow-xl group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-amber-500/15 text-amber-400 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  4K ULTRA RENDER
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">4K Visual Image Studio</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Synthesize stunning high-resolution digital artwork and branding graphics. Pick custom aspect ratios, download lossless PNG files, and store generated assets directly in your workspace gallery.
                </p>
              </div>
              <ul className="space-y-2.5 pt-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Photorealistic 4K graphic render engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Flexible aspect ratios (16:9, 1:1, 9:16)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Direct asset library sync & instant download</span>
                </li>
              </ul>
              <button
                onClick={onEnterApp}
                className="w-full py-3 text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition flex items-center justify-center gap-2"
              >
                Open Image Studio <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Service 3: Venture Business Strategist */}
            <div className="bg-[#121216] border border-[#22222E] p-8 rounded-3xl space-y-6 hover:border-emerald-500/40 transition duration-300 shadow-xl group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  MARKET ANALYTICS
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Venture Business Strategist</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Generate comprehensive commercial business plans. Compiles target demographic profiles, 12-month revenue forecasts, operational milestones, and risk mitigation strategies.
                </p>
              </div>
              <ul className="space-y-2.5 pt-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Demographic profiling & target market sizing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Financial revenue projections & budget planning</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Viability scoring & feasibility reports</span>
                </li>
              </ul>
              <button
                onClick={onEnterApp}
                className="w-full py-3 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition flex items-center justify-center gap-2"
              >
                Create Strategy Plan <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Service 4: Secure Vault & File Attachments */}
            <div className="bg-[#121216] border border-[#22222E] p-8 rounded-3xl space-y-6 hover:border-purple-500/40 transition duration-300 shadow-xl group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-violet-600" />
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-purple-500/15 text-purple-400 group-hover:scale-110 transition-transform">
                  <FolderLock className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                  VAULT SECURITY
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Encrypted Context & File Vault</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Attach context documents, source code files, and images directly into your prompt pipeline. All stored data is shielded with end-to-end encryption.
                </p>
              </div>
              <ul className="space-y-2.5 pt-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Multi-modal file attachment processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>AES-256 encrypted credit ledger protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Historical conversation & asset retrieval</span>
                </li>
              </ul>
              <button
                onClick={onEnterApp}
                className="w-full py-3 text-xs font-bold text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl transition flex items-center justify-center gap-2"
              >
                Access Secure Vault <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Luxury Design Philosophy Section */}
      <section id="luxury-design" className="py-20 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Luxury Design Philosophy</h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              Obsidian Grayscale With Warm Amber Highlights
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We reject chaotic multi-colored displays. GoChat AI strictly implements our elite *Black Amber* scheme, where beautiful near-black slate backgrounds pair with the rich, singular entry signature of pure warm gold indicators.
            </p>
            <div className="space-y-4 pt-3">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 mt-1">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Privacy-First Security</h4>
                  <p className="text-[11px] text-[#71717A]">Complete data protection and encrypted asset storage.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 mt-1">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">High-Performance Routing</h4>
                  <p className="text-[11px] text-[#71717A]">Optimized model proxy execution with sub-second response times.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 relative w-full">
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-mono text-[#52525B] mb-4">// PALETTE DEPLOYMENT</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-[#090909] border border-[#1F1F1F] rounded-xl">
                <span className="text-xs font-medium text-zinc-300">Obsidian Base Black</span>
                <span className="text-xs font-mono text-zinc-500">#090909</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-[#151515] border border-[#1F1F1F] rounded-xl">
                <span className="text-xs font-medium text-zinc-300">Obsidian Elevated Card</span>
                <span className="text-xs font-mono text-zinc-500">#151515</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                <span className="text-xs font-bold">Premium Accent Amber</span>
                <span className="text-xs font-mono font-bold">#F59E0B</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CMS Section */}
      <footer className="border-t border-[#1F1F1F] bg-[#0C0C0C] py-12 px-6 md:px-12 mt-auto z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center">
            <img className="w-4 h-4" src="/favicon.png" alt="logo" />
            </div>
            <span className="text-xs text-zinc-500">
              © 2026 GoChat AI Platform. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <a href="#ecosystem" className="text-zinc-500 hover:text-amber-400 font-medium transition">
              Ecosystem
            </a>
            <a href="#services" className="text-zinc-500 hover:text-amber-400 font-medium transition">
              Services Suite
            </a>
            <a href="#live-demo" className="text-zinc-500 hover:text-amber-400 font-medium transition">
              Interactive Studio
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
