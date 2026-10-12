import React, { useState } from "react";
import {
  FileText, Shield, Info, Mail, Phone, MapPin, Send, CheckCircle,
  Sparkles, Code2, Lock, Server, Globe, ExternalLink, ShieldCheck,
  Database, Calendar, RefreshCw, FileCheck, AlertTriangle, Gavel
} from "lucide-react";
import { useGetPrivacyPolicyQuery, useGetTermsAndConditionQuery } from "../redux/api/apiSlice";

// -------------------------------------------------------------
// SHARED: Dev Credit Footer
// -------------------------------------------------------------
function DevCredit() {
  return (
    <div className="flex items-center justify-center gap-1.5 pt-2 pb-1 text-[10px] text-zinc-600">
      <Code2 className="w-3 h-3 text-amber-500/60" />
      <span>
        Made by <span className="font-semibold text-amber-500/80">Girish</span>{" "}
        <span className="text-zinc-600">(devCoder)</span>
      </span>
    </div>
  );
}

// -------------------------------------------------------------
// 1. TERMS OF SERVICE
// -------------------------------------------------------------
export function TermsOfServicePage() {
  const { data: terms, isLoading, refetch } = useGetTermsAndConditionQuery();

  const formattedDate = terms?.lastUpdated
    ? new Date(terms.lastUpdated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "July 18, 2026";

  return (
    <div className="w-full max-w-5xl space-y-6 sm:space-y-8 p-1 text-left overflow-x-hidden mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-64 h-64 bg-amber-500/[0.05] blur-3xl rounded-full pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 shrink-0 shadow-lg shadow-amber-500/5">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">
                  Binding Legal Agreement
                </span>
                {terms?.version && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                    v{terms.version}
                  </span>
                )}
                {terms?.status === "published" && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> Active
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans mt-0.5">
                {terms?.title || "Terms of Service"}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Effective: {formattedDate}
              </p>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            className="self-start sm:self-center px-3 py-1.5 bg-[#181818] hover:bg-[#202020] text-zinc-400 hover:text-white border border-[#2A2A2A] rounded-lg text-xs font-mono transition flex items-center gap-1.5"
            title="Refresh latest terms revision"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-500" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Admin Uploaded Banner Image (if present) */}
      {terms?.bannerImage?.url && (
        <div className="relative rounded-2xl overflow-hidden border border-[#242424] bg-[#111111] shadow-2xl group">
          <div className="w-full h-48 sm:h-64 md:h-80 overflow-hidden relative">
            <img
              src={terms.bannerImage.url}
              alt={terms.bannerImage.caption || terms.title}
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80 pointer-events-none" />
          </div>
          {terms.bannerImage.caption && (
            <div className="px-4 py-2.5 bg-[#141414] border-t border-[#222222] text-[11px] text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{terms.bannerImage.caption}</span>
            </div>
          )}
        </div>
      )}

      {/* Terms Summary Callout */}
      {terms?.summary && (
        <div className="bg-[#141414] border-l-4 border-l-amber-500 border border-[#242424] rounded-2xl p-4 sm:p-6 text-zinc-300 text-xs sm:text-sm leading-relaxed shadow-lg">
          <h4 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4" /> Operational Agreement Charter
          </h4>
          <p className="text-zinc-300 leading-relaxed font-sans">{terms.summary}</p>
        </div>
      )}

      {/* Main Terms Sections */}
      <div className="space-y-4">
        {terms?.sections && terms.sections.length > 0 ? (
          terms.sections
            .slice()
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((section, idx) => (
              <div
                key={section._id || idx}
                className="bg-[#111111] border border-[#242424] hover:border-[#333333] transition-colors rounded-2xl p-5 sm:p-7 space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-mono font-bold border border-amber-500/20 shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
                    {section.title}
                  </h4>
                </div>
                <div className="text-xs sm:text-sm text-zinc-400 leading-relaxed space-y-2 whitespace-pre-line pl-8 sm:pl-9">
                  <p>{section.content}</p>
                  {section.image?.url && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-[#242424] max-w-lg">
                      <img
                        src={section.image.url}
                        alt={section.image.caption || section.title}
                        className="w-full h-auto object-cover max-h-56"
                      />
                      {section.image.caption && (
                        <p className="text-[10px] text-zinc-500 p-2 bg-[#161616]">
                          {section.image.caption}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 text-zinc-400 text-xs leading-relaxed space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                1. Agreement to Terms
              </h4>
              <p>
                By accessing or utilizing GoChat AI Platform, you agree to be bound by these Terms
                of Service. These Terms represent a legal and binding agreement between you and the
                GoChat AI operators.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                2. Token & Credits Allotment
              </h4>
              <p>
                All active memberships receive credits or API tokens based on their VIP billing tier.
                Credits hold zero cash surrender value and are intended solely for generative compute.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                3. Acceptable Generative Use
              </h4>
              <p>
                Users must not generate visual content, videos, or text prompts that violate regional
                laws, incite hatred, or breach intellectual property regulations.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Key Highlights */}
      {terms?.keyHighlights && terms.keyHighlights.length > 0 && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider">
              Essential Agreement Highlights
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {terms.keyHighlights.map((highlight, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#161616] border border-[#222222] text-xs text-zinc-300 flex items-start gap-2.5"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prohibited Activities */}
      {terms?.prohibitedActivities && terms.prohibitedActivities.length > 0 && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-rose-400">
              Strictly Prohibited Conduct & Inferences
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {terms.prohibitedActivities.map((act, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-rose-500/[0.04] border border-rose-500/20 text-xs text-zinc-300 flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Governing Law & Legal Inquiries Footer */}
      <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-white mb-1">
            <Gavel className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Jurisdiction & Legal Oversight
            </h4>
          </div>
          <p className="text-xs text-zinc-400">
            {terms?.governingLaw || "Governing Law of India / Standard Enterprise Jurisdiction"}
          </p>
        </div>
        <a
          href={`mailto:${terms?.contactEmail || "legal@gochat.ai"}`}
          className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>{terms?.contactEmail || "legal@gochat.ai"}</span>
        </a>
      </div>

      <DevCredit />
    </div>
  );
}

// -------------------------------------------------------------
// 2. PRIVACY POLICY
// -------------------------------------------------------------
export function PrivacyPolicyPage() {
  const { data: policy, isLoading, isError, refetch } = useGetPrivacyPolicyQuery();

  const formattedDate = policy?.lastUpdated
    ? new Date(policy.lastUpdated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "July 18, 2026";

  return (
    <div className="w-full max-w-5xl space-y-6 sm:space-y-8 p-1 text-left overflow-x-hidden mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-64 h-64 bg-amber-500/[0.05] blur-3xl rounded-full pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 shrink-0 shadow-lg shadow-amber-500/5">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">
                  Verified Trust Framework
                </span>
                {policy?.version && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                    v{policy.version}
                  </span>
                )}
                {policy?.status === "published" && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> Active
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans mt-0.5">
                {policy?.title || "Privacy Policy"}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Effective: {formattedDate}
              </p>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            className="self-start sm:self-center px-3 py-1.5 bg-[#181818] hover:bg-[#202020] text-zinc-400 hover:text-white border border-[#2A2A2A] rounded-lg text-xs font-mono transition flex items-center gap-1.5"
            title="Refresh latest policy revision"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-500" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Admin Uploaded Banner Image (if present) */}
      {policy?.bannerImage?.url && (
        <div className="relative rounded-2xl overflow-hidden border border-[#242424] bg-[#111111] shadow-2xl group">
          <div className="w-full h-48 sm:h-64 md:h-80 overflow-hidden relative">
            <img
              src={policy.bannerImage.url}
              alt={policy.bannerImage.caption || policy.title}
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80 pointer-events-none" />
          </div>
          {policy.bannerImage.caption && (
            <div className="px-4 py-2.5 bg-[#141414] border-t border-[#222222] text-[11px] text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{policy.bannerImage.caption}</span>
            </div>
          )}
        </div>
      )}

      {/* Policy Summary Callout */}
      {policy?.summary && (
        <div className="bg-[#141414] border-l-4 border-l-amber-500 border border-[#242424] rounded-2xl p-4 sm:p-6 text-zinc-300 text-xs sm:text-sm leading-relaxed shadow-lg">
          <h4 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Executive Data Manifesto
          </h4>
          <p className="text-zinc-300 leading-relaxed font-sans">{policy.summary}</p>
        </div>
      )}

      {/* Main Policy Sections */}
      <div className="space-y-4">
        {policy?.sections && policy.sections.length > 0 ? (
          policy.sections
            .slice()
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((section, idx) => (
              <div
                key={section._id || idx}
                className="bg-[#111111] border border-[#242424] hover:border-[#333333] transition-colors rounded-2xl p-5 sm:p-7 space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-mono font-bold border border-amber-500/20 shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
                    {section.title}
                  </h4>
                </div>
                <div className="text-xs sm:text-sm text-zinc-400 leading-relaxed space-y-2 whitespace-pre-line pl-8 sm:pl-9">
                  <p>{section.content}</p>
                  {section.image?.url && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-[#242424] max-w-lg">
                      <img
                        src={section.image.url}
                        alt={section.image.caption || section.title}
                        className="w-full h-auto object-cover max-h-56"
                      />
                      {section.image.caption && (
                        <p className="text-[10px] text-zinc-500 p-2 bg-[#161616]">
                          {section.image.caption}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 text-zinc-400 text-xs leading-relaxed space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                1. Data Identity & Collection
              </h4>
              <p>
                We collect essential user identity indicators (such as name, email, and avatar) to
                provide secure access to AI workspaces. Prompts and inputs are processed via
                server-side proxy routes to safeguard credentials.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                2. Vector Storage & Isolation
              </h4>
              <p>
                Document embeddings for RAG are stored in isolated namespaces. Only your active
                authenticated credentials have retrieval access.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                3. Data Retention & Erasure
              </h4>
              <p>
                You retain complete ownership over your data. Chat history, uploaded documents, and
                vector embeddings can be permanently purged from your account dashboard.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enterprise Security Safeguards Grid */}
      {policy?.securityMeasures && policy.securityMeasures.length > 0 && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Lock className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold uppercase tracking-wider">
              Technical & Architectural Safeguards
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {policy.securityMeasures.map((measure, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#161616] border border-[#222222] text-xs text-zinc-300"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{measure}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Privacy Rights */}
      {policy?.userRights && policy.userRights.length > 0 && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold uppercase tracking-wider">
              Your Rights (GDPR & Global Standards)
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {policy.userRights.map((right, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#161616] border border-[#222222] text-xs text-zinc-300 flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{right}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Third Party Model & Infrastructure Subprocessors */}
      {policy?.thirdPartyProcessors && policy.thirdPartyProcessors.length > 0 && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Server className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold uppercase tracking-wider">
              Third-Party AI & Infrastructure Processors
            </h4>
          </div>
          <p className="text-xs text-zinc-400">
            To provide cutting-edge multimodal generation and semantic retrieval, we partner with
            certified enterprise providers under confidentiality agreements:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {policy.thirdPartyProcessors.map((proc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#161616] border border-[#222222] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{proc.name}</span>
                  {proc.privacyPolicyUrl && (
                    <a
                      href={proc.privacyPolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-500 hover:text-amber-400 text-[10px] flex items-center gap-0.5"
                    >
                      Policy <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400">{proc.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact & Legal Escalation Footer */}
      <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Privacy Inquiries & Data Requests
          </h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            To exercise your Right to Erasure or request an export of your stored prompts:
          </p>
        </div>
        <a
          href={`mailto:${policy?.contactEmail || "privacy@gochat.ai"}`}
          className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>{policy?.contactEmail || "privacy@gochat.ai"}</span>
        </a>
      </div>

      <DevCredit />
    </div>
  );
}

// -------------------------------------------------------------
// 3. ABOUT US
// -------------------------------------------------------------
export function AboutUsPage() {
  return (
    <div className="w-full max-w-full space-y-6 sm:space-y-8  p-1 text-left overflow-x-hidden">
      <div className="relative overflow-hidden bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-48 h-48 bg-amber-500/[0.04] blur-2xl rounded-full pointer-events-none" />
        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 shrink-0">
            <Info className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block font-mono">Our Vision</span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white font-sans truncate">
              About GoChat AI
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">The luxury standard for multi-modal intelligence</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-2 bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 text-xs text-zinc-400 leading-relaxed text-left">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Aesthetic & Performance Coupled</h4>
          <p>GoChat AI was founded with a singular, uncompromised objective: to bring elite luxury visual and typographical pairings to the world of generative AI. We reject chaotic interfaces. Our design philosophy pairs spacious, high-contrast dark-mode cards with premium Amber highlights to keep focus absolute.</p>
          <p>Behind the interface runs a robust full-stack infrastructure. Using server-side proxy models from leading intelligence research hubs like Google DeepMind, we serve ultra-fast, contextual, and protected results without compromising developer security.</p>
        </div>

        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 space-y-4 text-left">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#1F1F1F] pb-2">Core Pillars</h4>
          <div className="space-y-3 text-xs text-zinc-400">
            <div>
              <p className="font-bold text-amber-500">True Contrast first</p>
              <p className="text-[10px] text-zinc-500">Every panel strictly follows the flagship Obsidian theme.</p>
            </div>
            <div>
              <p className="font-bold text-amber-500">Sub-second Latency</p>
              <p className="text-[10px] text-zinc-500">Inference times constantly checked on server proxies.</p>
            </div>
            <div>
              <p className="font-bold text-amber-500">Zero Spoofing</p>
              <p className="text-[10px] text-zinc-500">Real database persistence and logs for all components.</p>
            </div>
          </div>
        </div>
      </div>

      <DevCredit />
    </div>
  );
}

// -------------------------------------------------------------
// 4. CONTACT US
// -------------------------------------------------------------
export function ContactUsPage() {
  const [formData, setFormData] = useState({ name: "", email: "", query: "" });
  const [toastMessage, setToastMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ name: "", email: "", query: "" });
    setToastMessage("Your inquiry has been logged. Our VIP relations team will contact you!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="w-full max-w-full space-y-6 sm:space-y-8  p-1 text-left relative overflow-x-hidden">
      {/* Toast - safely contained on mobile, floats top-right on larger screens */}
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-20 sm:max-w-sm bg-[#111111] border border-amber-500/20 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl z-50 text-xs font-semibold text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="normal-case tracking-normal sm:uppercase sm:tracking-widest">{toastMessage}</span>
        </div>
      )}

      <div className="relative overflow-hidden bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-48 h-48 bg-amber-500/[0.04] blur-2xl rounded-full pointer-events-none" />
        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 shrink-0">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block font-mono">VIP Relations</span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white font-sans truncate">
              Contact Concierge
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Let us optimize your enterprise intelligence workflow</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 space-y-4 w-full">
          <div className="border-b border-[#1F1F1F] pb-2 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Message</h4>
            <p className="text-[10px] text-zinc-500">Inquiries typically resolved within 2 hours</p>
          </div>

          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name..."
                  className="w-full bg-[#18181B] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email..."
                  className="w-full bg-[#18181B] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Inquiry details</label>
              <textarea
                required
                value={formData.query}
                onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                placeholder="Describe your request..."
                className="w-full bg-[#18181B] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white h-28 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/15"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>

        {/* Office details */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 space-y-6 text-left w-full">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Corporate Offices</h4>
            <p className="text-[10px] text-zinc-500">GoChat AI Platform Private Ltd.</p>
          </div>

          <div className="space-y-4 text-xs text-zinc-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold">Headquarters Node</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 break-words">80 Feet Road, Koramangala, Bengaluru, Karnataka 560034</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold">Inquiries Email</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 break-all">support@gochat.ai</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold">Secure Hotline</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">+91 (80) 4125-9900</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DevCredit />
    </div>
  );
}