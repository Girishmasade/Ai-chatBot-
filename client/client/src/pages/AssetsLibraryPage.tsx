import React, { useState, useEffect } from "react";
import { FolderHeart, Search, Download, Trash2, Eye, ExternalLink, Image as ImageIcon, MessageSquare, FileText, AlertCircle, Tv } from "lucide-react";
import { AIAsset } from "../types";

export default function AssetsLibraryPage() {
  const [assets, setAssets] = useState<AIAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"All" | "image" | "video" | "chat" | "plan">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<AIAsset | null>(null);

  const fetchAssets = () => {
    setLoading(true);
    fetch("/api/assets")
      .then((res) => res.json())
      .then((data) => {
        setAssets(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to fetch assets library", e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDeleteAsset = async (id: string) => {
    try {
      const res = await fetch("/api/assets/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        if (selectedAsset?.id === id) {
          setSelectedAsset(null);
        }
        fetchAssets();
      }
    } catch (e) {
      console.error("Purge failure", e);
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesTab = selectedTab === "All" || asset.type === selectedTab;
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 select-none p-1 text-left">
      {/* Header */}
      <div className="relative overflow-hidden bg-[#111111] border border-[#242424] rounded-2xl p-6 md:p-8">
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-48 h-48 bg-amber-500/[0.04] blur-2xl rounded-full" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-widest w-fit block">
              Workspace Asset Locker
            </span>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
              My Asset Library
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Inspect and manage your high-fidelity generative archives. View high-definition renders, read chat prompts, and download items.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111111] border border-[#242424] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search prompt archives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 transition"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {[
            { id: "All", label: "All Items" },
            { id: "image", label: "Images" },
            { id: "video", label: "Videos" },
            { id: "chat", label: "Chats" },
            { id: "plan", label: "Plans" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition shrink-0 ${
                selectedTab === tab.id
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/15"
                  : "bg-[#1A1A1A] border border-[#242424] text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Grid View */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="bg-[#111111] border border-[#242424] rounded-2xl p-20 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="bg-[#111111] border border-[#242424] rounded-2xl p-16 text-center space-y-3 flex flex-col items-center">
              <AlertCircle className="w-10 h-10 text-zinc-600" />
              <p className="text-sm font-semibold text-zinc-400">No matching assets cataloged</p>
              <p className="text-xs text-zinc-500">Initialize a creative workflow in our Chat or Image studios first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAssets.map((asset) => {
                const isImage = asset.type === "image";
                const isVideo = asset.type === "video";
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`bg-[#111111] border p-4 rounded-xl space-y-3 cursor-pointer transition relative group overflow-hidden ${
                      selectedAsset?.id === asset.id ? "border-amber-500 bg-amber-500/[0.01]" : "border-[#242424] hover:border-zinc-700"
                    }`}
                  >
                    {/* Media Thumbnail */}
                    {isImage && (
                      <div className="h-40 rounded-lg overflow-hidden bg-zinc-900 border border-[#242424] relative">
                        <img
                          src={asset.content}
                          alt={asset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> Image
                        </div>
                      </div>
                    )}

                    {isVideo && (
                      <div className="h-40 rounded-lg overflow-hidden bg-zinc-900 border border-[#242424] relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <Tv className="w-8 h-8 text-amber-500 animate-pulse relative z-10" />
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1 z-20">
                          <Tv className="w-3 h-3" /> Video Core
                        </div>
                        <p className="absolute bottom-2 left-3 right-3 text-[10px] text-zinc-300 font-medium truncate z-20">{asset.title}</p>
                      </div>
                    )}

                    {!isImage && !isVideo && (
                      <div className="h-28 rounded-lg bg-[#18181B]/40 border border-[#242424] p-3 text-left overflow-hidden relative">
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                          {asset.type === "chat" ? <MessageSquare className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                          {asset.type.toUpperCase()}
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-6 leading-relaxed line-clamp-3 italic">
                          "{asset.prompt}"
                        </p>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="space-y-1 text-left pt-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-500 transition truncate">{asset.title}</h4>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        <span>{asset.model}</span>
                        <span>{new Date(asset.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Inspection Panel */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-4">
          <div className="border-b border-[#1F1F1F] pb-3 flex items-center gap-2">
            <FolderHeart className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Asset Inspector</h4>
          </div>

          {selectedAsset ? (
            <div className="space-y-4 text-left">
              {/* Image Preview if applicable */}
              {selectedAsset.type === "image" && (
                <div className="rounded-xl overflow-hidden bg-zinc-900 border border-[#242424]">
                  <img
                    src={selectedAsset.content}
                    alt={selectedAsset.title}
                    className="w-full h-auto object-contain max-h-60"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="space-y-2">
                <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[8px] font-bold uppercase text-zinc-400 font-mono">{selectedAsset.type}</span>
                <h5 className="text-sm font-bold text-white leading-tight">{selectedAsset.title}</h5>
                <p className="text-[10px] text-zinc-500 font-mono">{selectedAsset.model} • {new Date(selectedAsset.timestamp).toLocaleString()}</p>
              </div>

              <div className="space-y-1.5 bg-[#18181B]/60 border border-[#242424] p-3 rounded-xl">
                <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Source Prompt</p>
                <p className="text-xs text-zinc-300 leading-relaxed italic">"{selectedAsset.prompt}"</p>
              </div>

              {selectedAsset.type !== "image" && selectedAsset.type !== "video" && (
                <div className="space-y-1.5 bg-[#18181B]/60 border border-[#242424] p-3 rounded-xl max-h-48 overflow-y-auto custom-scrollbar">
                  <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Generated Payload</p>
                  <p className="text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">{selectedAsset.content}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                {selectedAsset.type === "image" ? (
                  <a
                    href={selectedAsset.content}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Save File
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedAsset.content);
                      alert("Asset payload copied to clipboard");
                    }}
                    className="py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                  >
                    Copy Payload
                  </button>
                )}

                <button
                  onClick={() => handleDeleteAsset(selectedAsset.id)}
                  className="py-2 rounded-lg bg-[#1F1F1F] hover:bg-rose-950/10 border border-[#242424] hover:border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Purge Asset
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-zinc-600 space-y-2 flex flex-col items-center">
              <Eye className="w-8 h-8 opacity-40" />
              <p className="text-xs">Select an asset from the grid to trigger high-fidelity inspection controls</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
