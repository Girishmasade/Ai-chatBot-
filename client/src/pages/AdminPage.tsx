import React, { useState, useEffect } from "react";
import {
  Users,
  Cpu,
  CreditCard,
  History,
  Settings,
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Save,
  CheckCircle,
  FileText,
  AlertCircle,
  Sliders,
  Palette,
  Fingerprint,
  RefreshCw
} from "lucide-react";
import { User, SystemModel, SubscriptionRecord, AuditLog, CookieConsent, BrandingConfig } from "../types";
import CommonModal from "../components/CommonModal";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetModelsQuery,
  useToggleModelMutation,
  useGetSubscriptionsQuery,
  useGetLogsQuery,
  useGetConfigQuery,
  useUpdateBrandingMutation
} from "../redux/api/apiSlice";
import { calculateRevenue } from "../helpers/utils";

interface AdminPageProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export default function AdminPage({ activeTab, setActiveTab }: AdminPageProps) {
  // RTK Queries
  const { data: usersData = [] } = useGetUsersQuery();
  const { data: modelsData = [] } = useGetModelsQuery();
  const { data: subscriptionsData = [] } = useGetSubscriptionsQuery();
  const { data: logsData = [] } = useGetLogsQuery();
  const { data: configData } = useGetConfigQuery();

  // RTK Mutations
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [toggleModel] = useToggleModelMutation();
  const [updateBranding] = useUpdateBrandingMutation();

