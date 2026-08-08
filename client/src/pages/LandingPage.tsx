import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Zap,
  Cpu,
  Lock,
  ArrowRight,
  ArrowUp,
  TrendingUp,
  MessageSquare,
  Image as ImageIcon,
  Shield,
  FileText,
  MousePointer,
  Layers,
  Activity,
  Code2,
  CheckCircle2,
  Boxes,
  Globe
} from "lucide-react";
import LuxuryOrb from "../components/LuxuryOrb";
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
        staggerChildren: 0.1
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } }
  } as const;

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col selection:bg-amber-500 selection:text-black overflow-x-hidden relative scroll-smooth">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 z-50 origin-left shadow-[0_0_12px_rgba(245,158,11,0.8)]"
        style={{ scaleX }}
      />

      {/* 3D Background Canvas */}
      <Background3D />

      {/* Background vector gradient accents with parallax shift */}
      <motion.div
        style={{ y: bgGradientY }}
        className="absolute top-0 left-0 right-0 h-[700px] bg-gradient-to-b from-amber-500/[0.06] via-transparent to-transparent pointer-events-none z-0"
      />
      <div className="absolute top-[15%] left-[-10%] w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[650px] h-[650px] bg-amber-500/[0.025] rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Dynamic Landing Navbar */}
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
            <>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm font-extrabold tracking-wider text-white hidden sm:inline-block">
                {branding?.appName || branding?.logoName || "GoChat AI"}
              </span>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold">
          <a href="#features" className="text-zinc-400 hover:text-amber-400 transition duration-200">
            Capabilities
          </a>
          <a href="#workbench" className="text-zinc-400 hover:text-amber-400 transition duration-200">
            3D Workbench
          </a>
          <a href="#luxury-design" className="text-zinc-400 hover:text-amber-400 transition duration-200">
            Design Philosophy
          </a>
        </div>

        <button
          id="landing-nav-btn-enter"
          onClick={onEnterApp}
          className="px-4 py-2 text-xs font-extrabold text-black bg-amber-500 hover:bg-amber-400 rounded-xl transition duration-250 flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
        >
          Enter Workspace
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-14 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 text-left space-y-6 lg:max-w-xl"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold tracking-widest uppercase rounded-full shadow-inner"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            Next-Gen Multimodal AI Platform
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] font-sans"
          >
            The Premier Standard <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600">
              For Generative AI
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-lg"
          >
            Experience instant conversational intelligence, studio-grade 3D art rendering, and venture-level business strategy logs—engineered within our flagship Black Amber signature workspace.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              id="hero-btn-launch"
              onClick={onEnterApp}
              className="px-6 py-4 text-xs font-black text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 rounded-xl transition duration-300 flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/20 active:scale-95"
            >
              Initialize Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#workbench"
              className="px-6 py-4 text-xs font-bold text-zinc-300 hover:text-white bg-[#111111] border border-[#242424] hover:border-amber-500/40 rounded-xl transition flex items-center justify-center gap-2"
            >
              <MousePointer className="w-3.5 h-3.5 text-amber-400" />
              Try 3D Live Workbench
            </a>
          </motion.div>

          {/* Key Performance Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-6 pt-8 border-t border-[#1F1F1F]"
          >
            <div>
              <p className="text-xl font-extrabold text-white tracking-tight font-mono text-amber-400">0.38s</p>
              <p className="text-[10px] text-zinc-500 uppercase font-extrabold tracking-wider mt-1">Average Latency</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-white tracking-tight font-mono text-amber-400">99.9%</p>
              <p className="text-[10px] text-zinc-500 uppercase font-extrabold tracking-wider mt-1">Enterprise Uptime</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-white tracking-tight font-mono text-amber-400">100%</p>
              <p className="text-[10px] text-zinc-500 uppercase font-extrabold tracking-wider mt-1">Encrypted Telemetry</p>
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Orb Interactive Simulator Stage with Scroll Parallax */}
        <motion.div
          style={{ y: heroOrbY, opacity: heroOrbOpacity }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 flex items-center justify-center relative min-h-[440px] w-full"
        >
          <div className="absolute inset-0 bg-radial-gradient from-amber-500/[0.05] to-transparent blur-3xl pointer-events-none" />

          {/* 3D Core Sphere */}
          <LuxuryOrb size={390} />

          {/* Dynamic 3D Floating Glassmorphic HUD Badges */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 right-2 sm:right-6 p-3 bg-[#111111]/90 backdrop-blur-md border border-[#242424] rounded-xl pointer-events-none shadow-2xl text-[10px] font-mono text-zinc-300 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="font-bold text-amber-400 block">NEURAL CORE // ACTIVE</span>
              <span className="text-[9px] text-zinc-500">GYRO MATRIX ONLINE</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-6 left-2 sm:left-6 p-3 bg-[#111111]/90 backdrop-blur-md border border-[#242424] rounded-xl pointer-events-none shadow-2xl text-[10px] font-mono text-zinc-300 flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">EDGE PROXY ROUTE</span>
              <span className="text-[9px] text-emerald-400">LATENCY &lt; 0.4s</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/2 -left-4 sm:left-0 -translate-y-1/2 p-2.5 bg-[#111111]/80 backdrop-blur-md border border-[#242424] rounded-xl pointer-events-none shadow-xl text-[9px] font-mono text-amber-400"
          >
            PARALLAX_3D: ACTIVE
          </motion.div>
        </motion.div>
      </section>

      {/* 3D Workbench Interactive Sandbox - Scroll Reveal */}
      <motion.div
        id="workbench"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Interactive3DShowcase />
      </motion.div>

      {/* Branching Services Tree UI - Scroll Reveal */}
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

      {/* Luxury Design Philosophy & Telemetry Section - Scroll Reveal */}
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

      {/* 3D Launch Banner Section - Scroll Reveal */}
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
              © 2026 GoChat AI Platform. All rights to prestige reserved.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span
              onClick={() => setActiveScreen("admin")}
              className="text-[10px] text-zinc-600 hover:text-amber-400 cursor-pointer uppercase tracking-wider font-bold transition"
            >
              System Controls
            </span>
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">
              Secure Encrypted Connection
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
