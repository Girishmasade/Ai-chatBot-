import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Sparkles, Copy, Check, Trash2, Paperclip, Smile, X, FileText, ArrowDown, History, Clock, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Picker, { Theme } from "emoji-picker-react";
import theme from "../theme";
import {
  useExecuteAIMutation,
  useGetMyRequestsQuery,
  useGetChatSessionsQuery,
  useLazyGetChatSessionByIdQuery,
  useSaveChatMessageMutation,
  useDeleteChatSessionMutation,
} from "../redux/api/apiSlice";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  fileUrl?: string;
  fileName?: string;
  fileIsImage?: boolean;
  model?: string;
  timestamp: string;
}

export default function ChatPage() {
  const [executeAI] = useExecuteAIMutation();
  const { data: requestHistory, isLoading: loadingHistory } = useGetMyRequestsQuery();
  const { data: chatSessions, isLoading: loadingSessions } = useGetChatSessionsQuery();
  const [fetchSessionDetails] = useLazyGetChatSessionByIdQuery();
  const [saveChatMessage] = useSaveChatMessageMutation();
  const [deleteChatSession] = useDeleteChatSessionMutation();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const suggestions = [
    { label: "Luxury UI Design Strategy", text: "What are the core visual design guidelines for implementing a true dark theme first luxury Black Amber color palette? Keep it precise and actionable." },
    { label: "INR Financial Growth Formula", text: "Create a financial target strategy in Indian Rupees ₹ to scale a bootstrapped AI platform from ₹50,000 monthly active users (MAUs) to ₹15,00,000 monthly ARR." },
    { label: "Refactor TypeScript code", text: "Can you provide a robust lazy-initialization pattern in TypeScript to safely configure an external GoogleGenAI client on Express server without throwing missing parameters errors at module load?" }
  ];

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

  // Auto-scroll to bottom on new messages, unless user has scrolled up
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Track scroll position to show "jump to bottom" button
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distanceFromBottom > 200);
  };

  // Close emoji picker on outside click
  useEffect(() => {
    if (!showPicker) return;
    const onClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showPicker]);

  // Auto-grow the textarea up to a max height
  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };
  useEffect(autoGrow, [input]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt && !selectedFile) return;

    if (!textToSend) setInput("");

    const isImage = selectedFile?.type.startsWith("image/") ?? false;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: prompt,
      fileUrl: filePreview || undefined,
      fileName: selectedFile?.name,
      fileIsImage: isImage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setFilePreview(null);
    setSelectedFile(null);
    setShowPicker(false);
    requestAnimationFrame(() => textareaRef.current?.focus());

    try {
      const conversationHistory = messages
        .filter((m) => m.id !== "greet-1")
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const res = await executeAI({
        service: "ai_chat",
        prompt,
        conversationHistory,
      }).unwrap();

      const aiText = res?.response || res?.content || "No response text received from AI model.";
      const modelName = res?.model || "AI Model";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: aiText,
          model: modelName,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      // Save message to MongoDB chat session history
      try {
        const savedRes = await saveChatMessage({
          sessionId: activeSessionId || undefined,
          service: "ai_chat",
          userMessage: prompt,
          aiResponse: aiText,
          model: modelName,
          provider: res?.provider || "",
        }).unwrap();

        if (savedRes?.data?.session?.id) {
          setActiveSessionId(savedRes.data.session.id);
        }
      } catch (saveErr) {
        console.error("Failed to persist chat to DB:", saveErr);
      }
    } catch (err: any) {
      console.error("AI Request Execution Error:", err);
      const errMsg = err?.data?.message || err?.message || "Failed to generate AI response. Please check active system models or subscription.";
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `⚠️ **Error**: ${errMsg}`,
          model: "System Error",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setActiveSessionId(null);
    setMessages([
      {
        id: "greet-1",
        sender: "ai",
        text: `### GoChat AI Platform Central Chat\n\nWorkspace chat cleared successfully. Ready for your next command.`,
        model: "Gemini 3.5 Flash",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSelectHistorySession = async (session: any) => {
    try {
      setActiveSessionId(session.id);
      setShowHistoryDrawer(false);

      const detailedSession = await fetchSessionDetails(session.id).unwrap();
      if (detailedSession && detailedSession.messages) {
        const loadedMessages: Message[] = detailedSession.messages.map((m: any, idx: number) => ({
          id: m._id || `msg-${idx}-${Date.now()}`,
          sender: m.role === "user" ? "user" : "ai",
          text: m.content,
          model: m.model || session.lastModel || "AI Model",
          timestamp: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
        }));
        setMessages(loadedMessages);
      }
    } catch (err) {
      console.error("Failed to load session history:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    e.target.value = ""; // allow re-selecting the same file later
  };

  return (
    <div className="flex flex-col h-full p-1">
      {/* Header row: title + clear action (outside scroll area, always visible) */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2 text-zinc-400">
          <MessageSquare className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-widest">GoChat AI</span>
        </div>
        <div className="flex items-center gap-2">
          {activeSessionId && (
            <button
              onClick={handleClearChat}
              className="p-1.5 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition flex items-center gap-1 cursor-pointer"
            >
              + New Chat
            </button>
          )}
          <button
            id="chat-btn-history"
            onClick={() => setShowHistoryDrawer((v) => !v)}
            aria-label="Toggle chat history"
            className="p-1.5 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-300 hover:text-amber-500 bg-[#151515] border border-[#242424] hover:border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-amber-500" />
            History
          </button>
          <button
            id="chat-btn-clear"
            onClick={handleClearChat}
            aria-label="Clear chat log"
            className="p-1.5 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-500 bg-[#151515] border border-[#242424] hover:border-rose-500/20 transition flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Log
          </button>
        </div>
      </div>

      {/* Suggestions strip */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 shrink-0 text-left">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s.text)}
              className="p-3.5 bg-[#111111] hover:bg-amber-500/5 border border-[#242424] hover:border-amber-500/30 rounded-xl cursor-pointer transition group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            >
              <h5 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> {s.label}
              </h5>
              <p className="text-[10px] text-zinc-400 truncate mt-1 group-hover:text-zinc-200">
                {s.text}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Main conversation log */}
      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto bg-[#111111] border border-[#242424] rounded-2xl p-4 md:p-6 space-y-5 custom-scrollbar relative"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

          {messages.map((m) => {
            const isAi = m.sender === "ai";
            return (
              <div
                key={m.id}
                className={`flex flex-col space-y-1 max-w-[90%] md:max-w-[85%] ${isAi ? "mr-auto text-left" : "ml-auto text-right"}`}
              >
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

                <div
                  className={`p-4 rounded-xl border relative group ${
                    isAi
                      ? "bg-[#151515]/90 border-[#242424] text-zinc-300"
                      : "bg-amber-500/5 border-amber-500/20 text-white"
                  }`}
                >
                  <button
                    id={`chat-copy-btn-${m.id}`}
                    onClick={() => copyToClipboard(m.id, m.text)}
                    aria-label="Copy message to clipboard"
                    className="absolute top-3 right-3 p-1 rounded bg-[#1C1C1E] border border-zinc-800 text-zinc-400 hover:text-white opacity-60 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition"
                  >
                    {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>

                  <div className="prose prose-invert prose-amber max-w-none text-xs leading-relaxed font-sans break-words prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-a:text-amber-500 hover:prose-a:text-amber-400 prose-code:text-amber-200 prose-code:bg-amber-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#090909] prose-pre:border prose-pre:border-[#242424] prose-li:marker:text-amber-500">
                    {m.fileUrl && (
                      <div className="mb-3">
                        {m.fileIsImage ? (
                          <img src={m.fileUrl} alt="Uploaded content" className="max-w-[200px] rounded-lg border border-[#242424]" />
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#090909] border border-[#242424] not-prose text-xs text-zinc-300">
                            <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="truncate max-w-[180px]">{m.fileName ?? "Attached file"}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          })}

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

        {/* Jump-to-bottom button, only shows when scrolled up */}
        {showScrollBtn && (
          <button
            onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
            aria-label="Scroll to latest message"
            className="absolute bottom-3 right-3 p-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 transition"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Input panel bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-4 flex flex-col gap-2 shrink-0 relative"
      >
        {filePreview && selectedFile && (
          <div className="relative w-fit">
            {selectedFile.type.startsWith("image/") ? (
              <img src={filePreview} alt="Preview" className="h-16 rounded-md border border-[#242424] object-cover" />
            ) : (
              <div className="h-16 px-3 flex items-center gap-2 rounded-md border border-[#242424] bg-[#111111] text-xs text-zinc-300">
                <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate max-w-[160px]">{selectedFile.name}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => { setSelectedFile(null); setFilePreview(null); }}
              aria-label="Remove attachment"
              className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-400"
            >
              <X className="w-3 h-3 hover:cursor-pointer" />
            </button>
          </div>
        )}

        {showPicker && (
          <div ref={pickerRef} className="absolute bottom-16 right-0 z-50 shadow-2xl max-w-[90vw]">
            <Picker
              onEmojiClick={(emojiData) => setInput((prev) => prev + emojiData.emoji)}
              theme={Theme.DARK}
            />
          </div>
        )}

        <div className="flex gap-3 items-end">
          <div className="relative flex-1 flex items-end bg-[#111111] border border-[#242424] focus-within:border-amber-500/40 rounded-xl transition">
            <label className="pl-3 pb-3.5 cursor-pointer text-zinc-500 hover:text-amber-500 transition">
              <Paperclip className="w-4 h-4" />
              <input
                type="file"
                accept="image/*,application/pdf,.txt"
                className="hidden"
                onChange={handleFileChange}
                aria-label="Attach a file"
              />
            </label>

            <button
              type="button"
              onClick={() => setShowPicker((v) => !v)}
              aria-label="Insert emoji"
              className="px-3 pb-3.5 hover:cursor-pointer text-zinc-500 hover:text-amber-500 transition"
            >
              <Smile className="w-4 h-4 hover:cursor-pointer" />
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Initialize premium AI prompt..."
              className="w-full px-3 bg-transparent border-none resize-none py-3.5 pr-4 text-xs text-white placeholder-zinc-500 transition custom-scrollbar"
              disabled={loading}
            />
          </div>

          <button
            id="chat-btn-submit"
            type="submit"
            disabled={loading || (!input.trim() && !selectedFile)}
            aria-label="Send message"
            className="h-[46px] px-5 hover:cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-[#1A1A1A] disabled:cursor-not-allowed text-black disabled:text-zinc-600 font-bold transition flex items-center justify-center shadow-lg shadow-amber-500/15 focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            <Send className="w-4 h-4 " />
          </button>
        </div>
      </form>

      {/* Chat History Slide-Out Drawer */}
      {showHistoryDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-[#111111] border-l border-[#242424] h-full flex flex-col p-5 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-200">AI Request History</h3>
              </div>
              <button
                onClick={() => setShowHistoryDrawer(false)}
                aria-label="Close history drawer"
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-[#1C1C1E] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar">
              {loadingSessions ? (
                <div className="text-center py-10 text-xs text-zinc-500 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 animate-spin" />
                  Loading persistent chat history...
                </div>
              ) : !chatSessions || chatSessions.length === 0 ? (
                <div className="text-center py-12 text-xs text-zinc-500">
                  No saved chat threads found in database.
                </div>
              ) : (
                chatSessions.map((session: any) => {
                  const dateStr = session.updatedAt ? new Date(session.updatedAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "";
                  const isActive = session.id === activeSessionId;

                  return (
                    <div
                      key={session.id}
                      className={`p-3.5 bg-[#151515] border rounded-xl cursor-pointer transition group relative ${
                        isActive ? "border-amber-500 bg-amber-500/5" : "border-[#242424] hover:border-amber-500/40"
                      }`}
                      onClick={() => handleSelectHistorySession(session)}
                    >
                      <div className="flex items-center justify-between mb-1.5 pr-6">
                        <span className="text-[10px] font-mono text-amber-500 font-bold uppercase flex items-center gap-1">
                          <Bot className="w-3 h-3 text-amber-500" />
                          {session.lastModel || "AI Model"}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500">{dateStr}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                        {session.title || "Conversation Thread"}
                      </h4>
                      {session.lastSnippet && (
                        <p className="text-[10px] text-zinc-400 line-clamp-1 mt-1">
                          {session.lastSnippet}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                        <span className="uppercase text-zinc-400">{session.service || "ai_chat"}</span>
                        <span className="text-amber-500 font-semibold">{session.messageCount || 0} msgs</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChatSession({ sessionId: session.id });
                          if (activeSessionId === session.id) setActiveSessionId(null);
                        }}
                        aria-label="Delete thread"
                        className="absolute top-3 right-3 text-zinc-600 hover:text-rose-500 opacity-60 hover:opacity-100 transition p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}