import React, { useState } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { useGenerateImageMutation, useGetModelsQuery } from "../redux/api/apiSlice";
import { toast } from "react-hot-toast";

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [modelType, setModelType] = useState("gemini-3.1-flash-lite-image");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: models = [] } = useGetModelsQuery();
  const [generateImage, { isLoading: generating }] = useGenerateImageMutation();

  const imageModels = models.filter((m: any) => m.type === "image");
  const activeModelType = imageModels.some((m: any) => m.id === modelType) ? modelType : (imageModels[0]?.id || "");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("aspectRatio", aspectRatio);
      formData.append("modelType", activeModelType);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const data = await generateImage(formData).unwrap();
      if (data.success) {
        toast.success("Artwork generated successfully!");
        setPrompt("");
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.data?.message || "Failed to generate image. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 p-1">
      {/* Left Configuration Panel (70% Screen Width) */}
      <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 space-y-6 text-left lg:col-span-7 h-fit">
        <div className="space-y-1 pb-3 border-b border-[#1F1F1F]">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Configure Canvas</h4>
          <p className="text-[10px] text-zinc-500">Fine-tune generative AI parameters</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Creative Prompt</label>
            <textarea
              id="image-prompt-field"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Luxurious dark abstract crystalline obsidian stone with glowing amber gold core..."
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white placeholder-zinc-600 h-24 resize-none transition"
              disabled={generating}
            />
          </div>

          {/* Optional Image Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Reference Image (Optional)
            </label>
            <input 
              type="file" 
              accept="image/*"
              className="w-full text-[10px] text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20 file:transition file:cursor-pointer"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                  setImagePreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              disabled={generating}
            />
            {imagePreview && (
              <div className="relative mt-2 w-full h-24 rounded-lg overflow-hidden border border-[#242424]">
                <img src={imagePreview} className="object-cover w-full h-full opacity-80" alt="Preview" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-md hover:bg-rose-500 transition"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Aspect Ratio Toggle cards */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Square (1:1)", value: "1:1" },
                { label: "Wide (16:9)", value: "16:9" },
                { label: "Portrait (9:16)", value: "9:16" },
                { label: "Classic (4:3)", value: "4:3" }
              ].map((item) => (
                <button
                  id={`ratio-btn-${item.value}`}
                  key={item.value}
                  type="button"
                  onClick={() => setAspectRatio(item.value)}
                  className={`py-2 text-[10px] font-bold rounded-lg border transition ${
                    aspectRatio === item.value
                      ? "bg-amber-500/10 border-amber-500 text-amber-500"
                      : "bg-[#1A1A1A] border-[#242424] text-zinc-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Core Model Select */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">AI Vision Engine</label>
            {imageModels.length === 1 ? (
              <div className="w-full p-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-500 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{imageModels[0].name}</p>
                  <p className="text-[9px] text-zinc-500 font-mono">{(imageModels[0] as any).provider || imageModels[0].version}</p>
                </div>
              </div>
            ) : (
              <select
                id="image-model-select"
                value={activeModelType}
                onChange={(e) => setModelType(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-2.5 text-xs text-zinc-300 cursor-pointer transition font-medium"
              >
                {imageModels.length === 0 ? (
                  <option value="">No models available</option>
                ) : (
                  imageModels.map((m: any) => (
                    <option key={m.id} value={m.id} className="bg-[#111111] text-white">
                      {m.name} ({m.provider})
                    </option>
                  ))
                )}
              </select>
            )}
          </div>

          <button
            id="image-btn-generate"
            type="submit"
            disabled={generating || !prompt.trim()}
            className="w-full py-3 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 disabled:bg-[#1A1A1A] disabled:text-zinc-600 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/15"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? "Refracting Crystal..." : "Generate Artwork"}
          </button>
        </form>
      </div>

      {/* Right Canvas Output & Gallery (30% Screen Width) */}
      <div className="lg:col-span-3 space-y-6">
        {/* Render/Loading Space */}
        {generating && (
          <div className="bg-[#111111] border border-amber-500/20 rounded-2xl h-80 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
            {/* Shimmer pulse */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/[0.02] to-transparent -translate-x-full animate-shimmer" />
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-white uppercase tracking-wider animate-pulse">Running Vision Subprocessor</p>
              <p className="text-[10px] text-zinc-500 leading-relaxed">Aligning light vectors, loading pixel matrices. Reassuring high-speed load.</p>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
