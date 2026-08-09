import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  MessageSquare,
  Image as ImageIcon,
  TrendingUp,
  Play,
  Copy,
  Check,
  Sparkles,
  Cpu,
  Zap,
  RefreshCw,
  CheckCircle2
} from "lucide-react";

export default function InteractivePlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll-driven 3D unfold animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  // 3D Mouse Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const [activeTab, setActiveTab] = useState<"chat" | "image" | "strategy">("chat");
  const [chatPromptIndex, setChatPromptIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "1:1" | "9:16">("16:9");

  // Simulated Chat Prompts
  const chatPrompts = [
    {
      label: "TypeScript Retry Logic",
      prompt: "Build an async data fetcher with exponential backoff, rate limiting, and failure telemetry.",
      output: `// Gemini 3.5 Flash - Executive Code Generation
export async function fetchWithTelemetry<T>(
  url: string, 
  options: { retries?: number; delayMs?: number } = {}
): Promise<T> {
  const { retries = 3, delayMs = 500 } = options;
  let attempt = 0;

  while (attempt < retries) {
    try {
      attempt++;
      const res = await fetch(url, {
        headers: { 'X-AI-Engine': 'Gemini-3.5', 'X-Session-ID': 'lux_9901' }
      });
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return await res.json();
    } catch (err) {
      if (attempt >= retries) throw err;
      await new Promise(r => setTimeout(r, delayMs * Math.pow(2, attempt)));
    }
  }
  throw new Error("Max retries exceeded");
}`
    },
    {
      label: "React Custom Hook",
      prompt: "Create a reactive WebSocket hook with automatic reconnect and message ledger state.",
      output: `// Gemini 3.5 Flash - React Hook Architecture
import { useEffect, useState, useRef } from 'react';

export function useLiveSocket(endpoint: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(endpoint);
    socketRef.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onmessage = (e) => setMessages(prev => [...prev, JSON.parse(e.data)]);
    ws.onclose = () => setConnected(false);
    return () => ws.close();
  }, [endpoint]);

  return { messages, connected, socket: socketRef.current };
}`
    }
  ];

  // Trigger simulated regeneration
  const handleSimulate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 900);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(chatPrompts[chatPromptIndex].output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto py-4" style={{ perspective: "1400px" }}>
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformStyle: "preserve-3d"
        }}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full rounded-3xl bg-[#0D0D11] border border-[#262636] shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden font-sans relative"
      >
        {/* Glowing Top Edge Reflection */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent pointer-events-none z-30" />

        {/* Studio macOS-style Window Header */}
        <div className="bg-[#12121A] border-b border-[#22222E] px-4 py-3.5 flex flex-wrap items-center justify-between gap-3 relative z-20">
          {/* Left Window Control Buttons */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/40 shadow-sm shadow-rose-500/30" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40 shadow-sm shadow-amber-500/30" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40 shadow-sm shadow-emerald-500/30" />
            <span className="text-[11px] font-mono text-zinc-400 font-bold ml-2 hidden sm:inline-block">
              3D_STUDIO // GEMINI_STREAM_VIEW
            </span>
          </div>

          {/* Center Mode Selection Switcher */}
          <div className="flex items-center bg-[#09090D] p-1 rounded-2xl border border-zinc-800/80 shadow-inner">
            <button
              onClick={() => setActiveTab("chat")}
              className={`relative px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "chat" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {activeTab === "chat" && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-blue-600/30 border border-blue-500/40 rounded-xl shadow-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <MessageSquare className="w-3.5 h-3.5 text-blue-400 z-10" />
              <span className="z-10">AI Reasoning</span>
            </button>

            <button
              onClick={() => setActiveTab("image")}
              className={`relative px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "image" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {activeTab === "image" && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-amber-500/30 border border-amber-500/40 rounded-xl shadow-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <ImageIcon className="w-3.5 h-3.5 text-amber-400 z-10" />
              <span className="z-10">4K Image Render</span>
            </button>

            <button
              onClick={() => setActiveTab("strategy")}
              className={`relative px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "strategy" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {activeTab === "strategy" && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-emerald-500/30 border border-emerald-500/40 rounded-xl shadow-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 z-10" />
              <span className="z-10">Business Strategy</span>
            </button>
          </div>

          {/* Right Execution Trigger Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulate}
              disabled={isGenerating}
              className="px-4 py-1.5 text-xs font-extrabold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition duration-200 flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 fill-black ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Synthesizing..." : "Simulate Stream"}
            </button>
          </div>
        </div>

        {/* Main Interactive Studio Body */}
        <div className="p-6 md:p-8 min-h-[380px] bg-gradient-to-b from-[#0D0D11] via-[#0B0B0E] to-[#08080A] flex flex-col justify-between relative z-10">
          <AnimatePresence mode="wait">
            {/* TAB 1: AI REASONING / CHAT */}
            {activeTab === "chat" && (
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Preset Selector Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase mr-1">PROMPTS:</span>
                  {chatPrompts.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setChatPromptIndex(idx)}
                      className={`px-3 py-1 rounded-lg border text-[11px] font-medium transition ${
                        chatPromptIndex === idx
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold shadow-sm"
                          : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Chat Thread */}
                <div className="space-y-4">
                  {/* User Input Bubble */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md">
                      U
                    </div>
                    <div className="bg-[#15151F] border border-zinc-800/80 p-4 rounded-2xl text-xs sm:text-sm text-zinc-200 max-w-2xl shadow-lg leading-relaxed font-sans">
                      {chatPrompts[chatPromptIndex].prompt}
                    </div>
                  </div>

                  {/* AI Assistant Output Bubble */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-black flex items-center justify-center text-xs font-black flex-shrink-0 shadow-lg shadow-amber-500/20">
                      AI
                    </div>
                    <div className="w-full max-w-3xl bg-[#0A0A0E] border border-blue-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden group">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 text-[11px] font-mono">
                        <div className="flex items-center gap-2 text-blue-400 font-bold">
                          <Cpu className="w-3.5 h-3.5" />
                          <span>Gemini 3.5 Flash Reasoning</span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                            0.35s Latency
                          </span>
                        </div>

                        <button
                          onClick={handleCopyCode}
                          className="flex items-center gap-1 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md transition text-[10px]"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copied ? "Copied" : "Copy Code"}</span>
                        </button>
                      </div>

                      {/* Code Container */}
                      <div className="relative">
                        <pre className="bg-[#050508] border border-zinc-800/80 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                          {isGenerating ? (
                            <div className="flex items-center gap-2 py-6 text-amber-400 animate-pulse">
                              <Sparkles className="w-4 h-4" />
                              <span>Synthesizing 3D multi-model code stream...</span>
                            </div>
                          ) : (
                            <code>{chatPrompts[chatPromptIndex].output}</code>
                          )}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: 4K IMAGE RENDER STUDIO */}
            {activeTab === "image" && (
              <motion.div
                key="image-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Controls Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111118] border border-amber-500/20 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-amber-400 font-mono font-bold uppercase">ASPECT RATIO:</span>
                    {(["16:9", "1:1", "9:16"] as const).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                          aspectRatio === ratio
                            ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                            : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                    <span>MODEL: <strong>Imagen-3 Pro</strong></span>
                    <span>SEED: <strong>994102</strong></span>
                  </div>
                </div>

                {/* Render Canvas Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[#07070A] border border-amber-500/30 p-6 rounded-2xl">
                  {/* Visual Image Render Mock */}
                  <div className="relative aspect-video rounded-2xl bg-gradient-to-tr from-amber-600/40 via-purple-600/20 to-blue-600/40 border border-amber-500/40 flex flex-col items-center justify-center p-6 text-center overflow-hidden group shadow-2xl">
                    {/* Subtle Grid overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />

                    {isGenerating ? (
                      <div className="space-y-3 relative z-10">
                        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                        <p className="text-xs font-mono text-amber-300 font-bold">Rendering 3D Depth Layers...</p>
                      </div>
                    ) : (
                      <div className="space-y-3 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-black/60 border border-amber-400/50 flex items-center justify-center mx-auto shadow-xl backdrop-blur-md">
                          <Sparkles className="w-7 h-7 text-amber-400" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full uppercase">
                            4K ULTRA RENDER
                          </span>
                          <p className="text-white font-bold text-sm mt-2 font-sans">"Cyberpunk Obsidian Gold 3D Portal"</p>
                        </div>
                      </div>
                    )}

                    {/* Corner Resolution Watermark */}
                    <div className="absolute bottom-3 right-3 text-[9px] font-mono bg-black/80 px-2 py-1 rounded text-zinc-400 border border-zinc-800">
                      3840 x 2160 (4K)
                    </div>
                  </div>

                  {/* Render Parameters & Status Metadata */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      3D Asset Render Specifications
                    </h4>

                    <div className="space-y-2.5 text-xs text-zinc-300 font-mono">
                      <div className="flex justify-between p-2.5 bg-[#101017] rounded-xl border border-zinc-800">
                        <span className="text-zinc-500">Prompt Style</span>
                        <span className="text-amber-400 font-bold">Photorealistic Obsidian</span>
                      </div>
                      <div className="flex justify-between p-2.5 bg-[#101017] rounded-xl border border-zinc-800">
                        <span className="text-zinc-500">Synthesis Time</span>
                        <span className="text-emerald-400 font-bold">1.18 seconds</span>
                      </div>
                      <div className="flex justify-between p-2.5 bg-[#101017] rounded-xl border border-zinc-800">
                        <span className="text-zinc-500">Token Cost</span>
                        <span className="text-blue-400 font-bold">15 Credits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: BUSINESS STRATEGY */}
            {activeTab === "strategy" && (
              <motion.div
                key="strategy-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-[#07070A] border border-emerald-500/30 p-6 rounded-2xl space-y-5">
                  <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-4 gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                        EXECUTIVE BUSINESS MODEL
                      </span>
                      <h3 className="text-base font-bold text-white">AI-Powered SaaS Venture Strategy</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Viability Index:</span>
                      <span className="text-xl font-extrabold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
                        98.5 / 100
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                    <div className="bg-[#101017] border border-zinc-800 p-4 rounded-xl space-y-1">
                      <span className="text-[10px] text-zinc-500">PRIMARY DEMOGRAPHIC</span>
                      <p className="text-xs font-bold text-white font-sans">High-Growth Tech Startups</p>
                      <span className="text-[10px] text-emerald-400 block pt-1">94% Target Match</span>
                    </div>

                    <div className="bg-[#101017] border border-zinc-800 p-4 rounded-xl space-y-1">
                      <span className="text-[10px] text-zinc-500">PROJECTED YEAR 1 ARR</span>
                      <p className="text-sm font-bold text-emerald-400">₹45.2 Lakhs</p>
                      <span className="text-[10px] text-zinc-400 block pt-1">Based on 1.5k Subscribers</span>
                    </div>

                    <div className="bg-[#101017] border border-zinc-800 p-4 rounded-xl space-y-1">
                      <span className="text-[10px] text-zinc-500">RISK MITIGATION</span>
                      <p className="text-xs font-bold text-blue-400">Low Operational Risk</p>
                      <span className="text-[10px] text-emerald-400 block pt-1">99.9% Server Uptime</span>
                    </div>
                  </div>

                  <div className="bg-[#0C0C12] p-4 rounded-xl border border-zinc-800 space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-400">Strategic Feasibility Index</span>
                      <span className="text-emerald-400 font-bold">98.5%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full rounded-full w-[98.5%]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Status Bar */}
          <div className="pt-6 mt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>3D Interactive playground connected to live Gemini API proxy</span>
            </div>

            <div className="flex items-center gap-1 font-bold text-amber-400">
              <span>Ready for full production access?</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
