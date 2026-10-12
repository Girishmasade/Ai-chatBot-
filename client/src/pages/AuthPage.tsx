import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Shield,
  ShieldCheck,
  Zap,
  RefreshCw,
  Sparkles,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { env } from "../config/envImport";
import { useGetConfigQuery } from "../redux/api/apiSlice";

interface AuthPageProps {
  onLoginSuccess?: (email: string, name: string) => void;
  onBackToLanding: () => void;
}

// Official Multicolored Google 'G' Icon
function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function AuthPage({ onBackToLanding }: AuthPageProps) {
  const { data: configData } = useGetConfigQuery();
  const branding = configData?.branding || (configData as any)?.data?.branding;

  const [isRedirecting, setIsRedirecting] = useState(false);

  // Google OAuth URL redirecting to backend endpoint
  const BACKEND_URL = env.API_URL;
  const googleAuthUrl = `${BACKEND_URL}/api/v1/auth/google`;

  const handleGoogleLogin = () => {
    setIsRedirecting(true);
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-screen w-full flex bg-[#090909] relative text-white overflow-hidden font-sans">
      {/* Background vector grid and ambient glow orbs */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
      <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Main Split Screen Container */}
      <div className="w-full flex flex-col lg:flex-row relative z-10">

        {/* 1. VISUAL ANIMATION / TELEMETRY COMPONENT (Left Side) */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-[#0C0C0C] border-r border-[#1F1F1F] relative overflow-hidden">
          {/* Subtle Ambient light grids */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.005] to-transparent pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="flex items-center gap-3">
            {branding?.mainLogo || branding?.logoImage ? (
              <img
                src={branding.mainLogo || branding.logoImage}
                alt="Brand Logo"
                className="h-9 max-w-[140px] object-contain"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-950/40 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/20 p-1 overflow-hidden">
                <img
                  src={branding?.favicon || "/faviconGochat.png"}
                  alt={branding?.appName || "GoChat AI"}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Central Cryptographic / Visual Rings */}
          <div className="relative flex-1 flex flex-col items-center justify-center my-10">
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Outer Dashed Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-zinc-800 rounded-full"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500/40 rounded-full blur-[1px]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500/40 rounded-full blur-[1px]" />
              </motion.div>

              {/* Inner Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border border-zinc-800/60 rounded-full"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-500/60 rounded-full" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-500/60 rounded-full" />
              </motion.div>

              {/* Glowing Core Orb */}
              <motion.div
                animate={{
                  scale: [1, 1.04, 1],
                  opacity: [0.85, 1, 0.85],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-amber-500/15 via-amber-500/[0.02] to-transparent border border-amber-500/20 flex flex-col items-center justify-center p-4 text-center shadow-[0_0_50px_rgba(245,158,11,0.04)]"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-2">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                  Google SSO Gateway
                </p>
                <p className="text-[8px] text-zinc-500 font-mono mt-0.5 uppercase tracking-widest">
                  Sign In & Sign Up Enabled
                </p>
              </motion.div>

              {/* Floating Orbiting Satellite Badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 left-10 p-2.5 bg-[#121212]/90 border border-zinc-800 rounded-xl flex items-center gap-2 shadow-lg"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <div className="text-left">
                  <p className="text-[8px] font-bold text-white uppercase">Secured Port</p>
                  <p className="text-[7px] text-zinc-500 font-mono">TLS_1.3 // AES_256</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 right-10 p-2.5 bg-[#121212]/90 border border-zinc-800 rounded-xl flex items-center gap-2 shadow-lg"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <div className="text-left">
                  <p className="text-[8px] font-bold text-white uppercase">OAuth 2.0 Auth</p>
                  <p className="text-[7px] text-zinc-500 font-mono">AUTO_PROVISIONING</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Telemetry Handshake Logs */}
          <div className="space-y-2 text-left">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
              Workspace Connection Status
            </span>
            <div className="bg-[#121212] border border-zinc-900 rounded-xl p-3.5 font-mono text-[9px] text-zinc-500 space-y-1">
              <p className="flex items-center justify-between">
                <span>&gt; CONNECTION_STABILITY_SECURED</span>
                <span className="text-emerald-500 font-bold">OK</span>
              </p>
              <p className="flex items-center justify-between">
                <span>&gt; AUTH_FLOW_MODE</span>
                <span className="text-amber-500 font-bold">SIGNIN_AND_SIGNUP</span>
              </p>
              <p className="flex items-center justify-between">
                <span>&gt; GOOGLE_AUTH_SERVICE</span>
                <span className="text-amber-500 font-bold">READY</span>
              </p>
              <p className="flex items-center justify-between">
                <span>&gt; ZERO_PASSWORD_STORAGE</span>
                <span className="text-emerald-500 font-bold">ENFORCED</span>
              </p>
            </div>
          </div>
        </div>

        {/* 2. AUTHENTICATION ACTION COMPONENT (Right Side) */}
        <div className="flex-1 flex flex-col justify-between p-8 md:p-16 min-h-screen relative overflow-y-auto custom-scrollbar">
          {/* Back to landing button */}
          <button
            id="auth-btn-back"
            onClick={onBackToLanding}
            className="w-fit text-xs text-zinc-500 hover:text-white transition flex items-center gap-1.5 uppercase tracking-widest font-bold border border-zinc-900 bg-[#0F0F0F] rounded-xl px-3.5 py-2 cursor-pointer hover:border-zinc-800"
          >
            ← Back to Landing
          </button>

          {/* Main Action Shell */}
          <div className="w-full max-w-md mx-auto my-auto space-y-8 py-10">
            <div className="space-y-3 text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">
                <Sparkles className="w-3 h-3" />
                Sign In & Sign Up Gateway
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Sign In or Create Account
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Use your Google account to sign in or create a new account in one click. No password or email verification required.
              </p>
            </div>

            {/* Google Login Action Card */}
            <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                  Unified Google Authentication
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Sign In & Sign Up
                </span>
              </div>

              {/* Primary Google Button */}
              <a
                id="auth-btn-google-login"
                href={googleAuthUrl}
                onClick={handleGoogleLogin}
                className={`group relative w-full flex items-center justify-center gap-3.5 py-4 px-6 bg-white hover:bg-zinc-100 text-zinc-950 font-bold rounded-xl shadow-lg shadow-white/5 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer border border-white/30 ${
                  isRedirecting ? "opacity-75 pointer-events-none" : ""
                }`}
              >
                {isRedirecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-zinc-700 animate-spin" />
                    <span className="text-xs tracking-wide">
                      Connecting to Google...
                    </span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-5 h-5 shrink-0" />
                    <span className="text-xs tracking-wide">
                      Continue with Google
                    </span>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all ml-auto" />
                  </>
                )}
              </a>

              {/* Dual Mode Explainer */}
              <div className="p-3 rounded-xl bg-[#0e0e11] border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1.5 text-left">
                <p className="flex items-center gap-1.5 text-zinc-300 font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  One click handles both flows:
                </p>
                <ul className="text-[10px] text-zinc-500 space-y-1 pl-5 list-disc">
                  <li><strong className="text-zinc-300">New user?</strong> Automatically registers your account with free credits.</li>
                  <li><strong className="text-zinc-300">Existing user?</strong> Instantly signs you in to your existing workspace.</li>
                </ul>
              </div>

              {/* Benefits and Security Badges */}
              <div className="pt-2 border-t border-zinc-900/90 space-y-2.5">
                <div className="flex items-center gap-2.5 text-left text-xs text-zinc-400">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Official <strong className="text-zinc-200">Google OAuth 2.0</strong> verification
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-left text-xs text-zinc-400">
                  <div className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Instant access to AI Models, Studio & History
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-left text-xs text-zinc-400">
                  <div className="w-5 h-5 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                    <Lock className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Zero password storage — protected by Google Security
                  </span>
                </div>
              </div>
            </div>

            {/* Terms Reassurance */}
            <p className="text-[11px] text-zinc-600 text-center leading-relaxed">
              By continuing with Google, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

          {/* System Footer Branding */}
          <div className="text-center md:text-left text-[10px] text-zinc-600 font-mono uppercase tracking-widest pt-8 border-t border-zinc-900/60">
            Secure OAuth 2.0 Gateway // © 2026 GoChat AI Core
          </div>
        </div>

      </div>
    </div>
  );
}
