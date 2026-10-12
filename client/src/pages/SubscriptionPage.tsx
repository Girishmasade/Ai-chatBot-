import React, { useState } from "react";
import { CreditCard, Check, Zap, Sparkles, Award, HelpCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import CommonModal from "../components/CommonModal";
import {
  useGetSubscriptionPlansQuery,
  useGetMySubscriptionQuery,
  useCreateUserSubscriptionMutation,
} from "../redux/api/subscriptionApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../redux/api/paymentApi";
import { useGetActiveTokenPackagesQuery } from "../redux/api/tokenApi";
import { useAuth } from "../hooks/useAuth";

interface SubscriptionPageProps {
  onUpgrade: (tier: "free" | "basic" | "pro" | "enterprise", credits: number) => void;
}

export default function SubscriptionPage({ onUpgrade }: SubscriptionPageProps) {
  const { currentUser, refreshCredits } = useAuth();

  // Fetch real subscription plans from backend
  const { data: plansResponse, isLoading: plansLoading } = useGetSubscriptionPlansQuery();
  const { data: mySubData, refetch: refetchSubscription } = useGetMySubscriptionQuery();
  const [createSubscription, { isLoading: isSubscribing }] = useCreateUserSubscriptionMutation();

  const rawBackendPlans = plansResponse?.data?.subscriptionPlan || [];
  // Ensure strictly unique plans, and at most one free plan (price === 0)
  const backendPlans = React.useMemo(() => {
    let seenFree = false;
    return rawBackendPlans.filter((p: any) => {
      const isFree = p.price === 0 || p.plan?.toLowerCase() === "free" || p.name?.toLowerCase().includes("free");
      if (isFree) {
        if (seenFree) return false;
        seenFree = true;
      }
      return true;
    });
  }, [rawBackendPlans]);

  const activePlan = mySubData?.data?.plan;
  const activePlanId = activePlan?._id || currentUser?.activePlanId;
  const isUserPaid = mySubData?.data?.isPaid ?? currentUser?.isPaid ?? false;

  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();
  
  // Fetch active token packages for top-ups (e.g. Starter Pack from database)
  const { data: tokenPackagesRes, isLoading: packagesLoading } = useGetActiveTokenPackagesQuery();
  const tokenPackages = tokenPackagesRes?.data?.packages || (tokenPackagesRes?.data as any)?.cache || [];

  const handleDirectUpgrade = async (tier: string, price: string, credits: number, planId?: string) => {
    // If we have a real backend plan ID, use the real API with Razorpay
    if (planId) {
      try {
        // 1. Create order
        const orderRes = await createOrder({
          itemType: "SUBSCRIPTION",
          itemId: planId,
        }).unwrap();

        // 2. Open Razorpay Checkout
        const options = {
          key: "rzp_test_THQUCyYxXJst74", // Ideally fetched from backend or env, but fine for test
          amount: orderRes.data.amount,
          currency: orderRes.data.currency,
          name: "GoChat AI Studio",
          description: `Subscription: ${tier} (${price})`,
          order_id: orderRes.data.orderId,
          handler: async function (response: any) {
            try {
              // 3. Verify Payment
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }).unwrap();
              
              // Refresh subscription and wallet state immediately
              refetchSubscription();
              refreshCredits();

              toast.success(
                `🎉 Payment Successful! ${tier} plan (${price}) activated & Official Invoice sent to your registered Gmail address.`,
                {
                  duration: 6000,
                  icon: "🎉",
                  style: {
                    borderRadius: "12px",
                    background: "#18181b",
                    color: "#fff",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                  },
                }
              );
            } catch (verErr: any) {
              console.error("Payment verification failed:", verErr);
              toast.error(verErr?.data?.message || "Payment verification failed. Please contact support.");
            }
          },
          theme: {
            color: "#f59e0b", // Amber 500
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();

      } catch (err: any) {
        console.error("Subscription order creation failed:", err);
        toast.error(err?.data?.message || "Failed to create Razorpay payment order.");
      }
      return;
    }

    // Fallback to mock upgrade callback
    const tierValue = tier.toLowerCase().includes("pro")
      ? "pro"
      : tier.toLowerCase().includes("basic")
      ? "basic"
      : "enterprise";
    
    onUpgrade(tierValue as any, credits);
  };

  const handleTokenPurchase = async (packageId: string, name: string) => {
    try {
      const orderRes = await createOrder({
        itemType: "TOKEN_PACKAGE",
        itemId: packageId,
      }).unwrap();

      const options = {
        key: "rzp_test_THQUCyYxXJst74",
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "GoChat AI Studio",
        description: `Token Package: ${name}`,
        order_id: orderRes.data.orderId,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            refreshCredits();

            toast.success(
              `🎉 Tokens purchased successfully! Invoice sent to your registered Gmail address.`,
              {
                duration: 6000,
                icon: "⚡",
                style: {
                  borderRadius: "12px",
                  background: "#18181b",
                  color: "#fff",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                },
              }
            );
          } catch (verErr: any) {
            console.error("Payment verification failed:", verErr);
            toast.error(verErr?.data?.message || "Payment verification failed. Please contact support.");
          }
        },
        theme: { color: "#f59e0b" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Token order creation failed:", err);
      toast.error(err?.data?.message || "Failed to create Razorpay order for tokens.");
    }
  };

  // Build plan cards — merge backend plans with fallback hardcoded plans
  const fallbackPlans = [
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
      price: "₹499",
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
      price: "₹1,499",
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

  // If backend has real plans, build cards from them; otherwise use fallback
  const plans = backendPlans.length > 0
    ? backendPlans.map((bp: any, i: number) => {
        const isFreePlan = bp.price === 0 || bp.plan?.toLowerCase() === "free" || bp.name?.toLowerCase().includes("free");
        
        // Free user (!isUserPaid) -> Free plan (price === 0) is their current plan
        // Paid user (isUserPaid) -> Only bp._id === activePlanId is their current plan
        const isCurrentPlan = isUserPaid
          ? (activePlanId ? bp._id === activePlanId : false)
          : isFreePlan;

        return {
          name: bp.name,
          price: `₹${bp.price}`,
          period: bp.durationInDays ? `/${bp.durationInDays}d` : "/month",
          description: bp.description,
          credits: `${bp.tokens || 0} tokens`,
          features: bp.services?.slice(0, 4) || [],
          // Never mark free plan as "Most Popular"
          featured: !isFreePlan && (bp.name?.toLowerCase().includes("monthly") || bp.name?.toLowerCase().includes("popular") || (backendPlans.length > 2 ? i === 2 : i === 1)),
          isCurrentPlan,
          buttonText: isCurrentPlan ? "Current Plan" : `Subscribe to ${bp.name}`,
          planId: bp._id,
          priceValue: bp.price,
        };
      })
    : fallbackPlans.map((p) => {
        const isCurrentPlan = !isUserPaid && p.price === "₹0";
        return {
          ...p,
          planId: undefined as string | undefined,
          priceValue: 0,
          isCurrentPlan,
          buttonText: isCurrentPlan ? "Current Plan" : p.buttonText,
        };
      });

  return (
    <div className="space-y-8  p-1 text-left">
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
      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`bg-[#111111] border rounded-2xl p-5 flex flex-col justify-between space-y-6 relative transition duration-300 ${
              plan.isCurrentPlan
                ? "border-emerald-500/60 shadow-2xl shadow-emerald-500/[0.08]"
                : plan.featured
                ? "border-amber-500 shadow-2xl shadow-amber-500/[0.06] bg-[#111111]"
                : "border-[#242424] hover:border-zinc-800"
            }`}
          >
            {/* Top badge */}
            {plan.isCurrentPlan ? (
              <span className="absolute top-0 right-6 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-emerald-500/10">
                <Check className="w-2.5 h-2.5" /> Current Plan
              </span>
            ) : plan.featured ? (
              <span className="absolute top-0 right-6 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/15">
                Most Popular
              </span>
            ) : null}

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
              onClick={() => {
                const p = plan as any;
                if (!p.isCurrentPlan && p.priceValue > 0) {
                  handleDirectUpgrade(
                    plan.name,
                    `${plan.price}${plan.period || ""}`,
                    plan.name.includes("Daily") ? 100 : plan.name.includes("Pro") ? 1500 : 500,
                    p.planId,
                  );
                }
              }}
              disabled={plan.isCurrentPlan || (!plan.isCurrentPlan && (plan as any).priceValue === 0 && isUserPaid)}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition duration-200 flex items-center justify-center gap-1.5 ${
                plan.isCurrentPlan
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 cursor-default"
                  : (!plan.isCurrentPlan && (plan as any).priceValue === 0 && isUserPaid)
                  ? "bg-[#18181B] border border-transparent text-zinc-600 cursor-not-allowed"
                  : plan.featured
                  ? "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/15 cursor-pointer"
                  : "bg-[#1A1A1A] border border-[#242424] text-zinc-300 hover:text-white hover:bg-zinc-900 cursor-pointer"
              }`}
            >
              {plan.isCurrentPlan && <Check className="w-3.5 h-3.5" />}
              {plan.isCurrentPlan
                ? "Current Plan"
                : (!plan.isCurrentPlan && (plan as any).priceValue === 0 && isUserPaid)
                ? "Free Plan"
                : plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Token Packages Section (Managed by Admin from MongoDB) */}
      {tokenPackages.length > 0 && (
        <div className="mt-12 space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-2 mb-8">
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
              One-Time Token Top-Ups & Starter Packs
            </h3>
            <p className="text-xs text-zinc-400 max-w-md">
              Need more tokens but don't want to change your subscription? Purchase instant tokens a la carte from our database offerings.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tokenPackages.map((pkg: any) => (
              <div
                key={pkg._id}
                className={`bg-[#111111] border rounded-2xl p-5 flex flex-col justify-between space-y-5 transition relative ${
                  pkg.isPopular
                    ? "border-amber-500 shadow-xl shadow-amber-500/[0.08]"
                    : "border-[#242424] hover:border-amber-500/50"
                }`}
              >
                {/* Popular or Starter Pack badge */}
                {pkg.isPopular && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/15">
                    Popular Top-Up
                  </span>
                )}

                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {pkg.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500">{pkg.description || "Instant token credit bundle"}</p>
                </div>
                
                <div className="flex items-baseline gap-1 py-2 border-y border-[#1F1F1F]">
                  <span className="text-2xl font-bold text-white font-numbers">₹{pkg.price}</span>
                  <span className="text-[10px] text-zinc-500">/one-time</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-bold bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-lg w-fit">
                  <Zap className="w-3.5 h-3.5" />
                  {(pkg.tokenAmount || 0).toLocaleString()} Tokens
                </div>

                <button
                  onClick={() => handleTokenPurchase(pkg._id, pkg.name)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                    pkg.isPopular
                      ? "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/15"
                      : "bg-[#1A1A1A] border border-[#242424] text-zinc-300 hover:text-white hover:border-amber-500/50 hover:bg-amber-500/10"
                  }`}
                >
                  Buy {pkg.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
