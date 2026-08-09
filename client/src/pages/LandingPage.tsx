import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Zap,
  Cpu,
  Shield,
  ArrowRight,
  ArrowUp,
  TrendingUp,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  FolderLock,
  Boxes,
  MousePointer,
  Code2,
  Globe
} from "lucide-react";
import LuxuryOrb from "../components/LuxuryOrb";
import EcosystemDiagram from "../components/EcosystemDiagram";
import InteractivePlayground from "../components/InteractivePlayground";
import Background3D from "../components/Background3D";
import Tilt3DCard from "../components/Tilt3DCard";
import Interactive3DShowcase from "../components/Interactive3DShowcase";
import BranchingServicesTree from "../components/BranchingServicesTree";
import { ActiveScreen } from "../types";
import { useGetConfigQuery } from "../redux/api/apiSlice";

interface LandingPageProps {
  onEnterApp: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export default function LandingPage({ onEnterApp, setActiveScreen }: LandingPageProps) {
  const { data: configData } = useGetConfigQuery();
  const branding = configData?.branding || (configData as any)?.data?.branding;

  // Scroll Progress and Scroll State Tracking
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 40);
      setShowScrollTop(latest > 350);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Parallax Scroll Transformations
  const heroOrbY = useTransform(scrollYProgress, [0, 0.4], [0, 90]);
  const heroOrbOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.35]);
  const bgGradientY = useTransform(scrollYProgress, [0, 1], [0, 250]);

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
    <div className="min-h-screen bg-[#090909] text-white flex flex-col selection:bg-amber-500 selection:text-black overflow-x-hidden relative font-sans scroll-smooth">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 z-50 origin-left shadow-[0_0_12px_rgba(245,158,11,0.8)]"
        style={{ scaleX }}
      />

      {/* 3D Background Canvas */}
      <Background3D />

      {/* Background Vector Glow & Ambient Grid Lines */}
      <motion.div
        style={{ y: bgGradientY }}
        className="absolute top-0 left-0 right-0 h-[700px] bg-gradient-to-b from-amber-500/[0.06] via-amber-500/[0.01] to-transparent pointer-events-none z-0"
      />
      <div className="absolute top-[15%] left-[-10%] w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-blue-500/[0.025] rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f12_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" 
      />

      {/* Landing Navbar */}
      <nav
        className={`border-b sticky top-0 z-40 h-16 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${
          isScrolled
            ? "bg-[#090909]/90 backdrop-blur-2xl border-amber-500/20 shadow-xl shadow-amber-500/5"
            : "bg-[#090909]/60 backdrop-blur-md border-[#1F1F1F]/70"
        }`}
      >
        <div className="flex items-center gap-3">
          {branding?.mainLogo || branding?.logoImage ? (
            <img 
              src={branding.mainLogo || branding.logoImage} 
              alt={branding?.appName || "Brand Logo"} 
              className="h-8 max-w-[160px] object-contain" 
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

        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold">
          <a href="#ecosystem" className="text-zinc-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            Ecosystem
          </a>
          <a href="#live-demo" className="text-zinc-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            Live Preview
          </a>
          <a href="#workbench" className="text-zinc-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-1.5">
            <MousePointer className="w-3.5 h-3.5 text-amber-400" />
            3D Workbench
          </a>
          <a href="#features" className="text-zinc-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-emerald-400" />
            Services Tree
          </a>
          <a href="#services" className="text-zinc-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Services Suite
          </a>
          <a href="#luxury-design" className="text-zinc-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            Design
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
      <section className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-14 z-10 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 text-left space-y-6 lg:max-w-xl"
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
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] font-sans"
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
            Experience dynamic conversational reasoning, 4K multi-aspect image creation, and venture business strategy models—seamlessly orchestrated inside our flagship Black Amber signature workspace.
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

            <a
              href="#workbench"
              className="px-6 py-4 text-xs font-bold text-zinc-300 hover:text-white bg-[#111111] border border-[#242424] hover:border-amber-500/40 rounded-xl transition flex items-center justify-center gap-2"
            >
              <MousePointer className="w-3.5 h-3.5 text-amber-400" />
              Try 3D Workbench
            </a>
          </motion.div>

          {/* Key Performance Stats */}
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

        {/* 3D Orb Stage */}
        <motion.div
          style={{ y: heroOrbY, opacity: heroOrbOpacity }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 flex items-center justify-center relative min-h-[440px] w-full"
        >
          <div className="absolute inset-0 bg-radial-gradient from-amber-500/[0.08] via-amber-500/[0.02] to-transparent blur-3xl pointer-events-none" />
          
          <LuxuryOrb size={390} />

          {/* Floating Status Badges */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 right-2 sm:right-6 p-3 bg-[#111111]/90 backdrop-blur-md border border-amber-500/30 rounded-xl pointer-events-none shadow-2xl text-[10px] font-mono text-amber-300 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="font-bold text-amber-400 block">NEURAL CORE // ACTIVE</span>
              <span className="text-[9px] text-zinc-400">SYS_MODEL // GEMINI_3.5_READY</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-6 left-2 sm:left-6 p-3 bg-[#111111]/90 backdrop-blur-md border border-blue-500/30 rounded-xl pointer-events-none shadow-2xl text-[10px] font-mono text-blue-300 flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">EDGE PROXY ROUTE</span>
              <span className="text-[9px] text-emerald-400">LATENCY &lt; 0.4s (AES-256)</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: Dynamic Ecosystem Curved Branch Diagram */}
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

        <InteractivePlayground />
      </section>

      {/* SECTION 4: 3D Workbench Sandbox */}
      <motion.div
        id="workbench"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Interactive3DShowcase />
      </motion.div>

      {/* SECTION 5: Branching Services Tree UI */}
      <motion.div
        id="features"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-[#0C0C0C]/80 border-y border-[#1F1F1F]/80 backdrop-blur-md"
      >
        <BranchingServicesTree />
      </motion.div>

      {/* SECTION 6: Comprehensive Core Services Offered */}
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

      {/* SECTION 7: Luxury Design Philosophy Section */}
      <motion.section
        id="luxury-design"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-24 max-w-7xl mx-auto px-6 md:px-12 z-10 relative"
      >
        <div className="flex flex-col lg:flex-row items-center gap-14">
          <div className="flex-1 space-y-6 text-left">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold text-amber-500 uppercase tracking-widest"
            >
              Luxury Design & Architecture
            </motion.h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Obsidian Grayscale With Signature Warm Amber Highlights
            </h3>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
              We strictly enforce our signature Black Amber scheme. High-contrast obsidian slate backgrounds engineered alongside warm gold indicators deliver an unparalleled executive visual aesthetic.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Tilt3DCard maxTilt={10}>
                  <div className="p-4 bg-[#111111] border border-[#1F1F1F] rounded-xl space-y-2 hover:border-amber-500/30 transition">
                    <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white">Privacy & Security Compliance</h4>
                    <p className="text-[11px] text-zinc-500">Robust admin controls and zero third-party data tracking.</p>
                  </div>
                </Tilt3DCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Tilt3DCard maxTilt={10}>
                  <div className="p-4 bg-[#111111] border border-[#1F1F1F] rounded-xl space-y-2 hover:border-amber-500/30 transition">
                    <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white">Edge Accelerated Telemetry</h4>
                    <p className="text-[11px] text-zinc-500">Server-side proxy routes shield secret parameters.</p>
                  </div>
                </Tilt3DCard>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full"
          >
            <Tilt3DCard maxTilt={8}>
              <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-7 relative shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b border-[#1F1F1F] pb-4">
                  <span className="text-[11px] font-mono text-zinc-400 font-bold">// BRAND DESIGN PALETTE</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-mono">LIVE_SPEC</span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between p-4 bg-[#090909] border border-[#1F1F1F] rounded-xl hover:border-amber-500/20 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-[#090909] border border-zinc-700" />
                      <span className="text-xs font-semibold">Obsidian Base Black</span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">#090909</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#151515] border border-[#1F1F1F] rounded-xl hover:border-amber-500/20 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-[#151515] border border-zinc-600" />
                      <span className="text-xs font-semibold">Obsidian Elevated Card</span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">#151515</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl shadow-lg shadow-amber-500/5">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-[#F59E0B] shadow-sm shadow-amber-500" />
                      <span className="text-xs font-extrabold">Signature Accent Amber</span>
                    </div>
                    <span className="text-xs font-mono font-extrabold">#F59E0B</span>
                  </div>
                </div>
              </div>
            </Tilt3DCard>
          </motion.div>
        </div>
      </motion.section>

      {/* 3D Launch Banner Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="py-16 max-w-7xl mx-auto px-6 md:px-12 w-full z-10 relative"
      >
        <Tilt3DCard maxTilt={6}>
          <div className="relative rounded-3xl bg-gradient-to-r from-[#141414] via-[#1A1812] to-[#141414] border border-amber-500/30 p-8 sm:p-14 overflow-hidden text-center space-y-6 shadow-2xl shadow-amber-500/10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase rounded-full">
              <Boxes className="w-3.5 h-3.5" />
              Instant Workspace Access
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready To Experience The Standard?
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Launch into our zero-latency AI matrix and elevate your workflow with conversational chat, visual graphics, and strategic business planning.
            </p>

            <div className="pt-2 flex justify-center">
              <button
                onClick={onEnterApp}
                className="px-8 py-4 text-xs font-extrabold text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 rounded-xl transition duration-300 flex items-center gap-2 shadow-xl shadow-amber-500/25 active:scale-95"
              >
                Launch Workspace Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Tilt3DCard>
      </motion.section>

      {/* Footer CMS Section */}
      <footer className="border-t border-[#1F1F1F] bg-[#0C0C0C] py-12 px-6 md:px-12 mt-auto z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded flex items-center justify-center">
              <img className="w-4 h-4" src="/favicon.png" alt="logo" />
            </div>
            <span className="text-xs text-zinc-500 font-medium">
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
            <span
              onClick={() => setActiveScreen("admin")}
              className="text-[10px] text-zinc-600 hover:text-amber-400 cursor-pointer uppercase tracking-wider font-bold transition"
            >
              System Controls
            </span>
          </div>
        </div>
      </footer>

      {/* Floating Back-To-Top Scroll Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-to-top-btn"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)" }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-[#111111]/90 border border-amber-500/40 text-amber-400 backdrop-blur-md shadow-2xl transition duration-300 flex items-center justify-center group"
            title="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
