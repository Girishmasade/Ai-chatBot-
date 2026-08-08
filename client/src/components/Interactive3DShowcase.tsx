import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Sparkles,
  ImageIcon,
  FileText,
  Terminal,
  Send,
  Cpu,
  ShieldCheck,
  Zap,
  Play,
  Layers,
  BarChart3,
  CheckCircle2
} from "lucide-react";
import Tilt3DCard from "./Tilt3DCard";

export default function Interactive3DShowcase() {
  const [activeTab, setActiveTab] = useState<"chat" | "image" | "venture">("chat");
  const [chatInput, setChatInput] = useState("Analyze quantum latency metrics & optimize model output");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string; time: string }>>([
    {
      sender: "user",
      text: "How does the Black Amber neural architecture ensure zero latency?",
      time: "14:40"
    },
    {
      sender: "ai",
      text: "Our server-side proxy routes bypass client bottlenecking through optimized edge workers. Benchmark latency sits consistently at 0.38s across all model endpoints.",
      time: "14:40"
    }
  ]);

  const [selectedStyle, setSelectedStyle] = useState("Obsidian Gold");
  const [generatedRatio, setGeneratedRatio] = useState("16:9");

  const handleSimulateChat = () => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg, time: "Just now" }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: `[SYS_OK]: Successfully parsed request for "${userMsg.slice(0, 30)}...". All parameters verified under 100% encrypted telemetry.`,
          time: "Just now"
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <section className="py-24 relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold tracking-wider uppercase rounded-full">
          <Sparkles className="w-3 h-3 animate-spin" />
          Interactive 3D Workbench
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
          Test The Suite In <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">3D Real-Time</span>
        </h2>
        <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mx-auto">
          Experience our high-speed generation capabilities directly below. Click tabs to switch suites or simulate direct AI interactions.
        </p>
      </div>

      {/* Main 3D Container Showcase */}
      <div className="relative">
        {/* Floating 3D Metadata Chips */}
        <div className="hidden lg:block absolute -top-8 -left-6 z-30 p-3 bg-[#111111]/90 backdrop-blur-md border border-[#262626] rounded-xl shadow-2xl pointer-events-none text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Cpu className="w-4 h-4" />
            <span>NEURAL MATRIX // v4.2</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">Real-time edge response active</p>
        </div>

        <div className="hidden lg:block absolute -bottom-6 -right-6 z-30 p-3 bg-[#111111]/90 backdrop-blur-md border border-[#262626] rounded-xl shadow-2xl pointer-events-none text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% ENCRYPTED DATA</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">Zero third-party data logging</p>
        </div>

        <Tilt3DCard maxTilt={8} className="w-full">
          <div className="bg-[#0D0D0D] border border-[#222222] rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/5">
            {/* Header Toolbar */}
            <div className="bg-[#141414] border-b border-[#222222] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-zinc-500 font-bold">studio-workspace.gochat.ai</span>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-2 bg-[#090909] p-1 rounded-xl border border-[#222222]">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === "chat" ? "bg-amber-500 text-black shadow-md shadow-amber-500/20" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat Bot
                </button>
                <button
                  onClick={() => setActiveTab("image")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === "image" ? "bg-amber-500 text-black shadow-md shadow-amber-500/20" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Image Studio
                </button>
                <button
                  onClick={() => setActiveTab("venture")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === "venture" ? "bg-amber-500 text-black shadow-md shadow-amber-500/20" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Venture Engine
                </button>
              </div>
            </div>

            {/* Tab Display Content */}
            <div className="p-6 md:p-8 min-h-[380px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {activeTab === "chat" && (
                  <motion.div
                    key="chat-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4 flex-1 flex flex-col justify-between"
                  >
                    <div className="space-y-3 overflow-y-auto max-h-[260px] pr-2 custom-scrollbar">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                              msg.sender === "user" ? "bg-amber-500 text-black" : "bg-[#1E1E1E] text-amber-400 border border-[#333]"
                            }`}
                          >
                            {msg.sender === "user" ? "YOU" : "AI"}
                          </div>
                          <div
                            className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                              msg.sender === "user"
                                ? "bg-amber-500/10 border border-amber-500/30 text-amber-200"
                                : "bg-[#151515] border border-[#242424] text-zinc-200"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span className="text-[9px] text-zinc-500 mt-1.5 block text-right font-mono">{msg.time}</span>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex items-center gap-2 text-xs text-amber-400 font-mono animate-pulse">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Generating streaming tensor bytes...</span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Input Bar */}
                    <div className="flex items-center gap-2 pt-4 border-t border-[#222222]">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSimulateChat()}
                        placeholder="Type a test query for the AI matrix..."
                        className="flex-1 bg-[#121212] border border-[#262626] focus:border-amber-500 text-xs text-white rounded-xl px-4 py-3 outline-none transition"
                      />
                      <button
                        onClick={handleSimulateChat}
                        className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "image" && (
                  <motion.div
                    key="image-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
                  >
                    <div className="space-y-4 text-left">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                          Hyper-Realistic Image Generation
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Render studio-grade artwork in seconds. Configure aspect ratio and art style parameters.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Art Style</label>
                        <div className="flex flex-wrap gap-2">
                          {["Obsidian Gold", "Cyberpunk", "Photorealistic", "Minimalist"].map((style) => (
                            <button
                              key={style}
                              onClick={() => setSelectedStyle(style)}
                              className={`px-3 py-1.5 rounded-lg text-xs transition border ${
                                selectedStyle === style
                                  ? "bg-amber-500/20 border-amber-500 text-amber-400 font-bold"
                                  : "bg-[#141414] border-[#242424] text-zinc-400 hover:text-white"
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Aspect Ratio</label>
                        <div className="flex gap-2">
                          {["16:9", "1:1", "9:16"].map((ratio) => (
                            <button
                              key={ratio}
                              onClick={() => setGeneratedRatio(ratio)}
                              className={`px-3 py-1.5 rounded-lg text-xs transition border ${
                                generatedRatio === ratio
                                  ? "bg-amber-500/20 border-amber-500 text-amber-400 font-bold"
                                  : "bg-[#141414] border-[#242424] text-zinc-400 hover:text-white"
                              }`}
                            >
                              {ratio}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-[#141414] border border-[#242424] rounded-xl text-xs text-zinc-300 font-mono">
                        <span className="text-amber-500 font-bold">// PROMPT:</span> "Futuristic obsidian floating orb in hyper-detailed amber neon light matrix, {selectedStyle} theme"
                      </div>
                    </div>

                    {/* Image Preview Canvas Card */}
                    <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-zinc-900 to-black p-4 flex flex-col items-center justify-center min-h-[240px] group shadow-xl">
                      <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 to-transparent blur-xl pointer-events-none" />
                      <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition duration-300">
                        <Sparkles className="w-10 h-10 animate-pulse" />
                      </div>
                      <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                        {selectedStyle} AI Canvas [{generatedRatio}]
                      </span>
                      <p className="text-[10px] text-zinc-500 mt-1">Ready for 4K PNG Export</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "venture" && (
                  <motion.div
                    key="venture-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 text-left"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                          Automated Venture & Business Planning
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Generates structural financial projections, TAM/SAM market models, and operational roadmaps.
                        </p>
                      </div>
                      <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Executive Ready PDF/Doc Export
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-[#141414] border border-[#242424] rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                          <span>Financial Projections</span>
                          <BarChart3 className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="text-lg font-bold text-white">$1.2M ARR Target</p>
                        <p className="text-[10px] text-emerald-400">+140% QoQ Growth Model</p>
                      </div>

                      <div className="p-4 bg-[#141414] border border-[#242424] rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                          <span>Competitor Analysis</span>
                          <Layers className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="text-lg font-bold text-white">Top 3 Competitors</p>
                        <p className="text-[10px] text-zinc-400">Mapped with moat metrics</p>
                      </div>

                      <div className="p-4 bg-[#141414] border border-[#242424] rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                          <span>Go-To-Market Timeline</span>
                          <Zap className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="text-lg font-bold text-white">90-Day Execution</p>
                        <p className="text-[10px] text-zinc-400">Sprint breakdown structured</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Tilt3DCard>
      </div>
    </section>
  );
}