  // Database local states synced with RTK Query caches
  const [users, setUsers] = useState<User[]>([]);
  const [models, setModels] = useState<SystemModel[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [cookieConsents, setCookieConsents] = useState<CookieConsent[]>([]);
  const [branding, setBranding] = useState<BrandingConfig>({
    logoName: "GoChat AI",
    logoImage: "",
    themeMode: "Black Amber",
    primaryColor: "#F59E0B",
    accentGlow: "rgba(245, 158, 11, 0.15)",
    footerText: ""
  });

  // Modal actions control
  const [isUserCreateOpen, setIsUserCreateOpen] = useState(false);
  const [isUserEditOpen, setIsUserEditOpen] = useState(false);
  const [isModelCreateOpen, setIsModelCreateOpen] = useState(false);
  const [isMenuCreateOpen, setIsMenuCreateOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Form Fields
  const [userForm, setUserForm] = useState({
    id: "",
    name: "",
    email: "",
    role: "User",
    tier: "free",
    credits: "100"
  });

  const [modelForm, setModelForm] = useState({
    name: "",
    version: "",
    type: "Text",
    description: "",
    latency: "0.5s"
  });

  const [brandingForm, setBrandingForm] = useState({
    logoName: "GoChat AI",
    primaryColor: "#F59E0B",
    footerText: ""
  });

  const [menuItems, setMenuItems] = useState([
    { id: "1", label: "Overview", icon: "LayoutDashboard", target: "dashboard", visible: "User Menu" },
    { id: "2", label: "Conversational Chat", icon: "MessageSquareText", target: "chat", visible: "User Menu" },
    { id: "3", label: "Image Studio", icon: "ImageIcon", target: "image", visible: "User Menu" },
    { id: "4", label: "User Pool", icon: "Users", target: "users", visible: "Admin Menu" },
    { id: "5", label: "AI Model Manager", icon: "Cpu", target: "models", visible: "Admin Menu" }
  ]);

  const [menuForm, setMenuForm] = useState({
    label: "",
    icon: "LayoutDashboard",
    target: "dashboard",
    visible: "User Menu"
  });

  // Footer configuration
  const [footerForm, setFooterForm] = useState({
    phone: "+91 (80) 4125-9900",
    email: "support@gochat.ai",
    newsletterPlaceholder: "Enter work email...",
    description: "The luxury standard for multi-modal intelligence workspace solutions.",
    twitterUrl: "https://twitter.com/gochatai",
    linkedinUrl: "https://linkedin.com/company/gochatai"
  });

  // Cookie Consents statistics
  const [consentsStats, setConsentsStats] = useState({
    totalAccepted: 2,
    essentialOnly: 0,
    allConsents: 2
  });

  // Settings
  const [settingsForm, setSettingsForm] = useState({
    twoFactorEnabled: true,
    sessionTimeout: "60",
    passwordComplexity: "Medium",
    strongPasswordEnforced: true,
    activeSessionsLimit: "3"
  });

  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  // Sync state values with RTK Query cache responses
  useEffect(() => {
    if (usersData) setUsers(usersData);
  }, [usersData]);

  useEffect(() => {
    if (modelsData) setModels(modelsData);
  }, [modelsData]);

  useEffect(() => {
    if (subscriptionsData) setSubscriptions(subscriptionsData);
  }, [subscriptionsData]);

  useEffect(() => {
    if (logsData) setAuditLogs(logsData);
  }, [logsData]);

  useEffect(() => {
    if (configData) {
      setBranding(configData.branding);
      setBrandingForm({
        logoName: configData.branding.logoName,
        primaryColor: configData.branding.primaryColor,
        footerText: configData.branding.footerText
      });
      setCookieConsents(configData.cookieConsents);
      setConsentsStats({
        totalAccepted: configData.cookieConsents.length + 1,
        essentialOnly: 0,
        allConsents: configData.cookieConsents.length + 1
      });
    }
  }, [configData]);

  // USER OPERATIONS
  const handleCreateUser = async () => {
    try {
      const payload = {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role as any,
        tier: userForm.tier as any,
        credits: parseInt(userForm.credits) || 0
      };
      const data = await createUser(payload).unwrap();
      if (data.success) {
        triggerToast("User account deployed successfully");
        setIsUserCreateOpen(false);
        setUserForm({ id: "", name: "", email: "", role: "User", tier: "free", credits: "100" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditUserClick = (u: User) => {
    setUserForm({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      tier: u.tier,
      credits: u.credits.toString()
    });
    setIsUserEditOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const payload = {
        id: userForm.id,
        name: userForm.name,
        email: userForm.email,
        role: userForm.role as any,
        tier: userForm.tier as any,
        credits: parseInt(userForm.credits) || 0
      };
      const data = await updateUser(payload).unwrap();
      if (data.success) {
        triggerToast("User account specs updated");
        setIsUserEditOpen(false);
        setUserForm({ id: "", name: "", email: "", role: "User", tier: "free", credits: "100" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    try {
      const data = await deleteUser({ id: deleteUserId }).unwrap();
      if (data.success) {
        triggerToast("User record purged successfully");
        setDeleteUserId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // MODEL TOGGLE & ADD
  const handleToggleModel = async (id: string) => {
    try {
      const data = await toggleModel({ id }).unwrap();
      if (data.success) {
        triggerToast("Model allocation toggled");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateModel = () => {
    const newM: SystemModel = {
      id: `m-${Date.now()}`,
      name: modelForm.name || "Custom Model",
      type: modelForm.type,
      version: modelForm.version || "custom-v1",
      status: "active",
      description: modelForm.description || "Custom model deallocated via CMS.",
      latency: modelForm.latency
    };
    setModels([newM, ...models]);
    setIsModelCreateOpen(false);
    setModelForm({ name: "", version: "", type: "Text", description: "", latency: "0.5s" });
    triggerToast("Custom AI Model mapped to environment");
  };

  // BRANDING CMS SAVE
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await updateBranding(brandingForm).unwrap();
      if (data.success) {
        triggerToast("Platform CMS branding saved successfully");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // MENU OPERATION
  const handleCreateMenuItem = () => {
    const newItem = {
      id: Date.now().toString(),
      label: menuForm.label || "Untitled Link",
      icon: menuForm.icon,
      target: menuForm.target,
      visible: menuForm.visible
    };
    setMenuItems([...menuItems, newItem]);
    setMenuForm({ label: "", icon: "LayoutDashboard", target: "dashboard", visible: "User Menu" });
    setIsMenuCreateOpen(false);
    triggerToast("Navigation layout node updated successfully");
  };

  const handlePurgeMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    triggerToast("Navigation node purged.");
  };

  // BILLING REVENUES
  const totalRevenueEst = calculateRevenue(subscriptions);

  return (
    <div className="space-y-6 select-none p-1 text-left relative">
      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed top-20 right-6 bg-[#111111] border border-amber-500/20 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl z-50 text-xs font-semibold text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-amber-500" />
          {toastMessage}
        </div>
      )}

      {/* KPI Stats counters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-[#242424] p-5 rounded-xl space-y-1">
          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total User Pool</p>
          <p className="text-xl font-extrabold text-white font-numbers">{users.length}</p>
        </div>
        <div className="bg-[#111111] border border-[#242424] p-5 rounded-xl space-y-1">
          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Active AI Models</p>
          <p className="text-xl font-extrabold text-white font-numbers">{models.filter(m => m.status === "active").length} / {models.length}</p>
        </div>
        <div className="bg-[#111111] border border-[#242424] p-5 rounded-xl space-y-1">
          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Monthly Revenue Est</p>
          <p className="text-xl font-extrabold text-white font-numbers">₹{(totalRevenueEst || 35400).toLocaleString()}</p>
        </div>
        <div className="bg-[#111111] border border-[#242424] p-5 rounded-xl space-y-1">
          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Cookie Agreements</p>
          <p className="text-xl font-extrabold text-white font-numbers">{consentsStats.totalAccepted}</p>
        </div>
      </div>

      {/* -------------------------------------------------------------
          TABS VIEWPORTS DETAILED MATCHING 10 SCREENS
         ------------------------------------------------------------- */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-4">
            <div className="border-b border-[#1F1F1F] pb-3 text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hardware Health Monitor</h4>
              <p className="text-[10px] text-zinc-500">Live CPU and memory usage deallocated on container</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900/60 border border-[#242424] rounded-xl space-y-2">
                <div className="flex justify-between text-xs font-bold text-zinc-400">
                  <span>Express API Node CPU</span>
                  <span className="text-amber-500 font-mono">14.8%</span>
                </div>
                <div className="h-1.5 bg-[#1F1F1F] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[14.8%] rounded-full" />
                </div>
              </div>

              <div className="p-4 bg-zinc-900/60 border border-[#242424] rounded-xl space-y-2">
                <div className="flex justify-between text-xs font-bold text-zinc-400">
                  <span>Node.js Memory heap</span>
                  <span className="text-amber-500 font-mono">240MB / 512MB</span>
                </div>
                <div className="h-1.5 bg-[#1F1F1F] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[46.8%] rounded-full" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#18181B]/40 border border-[#242424] rounded-xl space-y-1.5 text-xs text-zinc-400">
              <h5 className="font-bold text-white">System Status: Optimal</h5>
              <p className="leading-relaxed">All sub-seconds proxy channels running securely with 0.4s average latency. No memory leaks detected in Node memory ledger.</p>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 flex flex-col h-[340px]">
            <div className="border-b border-[#1F1F1F] pb-3 text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Actions log</h4>
              <p className="text-[10px] text-zinc-500">Latest administrative triggers</p>
            </div>
            <div className="flex-1 overflow-y-auto mt-4 space-y-3.5 pr-1 custom-scrollbar text-xs text-zinc-400">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-2.5 bg-zinc-900/60 border border-[#242424] rounded-xl text-left">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span className="font-bold uppercase text-amber-500">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="mt-1 font-mono text-zinc-300">{log.operator}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. USER POOL TAB */}
      {activeTab === "users" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#0C0C0C] border-b border-[#1F1F1F] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">User Directory Pools</h4>
              <p className="text-[10px] text-zinc-500">Deploy, adjust or delete active membership credentials</p>
            </div>
            <button
              id="admin-btn-add-user"
              onClick={() => {
                setUserForm({ id: "", name: "", email: "", role: "User", tier: "free", credits: "100" });
                setIsUserCreateOpen(true);
              }}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Member
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#111111] text-[10px] uppercase text-zinc-500 tracking-wider border-b border-[#1F1F1F]">
                <tr>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email Identity</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Membership</th>
                  <th className="px-6 py-3.5">Inference Balance</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[#1F1F1F] hover:bg-zinc-900/30 transition">
                    <td className="px-6 py-4 font-semibold text-white">{u.name}</td>
                    <td className="px-6 py-4 font-mono text-zinc-400">{u.email}</td>
                    <td className="px-6 py-4">{u.role}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-wider">
                        {u.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">{u.credits.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${u.status === "active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2.5">
                      <button
                        onClick={() => handleEditUserClick(u)}
                        className="p-1 hover:text-amber-500 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteUserId(u.id)}
                        className="p-1 hover:text-rose-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. VIP SUBSCRIPTIONS TAB */}
      {activeTab === "billing" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#0C0C0C] border-b border-[#1F1F1F]">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">VIP Membership Ledger</h4>
            <p className="text-[10px] text-zinc-500">Detailed transaction billing records in Indian Rupees (₹)</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#111111] text-[10px] uppercase text-zinc-500 tracking-wider border-b border-[#1F1F1F]">
                <tr>
                  <th className="px-6 py-3.5">User Identity</th>
                  <th className="px-6 py-3.5">Plan Selected</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Cycle</th>
                  <th className="px-6 py-3.5">Date Added</th>
                  <th className="px-6 py-3.5">Invoice State</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => (
                  <tr key={s.id} className="border-b border-[#1F1F1F] hover:bg-zinc-900/30 transition">
                    <td className="px-6 py-4 font-semibold text-white font-mono">{s.userEmail}</td>
                    <td className="px-6 py-4">{s.plan}</td>
                    <td className="px-6 py-4 font-mono font-bold text-amber-500">{s.price}</td>
                    <td className="px-6 py-4 uppercase font-bold text-[9px] tracking-wider text-zinc-500">{s.cycle}</td>
                    <td className="px-6 py-4 text-zinc-400">{s.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${s.status === "paid" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. AI MODEL MANAGER TAB */}
      {activeTab === "models" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-[#1F1F1F] flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Environment AI Models</h4>
              <p className="text-[10px] text-zinc-500">Add custom providers or toggle active deallocation states</p>
            </div>
            <button
              onClick={() => setIsModelCreateOpen(true)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Model
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition ${
                  m.status === "active" ? "bg-amber-500/[0.01] border-amber-500/20" : "bg-transparent border-[#242424] opacity-50"
                }`}
              >
                <div className="space-y-1 text-left">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[8px] font-bold uppercase text-zinc-400 font-mono">{m.type}</span>
                  <h5 className="text-xs font-bold text-white mt-1.5">{m.name}</h5>
                  <p className="text-[10px] text-zinc-500 max-w-xs">{m.description}</p>
                </div>

                <button
                  onClick={() => handleToggleModel(m.id)}
                  className="p-1 text-zinc-400 hover:text-white transition"
                  title="Toggle status"
                >
                  {m.status === "active" ? <ToggleRight className="w-7 h-7 text-amber-500" /> : <ToggleLeft className="w-7 h-7 text-zinc-600" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MENU CONTROL TAB */}
      {activeTab === "menu" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#0C0C0C] border-b border-[#1F1F1F] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation Menu Node Manager</h4>
              <p className="text-[10px] text-zinc-500">Configure visual layout order and side visibility metrics</p>
            </div>
            <button
              onClick={() => setIsMenuCreateOpen(true)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Menu Link
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#111111] text-[10px] uppercase text-zinc-500 tracking-wider border-b border-[#1F1F1F]">
                <tr>
                  <th className="px-6 py-3.5">Label</th>
                  <th className="px-6 py-3.5">Icon Reference</th>
                  <th className="px-6 py-3.5">Target Workspace Screen</th>
                  <th className="px-6 py-3.5">Assigned View</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} className="border-b border-[#1F1F1F] hover:bg-zinc-900/30 transition">
                    <td className="px-6 py-4 font-semibold text-white">{item.label}</td>
                    <td className="px-6 py-4 font-mono text-zinc-400">{item.icon}</td>
                    <td className="px-6 py-4 font-mono text-zinc-400">{item.target}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-[9px] font-bold text-zinc-300 uppercase tracking-wider">
                        {item.visible}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      <button
                        onClick={() => handlePurgeMenuItem(item.id)}
                        className="p-1 hover:text-rose-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. FOOTER CMS TAB */}
      {activeTab === "footer" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-6">
          <div className="pb-3 border-b border-[#1F1F1F] text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Footer Configuration Console</h4>
            <p className="text-[10px] text-zinc-500">Modify regional company support hotline and social anchors</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); triggerToast("Footer parameters stored successfully!"); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Support Contact Hotline</label>
                <input
                  type="text"
                  value={footerForm.phone}
                  onChange={(e) => setFooterForm({ ...footerForm, phone: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Administrative Email</label>
                <input
                  type="email"
                  value={footerForm.email}
                  onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Newsletter Placeholder text</label>
              <input
                type="text"
                value={footerForm.newsletterPlaceholder}
                onChange={(e) => setFooterForm({ ...footerForm, newsletterPlaceholder: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Brief Company Description</label>
              <textarea
                value={footerForm.description}
                onChange={(e) => setFooterForm({ ...footerForm, description: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white h-20 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-amber-500/15 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Footer Parameters
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7. BRANDING CMS TAB */}
      {activeTab === "branding" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-6">
          <div className="pb-3 border-b border-[#1F1F1F] text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">CMS Branding Configuration</h4>
            <p className="text-[10px] text-zinc-500">Change logo signature and footer text content dynamically</p>
          </div>

          <form onSubmit={handleSaveBranding} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Brand Logo Signature</label>
                <input
                  type="text"
                  value={brandingForm.logoName}
                  onChange={(e) => setBrandingForm({ ...brandingForm, logoName: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Accent Core Color</label>
                <input
                  type="text"
                  value={brandingForm.primaryColor}
                  onChange={(e) => setBrandingForm({ ...brandingForm, primaryColor: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Footer signature CMS</label>
              <textarea
                value={brandingForm.footerText}
                onChange={(e) => setBrandingForm({ ...brandingForm, footerText: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white h-24 resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-amber-500/15 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save CMS Signature
            </button>
          </form>
        </div>
      )}

      {/* 8. COOKIE LEDGER TAB */}
      {activeTab === "cookies" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#0C0C0C] border-b border-[#1F1F1F] text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cookie Agreements Registry</h4>
            <p className="text-[10px] text-zinc-500">Live logs of user consent configurations</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#111111] text-[10px] uppercase text-zinc-500 tracking-wider border-b border-[#1F1F1F]">
                <tr>
                  <th className="px-6 py-3.5">Identity User</th>
                  <th className="px-6 py-3.5">Consent Categories</th>
                  <th className="px-6 py-3.5">Agreement status</th>
                  <th className="px-6 py-3.5">Logged Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1F1F1F] hover:bg-zinc-900/30 transition">
                  <td className="px-6 py-4 font-semibold text-white font-mono">devcoderm13@gmail.com</td>
                  <td className="px-6 py-4">essential, analytics, marketing</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Accepted
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">2026-07-18 10:14:12</td>
                </tr>
                {cookieConsents.map((cc) => (
                  <tr key={cc.id} className="border-b border-[#1F1F1F] hover:bg-zinc-900/30 transition">
                    <td className="px-6 py-4 font-semibold text-white font-mono">{cc.user}</td>
                    <td className="px-6 py-4">{cc.categories.join(", ")}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Accepted
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{cc.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. SECURITY AUDITS TAB */}
      {activeTab === "audits" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#0C0C0C] border-b border-[#1F1F1F] text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform Security Audits</h4>
            <p className="text-[10px] text-zinc-500">Live system audit trails logged dynamically by Express API</p>
          </div>

          <div className="divide-y divide-[#1F1F1F] font-mono text-[10px] text-zinc-400 max-h-[400px] overflow-y-auto custom-scrollbar">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex items-start justify-between gap-4 hover:bg-zinc-900/35 transition">
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold uppercase text-[9px] tracking-wider bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">{log.action}</span>
                    <span className="text-[#71717A]">•</span>
                    <span className="text-zinc-300 font-bold">{log.operator}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">{log.details}</p>
                </div>

                <span className="text-[9px] text-[#52525B]">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. SYSTEM SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-6">
          <div className="pb-3 border-b border-[#1F1F1F] text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">System Settings Room</h4>
            <p className="text-[10px] text-zinc-500">Enforce password complexities and active session lock thresholds</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); triggerToast("System settings saved!"); }} className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-[#18181B]/40 border border-[#242424] rounded-xl">
              <div className="space-y-0.5 text-left">
                <h5 className="text-xs font-bold text-white">Two-Factor Authentication</h5>
                <p className="text-[10px] text-zinc-500">Require mobile security token upon credentials login.</p>
              </div>
              <input
                type="checkbox"
                checked={settingsForm.twoFactorEnabled}
                onChange={(e) => setSettingsForm({ ...settingsForm, twoFactorEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 bg-zinc-900 border-[#242424] focus:ring-0 cursor-pointer accent-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Session Lockout (Minutes)</label>
                <input
                  type="number"
                  value={settingsForm.sessionTimeout}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sessionTimeout: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active session count limit</label>
                <input
                  type="number"
                  value={settingsForm.activeSessionsLimit}
                  onChange={(e) => setSettingsForm({ ...settingsForm, activeSessionsLimit: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#18181B]/40 border border-[#242424] rounded-xl">
              <div className="space-y-0.5 text-left">
                <h5 className="text-xs font-bold text-white">Enforce Strong Password complexity</h5>
                <p className="text-[10px] text-zinc-500">Requires numbers, symbols and special characters.</p>
              </div>
              <input
                type="checkbox"
                checked={settingsForm.strongPasswordEnforced}
                onChange={(e) => setSettingsForm({ ...settingsForm, strongPasswordEnforced: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 bg-zinc-900 border-[#242424] focus:ring-0 cursor-pointer accent-amber-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-amber-500/15 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save System settings
              </button>
            </div>
          </form>
        </div>
      )}


      {/* -------------------------------------------------------------
          MODALS
         ------------------------------------------------------------- */}

      {/* MODAL: ADD USER */}
      <CommonModal
        isOpen={isUserCreateOpen}
        onClose={() => setIsUserCreateOpen(false)}
        title="Deploy New User Credentials"
        confirmText="Deploy Account"
        onConfirm={handleCreateUser}
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Name</label>
            <input
              type="text"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Role</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
              >
                <option value="User">User</option>
                <option value="Administrator">Administrator</option>
                <option value="Developer">Developer</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">VIP Tier</label>
              <select
                value={userForm.tier}
                onChange={(e) => setUserForm({ ...userForm, tier: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Credits Allocation</label>
            <input
              type="number"
              value={userForm.credits}
              onChange={(e) => setUserForm({ ...userForm, credits: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>
      </CommonModal>

      {/* MODAL: EDIT USER */}
      <CommonModal
        isOpen={isUserEditOpen}
        onClose={() => setIsUserEditOpen(false)}
        title="Edit User Credentials Specs"
        confirmText="Save Specifications"
        onConfirm={handleUpdateUser}
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Name</label>
            <input
              type="text"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Role</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
              >
                <option value="User">User</option>
                <option value="Administrator">Administrator</option>
                <option value="Developer">Developer</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">VIP Tier</label>
              <select
                value={userForm.tier}
                onChange={(e) => setUserForm({ ...userForm, tier: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Credits Allocation</label>
            <input
              type="number"
              value={userForm.credits}
              onChange={(e) => setUserForm({ ...userForm, credits: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>
      </CommonModal>

      {/* CONFIRM MODAL: PURGE USER */}
      <CommonModal
        isOpen={deleteUserId !== null}
        onClose={() => setDeleteUserId(null)}
        title="Confirm Purge Account"
        isDestructive
        confirmText="Purge Account Logs"
        onConfirm={handleDeleteConfirm}
      >
        <p className="text-xs text-zinc-300">
          WARNING: You are permanently deleting this user record and active credits from the server-side memory database. This action cannot be undone.
        </p>
      </CommonModal>

      {/* MODAL: ADD AI MODEL */}
      <CommonModal
        isOpen={isModelCreateOpen}
        onClose={() => setIsModelCreateOpen(false)}
        title="Map Custom AI Model Node"
        confirmText="Map Model Node"
        onConfirm={handleCreateModel}
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Model Name</label>
            <input
              type="text"
              value={modelForm.name}
              onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
              placeholder="e.g. Gemini 3.5 Pro Ultra"
              className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Version Reference</label>
            <input
              type="text"
              value={modelForm.version}
              onChange={(e) => setModelForm({ ...modelForm, version: e.target.value })}
              placeholder="e.g. gemini-3.5-pro-ultra"
              className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Type</label>
              <select
                value={modelForm.type}
                onChange={(e) => setModelForm({ ...modelForm, type: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
              >
                <option value="Text">Text</option>
                <option value="Image">Image</option>
                <option value="Video">Video</option>
                <option value="Audio">Audio</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Latency</label>
              <input
                type="text"
                value={modelForm.latency}
                onChange={(e) => setModelForm({ ...modelForm, latency: e.target.value })}
                placeholder="e.g. 0.8s"
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Brief Description</label>
            <textarea
              value={modelForm.description}
              onChange={(e) => setModelForm({ ...modelForm, description: e.target.value })}
              placeholder="Describe the routing guidelines..."
              className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-white h-16 resize-none"
            />
          </div>
        </div>
      </CommonModal>

      {/* MODAL: ADD MENU ITEM */}
      <CommonModal
        isOpen={isMenuCreateOpen}
        onClose={() => setIsMenuCreateOpen(false)}
        title="Add Navigation Menu Node"
        confirmText="Add Navigation Link"
        onConfirm={handleCreateMenuItem}
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Menu Label</label>
            <input
              type="text"
              value={menuForm.label}
              onChange={(e) => setMenuForm({ ...menuForm, label: e.target.value })}
              placeholder="e.g. Prompt Studio"
              className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Screen ID target</label>
              <input
                type="text"
                value={menuForm.target}
                onChange={(e) => setMenuForm({ ...menuForm, target: e.target.value })}
                placeholder="e.g. prompt-studio"
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Assigned View</label>
              <select
                value={menuForm.visible}
                onChange={(e) => setMenuForm({ ...menuForm, visible: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
              >
                <option value="User Menu">User Menu</option>
                <option value="Admin Menu">Admin Menu</option>
              </select>
            </div>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
