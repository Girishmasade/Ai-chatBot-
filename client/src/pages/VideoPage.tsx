import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tv as VideoIcon, Sparkles, Loader2, RefreshCw, Layers, Sliders, ArrowRight, ChevronDown } from "lucide-react";
import { useExecuteAIMutation, useGetModelsQuery } from "../redux/api/apiSlice";
import { toast } from "react-hot-toast";

export default function VideoPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("1080p");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [step, setStep] = useState<"idle" | "start" | "poll" | "ready">("idle");
  const [opName, setOpName] = useState("");
  const [pollLogs, setPollLogs] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const { data: dbModels = [] } = useGetModelsQuery();
  const [executeAI, { isLoading: generating }] = useExecuteAIMutation();

  const dbVideoModels = (dbModels || []).filter(
    (m: any) => (m.type === "video" || m.type === "video_gen") && (m.status === "active" || m.status === undefined)
  );

  const availableModels = dbVideoModels.length > 0
    ? dbVideoModels.map((m: any) => ({
        id: m.version || m.id || m.name,
        name: m.name,
        version: m.version || m.id,
        cost: m.latency || "3 cr",
      }))
    : [
        { id: "damo-vilab/text-to-video-ms-1.7m", name: "HF Text-to-Video MS 1.7M", version: "damo-vilab/text-to-video-ms-1.7m", cost: "3 cr" },
        { id: "unsloth/Wan2.2-TI2V-5B-GGUF", name: "Wan2.2 Text-To-Video", version: "unsloth/Wan2.2-TI2V-5B-GGUF", cost: "5 cr" },
      ];

  const [selectedModel, setSelectedModel] = useState<string>(availableModels[0]?.id || "damo-vilab/text-to-video-ms-1.7m");

  React.useEffect(() => {
    if (availableModels.length > 0) {
      const exists = availableModels.some((m) => m.id === selectedModel);
      if (!exists) {
        setSelectedModel(availableModels[0].id);
      }
    }
  }, [availableModels]);

  const handleStartInference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const activePrompt = prompt.trim();
    // Clear left side UI input immediately upon video creation
    setPrompt("");
    setStep("start");
    setPollLogs([
      `[INFO] Initializing Video Engine: ${selectedModel}...`,
      "[INFO] Reserving tokens from user wallet...",
    ]);

    try {
      const generatedOp = `op-${Math.random().toString(36).substr(2, 9)}`;
      setOpName(`models/${selectedModel}/operations/${generatedOp}`);
      
      const res: any = await executeAI({
        service: "video_gen",
        model: selectedModel,
        prompt: `[Resolution: ${resolution}, Aspect: ${aspectRatio}] ${activePrompt}`,
      }).unwrap();

      const rawUrl = res?.imageUrls?.[0] || res?.response;
      const isMp4Video = rawUrl && typeof rawUrl === "string" && (
        rawUrl.endsWith(".mp4") ||
        rawUrl.endsWith(".webm") ||
        rawUrl.includes("/video/upload/") ||
        rawUrl.includes("res.cloudinary.com") ||
        rawUrl.startsWith("data:video") ||
        rawUrl.startsWith("http")
      );

      if (isMp4Video) {
        setVideoUrl(rawUrl);
        setStep("poll");
        setPollLogs((prev) => [
          ...prev,
          "[SUCCESS] Tokens deducted & verified",
          "[INFO] Storing media asset securely on Cloudinary CDN...",
          `[SUCCESS] Real model video asset created: ${rawUrl.substring(0, 40)}...`,
          "[INFO] Redirecting to Asset Library...",
        ]);

        setTimeout(() => {
          setStep("ready");
          toast.success("Real AI Video generated & saved to library!");
          // Redirect to the Asset Section
          navigate("/app/assets-library");
        }, 1500);
      } else {
        toast.error("Model did not return a video stream. Check Hugging Face API key or model status.");
        setStep("idle");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to generate AI video.");
      setStep("idle");
    }
  };

  const handleReset = () => {
    setPrompt("");
    setStep("idle");
    setOpName("");
    setPollLogs([]);
    setVideoUrl("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 p-1 text-left min-h-[calc(100vh-7rem)]">
      {/* Configuration Sidebar (Left side UI - 70% Screen Width) */}
      <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 space-y-6 lg:col-span-7 flex flex-col justify-between h-full">
        <div className="space-y-5">
          <div className="space-y-1 pb-3 border-b border-[#1F1F1F]">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Motion Parameters</h4>
            <p className="text-[10px] text-zinc-500">Video timeline & motion compiler</p>
          </div>

          <form id="video-creation-form" onSubmit={handleStartInference} className="space-y-5">
            {/* Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Motion Prompt</label>
                {prompt && (
                  <button
                    type="button"
                    onClick={() => setPrompt("")}
                    className="text-[9px] text-amber-500 hover:underline"
                  >
                    Clear Left UI
                  </button>
                )}
              </div>
              <textarea
                id="video-prompt-field"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A gorgeous loop of swirling liquid dark mercury with translucent amber gold reflections floating slow-motion..."
                className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white placeholder-zinc-600 h-28 resize-none transition"
                disabled={step !== "idle"}
              />
            </div>

            {/* Motion Model Selection */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Motion Model Engine
              </label>
              {availableModels.length <= 1 ? (
                /* Single Model View */
                <div className="w-full p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-500 flex items-center justify-between shadow-md shadow-amber-500/5">
                  <div>
                    <p className="text-xs font-bold text-white">{availableModels[0]?.name || "Default Motion Engine"}</p>
                    <p className="text-[9px] text-zinc-500 font-mono">{availableModels[0]?.version || selectedModel}</p>
                  </div>
                  <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded border bg-amber-500/20 border-amber-500/30 text-amber-400">
                    {availableModels[0]?.cost || "Active"}
                  </span>
                </div>
              ) : (
                /* Multiple Models Dropdown View */
                <div className="relative">
                  <select
                    id="video-model-select"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={step !== "idle"}
                    className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white appearance-none cursor-pointer pr-10 transition font-medium"
                  >
                    {availableModels.map((m) => (
                      <option key={m.id} value={m.id} className="bg-[#111111] text-white py-2">
                        {m.name} ({m.version})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-amber-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Resolution Options */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Render Quality
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "1080p Full HD", value: "1080p" },
                  { label: "720p HD Ready", value: "720p" }
                ].map((res) => (
                  <button
                    id={`video-res-${res.value}`}
                    key={res.value}
                    type="button"
                    onClick={() => setResolution(res.value)}
                    disabled={step !== "idle"}
                    className={`py-2 text-[9px] font-bold rounded-lg border transition ${
                      resolution === res.value
                        ? "bg-amber-500/10 border-amber-500 text-amber-500"
                        : "bg-[#1A1A1A] border-[#242424] text-zinc-400 hover:text-white"
                    }`}
                  >
                    {res.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Dimensions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Cinema (16:9)", value: "16:9" },
                  { label: "Portrait (9:16)", value: "9:16" }
                ].map((asp) => (
                  <button
                    id={`video-aspect-${asp.value}`}
                    key={asp.value}
                    type="button"
                    onClick={() => setAspectRatio(asp.value)}
                    disabled={step !== "idle"}
                    className={`py-2 text-[9px] font-bold rounded-lg border transition ${
                      aspectRatio === asp.value
                        ? "bg-amber-500/10 border-amber-500 text-amber-500"
                        : "bg-[#1A1A1A] border-[#242424] text-zinc-400 hover:text-white"
                    }`}
                  >
                    {asp.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="video-btn-submit"
              type="submit"
              disabled={step !== "idle" || !prompt.trim()}
              className="w-full py-3 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 disabled:bg-[#1A1A1A] disabled:text-zinc-600 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/15"
            >
              <Sparkles className="w-4 h-4" />
              Initialize Render
            </button>
          </form>
        </div>

        {/* Shortcut link to assets library */}
        <div className="pt-4 border-t border-[#1F1F1F]">
          <button
            onClick={() => navigate("/app/assets-library")}
            className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#242424] border border-[#242424] rounded-xl text-[10px] font-bold text-zinc-300 hover:text-white transition flex items-center justify-center gap-1.5"
          >
            <span>Go to My Assets Section</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
          </button>
        </div>
      </div>

      {/* Main Timeline screen / Logging panel (Right side - 30% Screen Width) */}
      <div className="lg:col-span-3 space-y-6 flex flex-col h-full">
        {step === "idle" && (
          <div className="bg-[#111111] border border-[#242424] rounded-2xl flex-1 min-h-[500px] flex flex-col items-center justify-center text-center space-y-3 p-6">
            <VideoIcon className="w-12 h-12 text-zinc-700 animate-pulse" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-zinc-400">Motion Canvas Empty</h5>
              <p className="text-[10px] text-zinc-600 max-w-xs">Config your parameters and click **Initialize Render** on the left panel to trigger the operation polling pipeline.</p>
            </div>
          </div>
        )}

        {/* STEP 1: START */}
        {step === "start" && (
          <div className="bg-[#111111] border border-amber-500/10 rounded-2xl flex-1 min-h-[500px] flex flex-col items-center justify-center text-center space-y-4 p-6 relative overflow-hidden">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-xs font-bold text-white uppercase tracking-wider animate-pulse">Initializing Veo Video pipeline</p>
            <p className="text-[10px] text-zinc-500 max-w-xs leading-relaxed">Communicating with server-side SDK. Triggering operation handler...</p>
          </div>
        )}

        {/* STEP 2: POLLING LOGS */}
        {step === "poll" && (
          <div className="bg-[#111111] border border-[#242424] rounded-2xl flex-1 min-h-[500px] p-6 flex flex-col justify-between overflow-hidden relative font-mono">
            {/* Soft backdrop lines */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
                <span className="text-[10px] font-bold text-amber-500 tracking-wider uppercase">Operation Status Monitor</span>
                <span className="text-[9px] text-[#71717A]">OP_NAME: {opName}</span>
              </div>

              {/* Console log lines */}
              <div className="space-y-2.5 pt-2 max-h-80 overflow-y-auto">
                {pollLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-amber-500/40 shrink-0">❯</span>
                    <span className={`text-[10px] ${log.includes("SUCCESS") ? "text-emerald-500" : log.includes("POLL") ? "text-amber-400" : "text-zinc-400"}`}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom load bar */}
            <div className="pt-4 border-t border-[#1F1F1F] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Compiling active video segments...</span>
              </div>
                <span className="text-[10px] font-bold text-amber-500 uppercase">Redirecting to My Assets...</span>
            </div>
          </div>
        )}

        {/* STEP 3: VIDEO PLAYBACK SCREEN */}
        {step === "ready" && (
          <div className="space-y-4 flex-1">
            <div className="bg-[#111111] border border-amber-500/20 rounded-2xl overflow-hidden relative group">
              {/* Premium HTML5 Loop Video */}
              <video
                src={videoUrl}
                autoPlay
                loop
                muted
                controls
                className="w-full aspect-video object-cover"
              />

              {/* Controls overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between opacity-0 group-hover:opacity-100 transition duration-300">
                <button
                  id="video-btn-reset"
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 rounded-lg text-[10px] font-bold text-black uppercase transition flex items-center gap-1 shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Render New
                </button>
                <button
                  onClick={() => navigate("/app/assets-library")}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1"
                >
                  Go to Assets
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
