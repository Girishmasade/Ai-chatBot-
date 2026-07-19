import React, { useState } from "react";
import { User as UserIcon, Shield, Laptop, Bell, Key, Settings2 } from "lucide-react";
import { User } from "../types";

interface ProfilePageProps {
  currentUser: User;
  onUpdateName: (newName: string) => void;
}

export default function ProfilePage({ currentUser, onUpdateName }: ProfilePageProps) {
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    onUpdateName(nameInput);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none p-1 text-left">
      {/* Settings Form */}
      <div className="lg:col-span-2 bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-6">
        <div className="space-y-1 pb-4 border-b border-[#1F1F1F]">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Profile Specifications</h4>
          <p className="text-[10px] text-zinc-500">Update account preferences and system markers</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Public Nickname</label>
              <input
                id="profile-name-input"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Identity</label>
              <input
                id="profile-email-input"
                type="email"
                disabled
                value={currentUser.email}
                className="w-full bg-[#1A1A1A]/50 border border-[#242424] rounded-xl p-3 text-xs text-zinc-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            {successMsg ? (
              <span className="text-[10px] text-emerald-500 font-bold uppercase">✓ Credentials updated successfully</span>
            ) : (
              <span className="text-[9px] text-zinc-500 font-mono">// Changes save locally on client side</span>
            )}

            <button
              id="profile-btn-save"
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition shadow-lg shadow-amber-500/15"
            >
              Save Credentials
            </button>
          </div>
        </form>
      </div>

      {/* Account Info Cards */}
      <div className="space-y-6">
        {/* Core Metadata card */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-amber-500/0 via-amber-500/30 to-amber-500/0" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Access Specifications</h4>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Account ID</span>
              <span className="font-mono text-[10px] text-zinc-300">USER-{currentUser.id.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Inference Role</span>
              <span className="font-semibold text-zinc-300">{currentUser.role}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Active Membership</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-wider">{currentUser.tier}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Member Since</span>
              <span className="text-zinc-300">{currentUser.joined}</span>
            </div>
          </div>
        </div>

        {/* Active Device Logs */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Active Credentials sessions</h4>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-2.5 bg-[#1A1A1A]/40 rounded-xl border border-[#242424]">
              <Laptop className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-zinc-200">Chrome Browser (AI Studio Sandbox)</p>
                <p className="text-[10px] text-zinc-500">Development App Link established • Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
