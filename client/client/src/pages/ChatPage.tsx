import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Sparkles, AlertCircle, Copy, Check, Terminal, Trash2 } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  model?: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Suggested Prompts
  const suggestions = [
    { label: "Luxury UI Design Strategy", text: "What are the core visual design guidelines for implementing a true dark theme first luxury Black Amber color palette? Keep it precise and actionable." },
    { label: "INR Financial Growth Formula", text: "Create a financial target strategy in Indian Rupees ₹ to scale a bootstrapped AI platform from ₹50,000 monthly active users (MAUs) to ₹15,00,000 monthly ARR." },
    { label: "Refactor TypeScript code", text: "Can you provide a robust lazy-initialization pattern in TypeScript to safely configure an external GoogleGenAI client on Express server without throwing missing parameters errors at module load?" }
  ];

  // Load chat logs or set initial greet
  useEffect(() => {
    const initialGreet: Message = {
      id: "greet-1",
      sender: "ai",
      text: `### GoChat AI Platform Central Chat

Welcome to the premium conversational command line. I am powered directly by **Gemini 3.5 Flash** server-side proxy models.

How can I assist you in optimizing your custom platform development today? Select one of our luxury templates or enter a custom prompt below.`,
      model: "Gemini 3.5 Flash",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialGreet]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt) return;

    if (!textToSend) setInput("");

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    setTimeout(() => {
      let responseText = `### GoChat AI Intelligence Hub

Thank you for your premium inquiry on GoChat AI.

Here is a structured analysis of your query: **"${prompt}"**

1. **Aesthetic Excellence**: We deliver state-of-the-art text representations designed to match the high-end *Black Amber* philosophy.
2. **Key Capabilities**:
   - Advanced semantic reasoning.
   - Context preservation across nested panels.
   - High performance sub-100ms response times.

*Note: Running in high-fidelity client-only simulation mode.*`;

      if (prompt.toLowerCase().includes("business") || prompt.toLowerCase().includes("plan")) {
        responseText = `### Executive Summary: Obsidian Tech Enterprises

**Vision**: To construct high-fidelity premium interfaces combining automated model compilation with a Black Amber executive dashboard.

#### Core Value Pillars
- **Ultimate Contrast**: 100% true dark-mode compliance using \`#090909\` and \`#F59E0B\` amber overlays.
- **Micro-interactions**: Fluid transitions via Framer Motion to maximize user dwell times.
- **Enterprise-Grade CMS**: Self-authoritative model dashboards for live adjustments.

#### Financial Projection (₹ INR)
- **Year 1 Target**: ₹12.5M
- **Breakeven Threshold**: Month 4
- **Operating Margin**: 64%`;
      } else if (prompt.toLowerCase().includes("layout") || prompt.toLowerCase().includes("design") || prompt.toLowerCase().includes("guideline")) {
        responseText = `### Luxury UI Design Pillars

1. **Generous White Space**: Luxury is defined by breathing room. Avoid tightly packed, multi-panel arrays. Maintain visual luxury.
2. **Monochrome Dominance with Warm Highlights**: Stick to near-black backgrounds (#090909) and deep slate containers, using premium Amber Gold (#F59E0B) strictly as a point of focal entry.
3. **Space Grotesk Typography**: Pair Inter with geometric monospaces or futuristic grots for clean luxury counters and statistics.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: responseText,
          model: "Gemini 3.5 Flash (Client simulation)",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "greet-1",
        sender: "ai",
        text: `### GoChat AI Platform Central Chat\n\nWorkspace chat cleared successfully. Ready for your next luxurious command.`,
        model: "Gemini 3.5 Flash",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-1 select-none">
      {/* Suggestions template strip */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 shrink-0 text-left">
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => handleSend(s.text)}
              className="p-3.5 bg-[#111111] hover:bg-amber-500/5 border border-[#242424] hover:border-amber-500/30 rounded-xl cursor-pointer transition group"
            >
              <h5 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> {s.label}
              </h5>
              <p className="text-[10px] text-zinc-400 truncate mt-1 group-hover:text-zinc-200">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Main Conversation Log */}
      <div className="flex-1 overflow-y-auto bg-[#111111] border border-[#242424] rounded-2xl p-4 md:p-6 space-y-5 custom-scrollbar relative">
        {/* Subtle decorative grid markings */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        {/* Floating actions */}
        <div className="sticky top-0 right-0 flex justify-end z-10 pointer-events-none">
          <button
            id="chat-btn-clear"
            onClick={handleClearChat}
            className="p-1.5 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-500 bg-[#151515] border border-[#242424] hover:border-rose-500/20 transition flex items-center gap-1 shadow-md pointer-events-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Log
          </button>
        </div>

        {messages.map((m) => {
          const isAi = m.sender === "ai";
          return (
            <div
              key={m.id}
              className={`flex flex-col space-y-1 max-w-[85%] ${isAi ? "mr-auto text-left" : "ml-auto text-right"}`}
            >
              {/* Header */}
              <div className={`flex items-center gap-2 text-[9px] font-mono tracking-wider text-zinc-500 ${!isAi && "justify-end"}`}>
                <span className="font-semibold uppercase text-zinc-400">{isAi ? "AI Platform" : "User Client"}</span>
                <span>•</span>
                <span>{m.timestamp}</span>
                {isAi && m.model && (
                  <>
                    <span>•</span>
                    <span className="text-amber-500 font-bold uppercase">{m.model}</span>
                  </>
                )}
              </div>

              {/* Message text container */}
              <div
                className={`p-4 rounded-xl border relative group ${
                  isAi
                    ? "bg-[#151515]/90 border-[#242424] text-zinc-300"
                    : "bg-amber-500/5 border-amber-500/20 text-white"
                }`}
              >
                {/* Copy button on hover */}
                <button
                  id={`chat-copy-btn-${m.id}`}
                  onClick={() => copyToClipboard(m.id, m.text)}
                  className="absolute top-3 right-3 p-1 rounded bg-[#1C1C1E] border border-zinc-800 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
                  title="Copy log to clipboard"
                >
                  {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>

                {/* Simplified formatting render */}
                <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-3 font-sans break-words whitespace-pre-line">
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex flex-col space-y-1 mr-auto text-left max-w-[80%]">
            <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500">
              <span className="font-semibold uppercase text-zinc-400">AI Platform</span>
              <span>•</span>
              <span className="text-amber-500 animate-pulse">Running Inference...</span>
            </div>
            <div className="p-4 bg-[#151515]/80 border border-[#242424] rounded-xl flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="text-xs text-zinc-500 italic">Formatting response matrix...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input panel bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-4 flex gap-3 shrink-0"
      >
        <div className="relative flex-1">
          <input
            id="chat-input-field"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Initialize premium AI prompt..."
            className="w-full bg-[#111111] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl py-3.5 pl-4 pr-12 text-xs text-white placeholder-zinc-500 transition"
            disabled={loading}
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[9px] font-mono text-zinc-600">
            <span>ENTER TO SEND</span>
          </div>
        </div>

        <button
          id="chat-btn-submit"
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-[#1A1A1A] text-black disabled:text-zinc-600 font-bold transition flex items-center justify-center shadow-lg shadow-amber-500/15"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
