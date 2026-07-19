import React, { useState } from "react";
import { CreditCard, Check, Zap, Sparkles, Award, HelpCircle } from "lucide-react";
import CommonModal from "../components/CommonModal";

interface SubscriptionPageProps {
  onUpgrade: (tier: "free" | "basic" | "pro" | "enterprise", credits: number) => void;
}

export default function SubscriptionPage({ onUpgrade }: SubscriptionPageProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [upgradeModal, setUpgradeModal] = useState<{ isOpen: boolean; tier: string; price: string; credits: number }>({
    isOpen: false,
    tier: "",
    price: "",
    credits: 0
  });

  const handleUpgradeClick = (tier: string, price: string, credits: number) => {
    setUpgradeModal({
      isOpen: true,
      tier,
      price,
      credits
    });
  };

  const handleConfirmUpgrade = () => {
    // Process upgrade callback
    const tierValue = upgradeModal.tier.toLowerCase().includes("pro")
      ? "pro"
      : upgradeModal.tier.toLowerCase().includes("basic")
      ? "basic"
      : "enterprise";
    
    onUpgrade(tierValue as any, upgradeModal.credits);
  };

  const plans = [
    {
      name: "Free Sandbox",
      price: "₹0",
      description: "Ideal for testing core model structures",
      credits: "10 monthly credits",
      features: [
        "Default Gemini 3.5 Flash Access",
        "Standard latency response bounds",
        "Max 3 saved assets in history",
        "Public chat channels only"
      ],
      featured: false,
      buttonText: "Current Plan"
    },
    {
      name: "Basic Developer",
      price: billingCycle === "monthly" ? "₹499" : "₹399",
      period: "/month",
      description: "Great for building individual prototypes",
      credits: "500 credits / month",
      features: [
        "Gemini 3.5 Flash + Image Lite",
        "Dedicated proxy route bandwidth",
        "Full assets export to txt or local",
        "Essential cookie logging checks"
      ],
      featured: false,
      buttonText: "Upgrade to Basic"
    },
    {
      name: "Pro Unlimited",
      price: billingCycle === "monthly" ? "₹1,499" : "₹1,199",
      period: "/month",
      description: "The premium standard for elite creators",
      credits: "1,500 credits / month",
      features: [
        "All models including Veo Video Lite",
        "Sub-100ms ultra-low latency bounds",
        "Amber Glow luxury interface theme",
        "Advanced audit log logs history"
      ],
      featured: true,
      buttonText: "Claim Pro Membership"
    },
    {
      name: "Daily Access Pass",
      price: "₹99",
      period: "/24h",
      description: "Claim single-day premium unconstrained credentials",
      credits: "100 credits instant",
      features: [
        "Complete unconstrained model access",
        "24-hour expiration matrix window",
        "Perfect for quick research needs",
        "Instant vector compile links"
      ],
      featured: false,
      buttonText: "Purchase Daily Pass"
    }
  ];

  return (
    <div className="space-y-8 select-none p-1 text-left">
      {/* Banner */}
      <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Decorative backdrop glow */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 bg-amber-500/[0.04] blur-2xl rounded-full" />
        <div className="space-y-2">
          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-1">
            <Award className="w-3.5 h-3.5 fill-amber-500/10" /> Prestige Access
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight font-sans">
            VIP Membership & Subscription Plans
          </h3>
          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
            All prices are calculated directly in **Indian Rupees (₹)** to optimize regional transaction routes. Claim your elite credentials.
          </p>
        </div>
      </div>

      {/* Monthly vs Yearly toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs text-zinc-400 font-medium">Monthly billing</span>
        <button
          id="billing-toggle-btn"
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          className="w-12 h-6 rounded-full bg-[#1A1A1A] border border-[#242424] p-0.5 transition duration-300 flex items-center relative"
        >
          <div
            className={`w-4.5 h-4.5 rounded-full bg-amber-500 shadow-md shadow-amber-500/30 transition duration-300 absolute ${
              billingCycle === "yearly" ? "right-1" : "left-1"
            }`}
          />
        </button>
        <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
          Yearly billing <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-500 font-bold uppercase tracking-wider">Save 20%</span>
        </span>
      </div>

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`bg-[#111111] border rounded-2xl p-5 flex flex-col justify-between space-y-6 relative transition duration-300 ${
              plan.featured
                ? "border-amber-500 shadow-2xl shadow-amber-500/[0.06] bg-[#111111]"
                : "border-[#242424] hover:border-zinc-800"
            }`}
          >
            {/* Featured top badge */}
            {plan.featured && (
              <span className="absolute top-0 right-6 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/15">
                Most Popular
              </span>
            )}

            <div className="space-y-4">
              {/* Header */}
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white tracking-wide">{plan.name}</h4>
                <p className="text-[11px] text-zinc-500">{plan.description}</p>
              </div>

              {/* Price display */}
              <div className="flex items-baseline gap-1 py-2 border-y border-[#1F1F1F]">
                <span className="text-2xl font-bold text-white font-numbers">{plan.price}</span>
                {plan.period && <span className="text-[10px] text-zinc-500">{plan.period}</span>}
              </div>

              {/* Instant Credits marker */}
              <div className="text-[10px] font-bold text-amber-500 bg-amber-500/5 border border-amber-500/10 px-2.5 py-1.5 rounded-lg w-fit">
                {plan.credits}
              </div>

              {/* Features list */}
              <ul className="space-y-2 pt-2">
                {plan.features.map((feat, index) => (
                  <li key={index} className="flex items-start gap-2 text-[11px] text-zinc-400">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Upgrade CTA Button */}
            <button
              id={`plan-btn-upgrade-${i}`}
              onClick={() => {
                if (plan.price !== "₹0") {
                  handleUpgradeClick(
                    plan.name,
                    `${plan.price}${plan.period || ""}`,
                    plan.name.includes("Daily") ? 100 : plan.name.includes("Pro") ? 1500 : 500
                  );
                }
              }}
              disabled={plan.price === "₹0"}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
                plan.price === "₹0"
                  ? "bg-[#18181B] border border-transparent text-zinc-500 cursor-default"
                  : plan.featured
                  ? "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/15"
                  : "bg-[#1A1A1A] border border-[#242424] text-zinc-300 hover:text-white hover:bg-zinc-900"
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Upgrade Confirmation Modal */}
      <CommonModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal({ ...upgradeModal, isOpen: false })}
        title="Confirm VIP Upgrade"
        confirmText="Complete payment (Simulated)"
        onConfirm={handleConfirmUpgrade}
      >
        <div className="space-y-3.5">
          <p className="text-xs text-zinc-300">
            You are about to subscribe to the **{upgradeModal.tier}** tier of GoChat AI.
          </p>

          <div className="p-3 bg-[#111111] border border-[#242424] rounded-xl flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-400">Total charge rate:</span>
            <span className="font-extrabold text-white font-numbers">{upgradeModal.price}</span>
          </div>

          <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1">
            <h5 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Instant Balance Upgrade
            </h5>
            <p className="text-[11px] text-[#9B9B9B]">
              Your inference balance will instantly refresh by **+{upgradeModal.credits.toLocaleString()} credits**.
            </p>
          </div>

          <p className="text-[10px] text-[#71717A] leading-relaxed italic">
            Note: This is a simulated premium sandbox environment transaction. No real billing methods will be charged.
          </p>
        </div>
      </CommonModal>
    </div>
  );
}
