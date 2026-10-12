import React, { useState } from "react";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Upload,
  Calendar,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Gavel,
  Layers,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  useGetAdminTermsAndConditionsQuery,
  useCreateTermsAndConditionMutation,
  useUpdateTermsAndConditionMutation,
  useSetCurrentTermsAndConditionMutation,
  useDeleteTermsAndConditionMutation,
  useSeedTermsAndConditionMutation,
} from "../../redux/api/apiSlice";
import CommonModal from "../CommonModal";
import ConfirmModal from "../ConfirmModal";
import type { TermsAndCondition, TermsSection } from "../../types";
import toast from "react-hot-toast";

export default function AdminTermsTab() {
  const { data: termsList = [], isLoading, refetch } = useGetAdminTermsAndConditionsQuery();
  const [createTerms, { isLoading: isCreating }] = useCreateTermsAndConditionMutation();
  const [updateTerms, { isLoading: isUpdating }] = useUpdateTermsAndConditionMutation();
  const [setCurrentTerms, { isLoading: isSettingCurrent }] = useSetCurrentTermsAndConditionMutation();
  const [deleteTerms, { isLoading: isDeleting }] = useDeleteTermsAndConditionMutation();
  const [seedTerms, { isLoading: isSeeding }] = useSeedTermsAndConditionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerms, setEditingTerms] = useState<TermsAndCondition | null>(null);

  // Form State
  const [title, setTitle] = useState("GoChat AI Terms and Conditions");
  const [version, setVersion] = useState("1.0.0");
  const [status, setStatus] = useState<"published" | "draft" | "archived">("published");
  const [isCurrent, setIsCurrent] = useState(false);
  const [summary, setSummary] = useState("");
  const [contactEmail, setContactEmail] = useState("legal@gochat.ai");
  const [governingLaw, setGoverningLaw] = useState("Laws of India / Standard Enterprise Jurisdiction");
  const [changelog, setChangelog] = useState("");
  const [bannerCaption, setBannerCaption] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const [sections, setSections] = useState<TermsSection[]>([]);
  const [keyHighlightsInput, setKeyHighlightsInput] = useState("");
  const [prohibitedActivitiesInput, setProhibitedActivitiesInput] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("GoChat AI Terms and Conditions");
    setVersion("1.0.0");
    setStatus("published");
    setIsCurrent(false);
    setSummary("");
    setContactEmail("legal@gochat.ai");
    setGoverningLaw("Laws of India / Standard Enterprise Jurisdiction");
    setChangelog("");
    setBannerCaption("");
    setBannerFile(null);
    setBannerPreview("");
    setSections([
      {
        title: "1. Acceptance of Terms & Eligibility",
        content: "By using the platform, you agree to comply with our terms of service and acceptable computing policies.",
        order: 1,
        icon: "FileCheck",
      },
      {
        title: "2. Token System & Billing",
        content: "Inference tokens hold zero cash surrender value and are intended solely for generative compute.",
        order: 2,
        icon: "CreditCard",
      },
    ]);
    setKeyHighlightsInput("Non-refundable token credits, User ownership of generated assets, Moderated safety filters");
    setProhibitedActivitiesInput("Prompt injection attacks, Generating illegal or abusive content, Reverse engineering inference proxies");
    setEditingTerms(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: TermsAndCondition) => {
    setEditingTerms(t);
    setTitle(t.title || "GoChat AI Terms and Conditions");
    setVersion(t.version || "1.0.0");
    setStatus(t.status || "published");
    setIsCurrent(Boolean(t.isCurrent));
    setSummary(t.summary || "");
    setContactEmail(t.contactEmail || "legal@gochat.ai");
    setGoverningLaw(t.governingLaw || "Laws of India / Standard Enterprise Jurisdiction");
    setChangelog(t.changelog || "");
    setBannerCaption(t.bannerImage?.caption || "");
    setBannerPreview(t.bannerImage?.url || "");
    setBannerFile(null);
    setSections(t.sections && t.sections.length > 0 ? t.sections : []);
    setKeyHighlightsInput(t.keyHighlights ? t.keyHighlights.join(", ") : "");
    setProhibitedActivitiesInput(t.prohibitedActivities ? t.prohibitedActivities.join(", ") : "");
    setIsModalOpen(true);
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        title: `Section ${sections.length + 1}`,
        content: "",
        order: sections.length + 1,
        icon: "FileText",
      },
    ]);
  };

  const handleUpdateSection = (idx: number, field: keyof TermsSection, value: any) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], [field]: value };
    setSections(updated);
  };

  const handleRemoveSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a terms title");
      return;
    }
    if (!version.trim()) {
      toast.error("Please specify a version");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("version", version.trim());
    formData.append("status", status);
    formData.append("isCurrent", String(isCurrent));
    formData.append("summary", summary.trim());
    formData.append("contactEmail", contactEmail.trim());
    formData.append("governingLaw", governingLaw.trim());
    formData.append("changelog", changelog.trim());
    formData.append("bannerCaption", bannerCaption.trim());

    if (bannerFile) {
      formData.append("bannerImage", bannerFile);
    }

    formData.append("sections", JSON.stringify(sections));

    const highlightsArr = keyHighlightsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    formData.append("keyHighlights", JSON.stringify(highlightsArr));

    const prohibitedArr = prohibitedActivitiesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    formData.append("prohibitedActivities", JSON.stringify(prohibitedArr));

    try {
      if (editingTerms) {
        await updateTerms({ id: editingTerms._id, body: formData }).unwrap();
        toast.success("Terms & Conditions updated successfully!");
      } else {
        await createTerms(formData).unwrap();
        toast.success("New Terms & Conditions revision created!");
      }
      setIsModalOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Failed to save terms and conditions";
      toast.error(msg);
    }
  };

  const handleSetCurrent = async (id: string) => {
    try {
      await setCurrentTerms({ id }).unwrap();
      toast.success("Revision activated as live Terms & Conditions!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to set as current terms");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTerms({ id }).unwrap();
      toast.success("Terms and conditions revision deleted");
      setDeleteConfirmId(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete terms revision");
    }
  };

  const handleSeed = async () => {
    try {
      await seedTerms().unwrap();
      toast.success("Seeded default GoChat AI Terms & Conditions!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to seed terms");
    }
  };

  const activeTerms = termsList.find((t) => t.isCurrent);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#242424] pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-amber-500" />
            <span>Terms and Conditions CMS</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Author legal agreements, upload cover banners, customize operational clauses, and toggle
            the active live version visible to all users.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="px-3.5 py-2 text-xs font-semibold text-zinc-300 bg-[#161616] hover:bg-[#202020] border border-[#2A2A2A] rounded-xl transition flex items-center gap-1.5"
            title="Seed standard GoChat AI enterprise terms"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Seed Standard</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Version</span>
          </button>
        </div>
      </div>

      {/* Currently Active Terms Card */}
      {activeTerms && (
        <div className="bg-[#111111] border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.03] blur-3xl rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
            <div className="flex items-start gap-4">
              {activeTerms.bannerImage?.url ? (
                <div className="w-24 h-16 rounded-xl overflow-hidden border border-[#242424] shrink-0 bg-black">
                  <img
                    src={activeTerms.bannerImage.url}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-8 h-8" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> LIVE FOR USERS
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-bold">
                    v{activeTerms.version}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{activeTerms.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-1 max-w-xl mt-0.5">
                  {activeTerms.summary || "Standard platform generative terms of service agreement."}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-zinc-500 mt-2 font-mono">
                  <span>Sections: {activeTerms.sections?.length || 0}</span>
                  <span>Contact: {activeTerms.contactEmail}</span>
                  <span>
                    Updated: {new Date(activeTerms.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenEdit(activeTerms)}
                className="px-3.5 py-1.5 bg-[#181818] hover:bg-[#222222] text-amber-400 border border-amber-500/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Live Version</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Ledger Table */}
      <div className="bg-[#111111] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#242424] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Revision Ledger ({termsList.length})
            </h3>
          </div>
          <button
            onClick={() => refetch()}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#1A1A1A] transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-500" : ""}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161616] text-zinc-400 font-mono uppercase text-[10px] border-b border-[#242424]">
              <tr>
                <th className="px-5 py-3">Version</th>
                <th className="px-5 py-3">Title & Summary</th>
                <th className="px-5 py-3">Cover Banner</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Sections</th>
                <th className="px-5 py-3">Last Updated</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {termsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-zinc-500">
                    No terms and conditions found. Click "Seed Standard" or "New Version" above to create one.
                  </td>
                </tr>
              ) : (
                termsList.map((t) => (
                  <tr key={t._id} className="hover:bg-[#151515] transition">
                    <td className="px-5 py-4 font-mono font-bold text-white">
                      <div className="flex items-center gap-1.5">
                        <span>v{t.version}</span>
                        {t.isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-semibold text-zinc-200 truncate">{t.title}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{t.summary || "No summary"}</p>
                    </td>
                    <td className="px-5 py-4">
                      {t.bannerImage?.url ? (
                        <div className="w-14 h-9 rounded-md overflow-hidden border border-[#242424] bg-black">
                          <img
                            src={t.bannerImage.url}
                            alt="Banner"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-zinc-600 font-mono text-[10px]">No banner</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          t.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : t.status === "draft"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-zinc-400">
                      {t.sections?.length || 0}
                    </td>
                    <td className="px-5 py-4 text-zinc-400 font-mono text-[11px]">
                      {new Date(t.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!t.isCurrent && (
                          <button
                            onClick={() => handleSetCurrent(t._id)}
                            disabled={isSettingCurrent}
                            className="px-2 py-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded transition"
                            title="Activate as current live terms"
                          >
                            Set Live
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 text-zinc-400 hover:text-amber-500 transition rounded hover:bg-[#202020]"
                          title="Edit terms"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {!t.isCurrent && (
                          <button
                            onClick={() => setDeleteConfirmId(t._id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 transition rounded hover:bg-[#202020]"
                            title="Delete terms"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Terms Modal */}
      <CommonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTerms ? `Edit Terms Revision (v${version})` : "Create New Terms and Conditions"}
        maxWidth="max-w-5xl xl:max-w-6xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-left text-xs">
          {/* Card 1: Agreement Metadata & Publication Status */}
          <div className="p-4 bg-[#181818]/90 rounded-2xl border border-[#252525] space-y-4 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#242424] gap-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Gavel className="w-4 h-4 text-amber-500" />
                <span>Agreement Metadata & Publishing Status</span>
              </div>
              <label className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-[#141414] hover:bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl cursor-pointer transition select-none">
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <span className={`text-xs font-semibold ${isCurrent ? "text-amber-400" : "text-zinc-400"}`}>
                  {isCurrent ? "✓ Active Live Agreement" : "Set as Active Live Agreement"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1.5 font-semibold">Agreement Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-[#121212] border border-[#282828] focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-xl px-3.5 py-2.5 text-white outline-none transition"
                  placeholder="GoChat AI Terms and Conditions"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 font-semibold">Version *</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  required
                  className="w-full bg-[#121212] border border-[#282828] focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-xl px-3.5 py-2.5 text-white outline-none font-mono transition"
                  placeholder="1.0.0"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 font-semibold">Publishing Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#121212] border border-[#282828] focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white outline-none transition cursor-pointer"
                >
                  <option value="published">Published (Ready for users)</option>
                  <option value="draft">Draft (Admin internal work)</option>
                  <option value="archived">Archived (Deprecated revision)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Cover Banner & Agreement Overview Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Banner Image Card */}
            <div className="p-4 bg-[#181818]/90 rounded-2xl border border-[#252525] space-y-3 flex flex-col justify-between">
              <div>
                <label className="block text-zinc-300 font-semibold mb-2 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-amber-500" />
                  <span>Cover Banner Image</span>
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerFileChange}
                    className="w-full text-zinc-400 text-xs file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer transition"
                  />
                  <input
                    type="text"
                    value={bannerCaption}
                    onChange={(e) => setBannerCaption(e.target.value)}
                    placeholder="Banner Caption (e.g. Terms Agreement & Generative Usage Charter)"
                    className="w-full bg-[#121212] border border-[#282828] focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white outline-none text-xs transition"
                  />
                </div>
              </div>
              {bannerPreview && (
                <div className="mt-3 w-full h-36 rounded-xl overflow-hidden border border-[#282828] relative group">
                  <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setBannerFile(null);
                      setBannerPreview("");
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-black text-rose-400 rounded-lg transition"
                    title="Remove banner"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Agreement Overview Card */}
            <div className="p-4 bg-[#181818]/90 rounded-2xl border border-[#252525] space-y-2 flex flex-col">
              <label className="block text-zinc-300 font-semibold flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Agreement Overview / Summary</span>
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={bannerPreview ? 6 : 4}
                className="w-full flex-1 min-h-[96px] bg-[#121212] border border-[#282828] focus:border-amber-500 rounded-xl p-3.5 text-white outline-none leading-relaxed resize-y transition"
                placeholder="High-level manifesto summarizing binding user agreement terms, computational licensing, and acceptable use policy..."
              />
            </div>
          </div>

          {/* Card 3: Clauses / Sections Builder */}
          <div className="p-4 bg-[#181818]/90 rounded-2xl border border-[#252525] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span className="text-white font-semibold text-sm">Agreement Clauses & Sections ({sections.length})</span>
              </div>
              <button
                type="button"
                onClick={handleAddSection}
                className="px-3 py-1.5 text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1.5 custom-scrollbar">
              {sections.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-[#282828] rounded-xl text-zinc-500">
                  No clauses yet. Click "+ Add Section" above to define terms and conditions.
                </div>
              ) : (
                sections.map((section, idx) => (
                  <div key={idx} className="p-3.5 sm:p-4 bg-[#131313] border border-[#252525] rounded-xl space-y-2.5 hover:border-[#353535] transition">
                    <div className="flex items-center justify-between gap-3">
                      <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-xs font-mono font-bold shrink-0">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleUpdateSection(idx, "title", e.target.value)}
                        placeholder="Clause Title (e.g. 1. Acceptance of Terms & Eligibility)"
                        className="flex-1 bg-[#1A1A1A] border border-[#2C2C2C] focus:border-amber-500 rounded-xl px-3 py-2 text-white font-semibold text-xs outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                        title="Remove clause"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={section.content}
                      onChange={(e) => handleUpdateSection(idx, "content", e.target.value)}
                      rows={3}
                      placeholder="Detailed clause content, terms, and binding agreements..."
                      className="w-full bg-[#181818] border border-[#282828] focus:border-amber-500 rounded-xl p-3 text-zinc-200 text-xs outline-none leading-relaxed transition"
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card 4: Highlights & Prohibited Activities */}
          <div className="p-4 bg-[#181818]/90 rounded-2xl border border-[#252525] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 mb-1.5 font-semibold">Key Highlights (comma-separated)</label>
                <input
                  type="text"
                  value={keyHighlightsInput}
                  onChange={(e) => setKeyHighlightsInput(e.target.value)}
                  placeholder="Non-refundable credits, User output ownership"
                  className="w-full bg-[#121212] border border-[#282828] focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white outline-none transition"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1.5 font-semibold">Prohibited Conduct (comma-separated)</label>
                <input
                  type="text"
                  value={prohibitedActivitiesInput}
                  onChange={(e) => setProhibitedActivitiesInput(e.target.value)}
                  placeholder="Prompt injection, Reverse engineering, Scraping"
                  className="w-full bg-[#121212] border border-[#282828] focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#242424]">
              <div>
                <label className="block text-zinc-400 mb-1.5 font-semibold">Governing Law / Jurisdiction</label>
                <input
                  type="text"
                  value={governingLaw}
                  onChange={(e) => setGoverningLaw(e.target.value)}
                  className="w-full bg-[#121212] border border-[#282828] focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white outline-none transition"
                  placeholder="Laws of India / Standard Enterprise Jurisdiction"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1.5 font-semibold">Legal Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[#121212] border border-[#282828] focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white outline-none transition"
                  placeholder="legal@gochat.ai"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#242424]">
              <label className="block text-zinc-400 mb-1.5 font-semibold">Changelog Notes</label>
              <input
                type="text"
                value={changelog}
                onChange={(e) => setChangelog(e.target.value)}
                className="w-full bg-[#121212] border border-[#282828] focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white outline-none transition"
                placeholder="What was amended in this revision (e.g. Revised token billing terms)..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#242424] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-zinc-400 hover:text-white transition font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isCreating || isUpdating
                ? "Saving..."
                : editingTerms
                ? "Save Changes"
                : "Create Revision"}
            </button>
          </div>
        </form>
      </CommonModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        title="Delete Terms Revision?"
        message="Are you sure you want to permanently delete this Terms and Conditions revision? This action cannot be undone."
        confirmText="Delete Revision"
      />
    </div>
  );
}
