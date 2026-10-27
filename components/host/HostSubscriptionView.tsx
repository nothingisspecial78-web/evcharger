"use client";

import React, { useState } from "react";
import { HostSubscription } from "../driver/DriverAuthModal";

interface HostSubscriptionViewProps {
  hostName: string;
  onActivateSubscription: (sub: HostSubscription) => void;
  onSwitchToDriver: () => void;
}

export default function HostSubscriptionView({
  hostName,
  onActivateSubscription,
  onSwitchToDriver,
}: HostSubscriptionViewProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | "lifetime">("yearly");
  const [enableAutoPay, setEnableAutoPay] = useState(true);
  const [paymentRail, setPaymentRail] = useState<"upi" | "cards" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompletePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const sub: HostSubscription = {
        status: "active",
        plan: selectedPlan,
        grantedBy: "payment",
        validUntil:
          selectedPlan === "lifetime"
            ? "Lifetime License"
            : selectedPlan === "yearly"
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
      };
      onActivateSubscription(sub);
      alert(`🎉 Premium Host Subscription Activated! Welcome to VoltSpot Station Management.`);
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col pb-24 bg-[#EFFDF6] min-h-screen">
      {/* Top App Bar Header */}
      <header className="bg-white border-b border-[#C0C9C2]/50 shadow-sm sticky top-0 z-40">
        <div className="flex justify-between items-center w-full px-4 h-14 max-w-5xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#174D3A] text-[#C8F169] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] fill-icon">electric_bolt</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-bold tracking-tight text-[#003525]">VoltSpot</span>
              <span className="bg-[#174D3A] text-[#C8F169] text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-[#346853]">
                Host Portal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#BA1A1A] bg-[#FFF0F0] px-2.5 py-1 rounded-full border border-[#F8CDCD] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#BA1A1A] animate-pulse"></span>
              Subscription Required
            </span>

            <button
              onClick={onSwitchToDriver}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#E3F1EA] text-[#003525] hover:bg-[#D4E8DD] transition-colors"
            >
              Switch to Driver App
            </button>
          </div>
        </div>
      </header>

      {/* Main Administrative Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 flex-1">
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#E3F1EA] px-3 py-1 rounded-full border border-[#C0C9C2]/60 text-xs font-semibold text-[#003525] mb-2">
            <span className="material-symbols-outlined text-sm">ev_station</span>
            <span>Host Infrastructure & Dispatch Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121E1A] tracking-tight">
            Monetize & Manage Your EV Chargers
          </h1>
          <p className="text-xs sm:text-sm text-[#404944] mt-1.5 max-w-lg mx-auto">
            Hello <strong className="text-[#003525]">{hostName}</strong>, activate your host subscription to access real-time charger telemetry, anti-double booking locks, and instant driver payouts.
          </p>
        </div>

        {/* Free Trial / AutoPay Incentive Banner */}
        <div className="bg-white border-2 border-[#174D3A] rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C8F169] text-[#003525] flex items-center justify-center shrink-0 border border-[#A4D84B]">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-bold text-[#003525]">1 Month Free Trial</span>
                  <span className="bg-[#E9F7F0] text-[#237A4B] text-[11px] font-bold px-2 py-0.5 rounded border border-[#C6E7D2]">
                    AutoPay Incentive
                  </span>
                </div>
                <p className="text-xs text-[#404944] mt-0.5 leading-snug">
                  Enable AutoPay today to activate 30 days of complete host infrastructure. <strong className="text-[#003525]">₹0 due now</strong>, cancel anytime before trial ends.
                </p>
              </div>
            </div>

            <div className="flex items-center bg-[#E9F7F0] px-3 py-1.5 rounded-xl border border-[#C0C9C2] shrink-0 self-start sm:self-auto">
              <span className="text-xs font-bold text-[#003525]">₹0.00 Due Today</span>
            </div>
          </div>
        </div>

        {/* Pricing Tiers (Monthly vs Yearly vs Lifetime) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
              selectedPlan === "monthly"
                ? "bg-white border-[#174D3A] shadow-md ring-2 ring-[#C8F169]"
                : "bg-white/80 border-[#CCD5CD] hover:border-[#174D3A]/60"
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-bold text-[#404944] uppercase tracking-wider">
                    Tier 1 · Flexible
                  </span>
                  <h3 className="text-base font-bold text-[#121E1A]">Monthly Plan</h3>
                </div>
                <input
                  type="radio"
                  checked={selectedPlan === "monthly"}
                  onChange={() => setSelectedPlan("monthly")}
                  className="accent-[#174D3A] h-4 w-4"
                />
              </div>

              <div className="py-2 border-b border-[#E3F1EA] mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#003525]">₹1,000</span>
                  <span className="text-xs text-[#5B6862]">/ month</span>
                </div>
                <p className="text-[11px] text-[#5B6862] mt-0.5">Billed monthly after 30-day trial.</p>
              </div>

              <ul className="space-y-2 text-xs text-[#121E1A] mb-4">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#237A4B]">check_circle</span>
                  <span>Dynamic live status override</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#237A4B]">check_circle</span>
                  <span>Real-time anti-double booking lock</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#237A4B]">check_circle</span>
                  <span>Host daily earnings & payouts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#237A4B]">check_circle</span>
                  <span>OCPP 2.0.1 smart sync</span>
                </li>
              </ul>
            </div>

            <div className="p-2 bg-[#E9F7F0] rounded-lg text-[11px] text-[#003525] font-semibold text-center border border-[#C6E7D2]">
              Every 30 Days · Auto-Debit
            </div>
          </div>

          {/* Yearly Plan (Best Value) */}
          <div
            onClick={() => setSelectedPlan("yearly")}
            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col justify-between relative ${
              selectedPlan === "yearly"
                ? "bg-white border-[#174D3A] shadow-lg ring-2 ring-[#C8F169]"
                : "bg-white/80 border-[#CCD5CD] hover:border-[#174D3A]/60"
            }`}
          >
            <div className="absolute -top-3 right-4 bg-[#C8F169] text-[#003525] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#526D00] shadow-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">stars</span>
              <span>Best Value · Save 25%</span>
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-bold text-[#003525] uppercase tracking-wider">
                    Tier 2 · Annual Power
                  </span>
                  <h3 className="text-base font-bold text-[#121E1A]">Yearly Plan</h3>
                </div>
                <input
                  type="radio"
                  checked={selectedPlan === "yearly"}
                  onChange={() => setSelectedPlan("yearly")}
                  className="accent-[#174D3A] h-4 w-4"
                />
              </div>

              <div className="py-2 border-b border-[#E3F1EA] mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#003525]">₹9,000</span>
                  <span className="text-xs text-[#5B6862]">/ year</span>
                </div>
                <p className="text-[11px] text-[#237A4B] font-semibold mt-0.5">
                  Effective ₹750/month (Save ₹3,000)
                </p>
              </div>

              <ul className="space-y-2 text-xs text-[#121E1A] mb-4">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#237A4B]">check_circle</span>
                  <span><strong>All Monthly features included</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#237A4B]">check_circle</span>
                  <span>Priority station placement on Map</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#237A4B]">check_circle</span>
                  <span>Automated peak/off-peak pricing</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#237A4B]">check_circle</span>
                  <span>Zero platform transaction fee</span>
                </li>
              </ul>
            </div>

            <div className="p-2 bg-[#174D3A] text-[#C8F169] rounded-lg text-[11px] font-bold text-center">
              Annual License · Save ₹3,000
            </div>
          </div>

          {/* Lifetime Enterprise License */}
          <div
            onClick={() => setSelectedPlan("lifetime")}
            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
              selectedPlan === "lifetime"
                ? "bg-white border-[#174D3A] shadow-md ring-2 ring-[#C8F169]"
                : "bg-white/80 border-[#CCD5CD] hover:border-[#174D3A]/60"
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-bold text-[#404944] uppercase tracking-wider">
                    Tier 3 · Permanent
                  </span>
                  <h3 className="text-base font-bold text-[#121E1A]">Lifetime License</h3>
                </div>
                <input
                  type="radio"
                  checked={selectedPlan === "lifetime"}
                  onChange={() => setSelectedPlan("lifetime")}
                  className="accent-[#174D3A] h-4 w-4"
                />
              </div>

              <div className="py-2 border-b border-[#E3F1EA] mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#003525]">₹24,999</span>
                  <span className="text-xs text-[#5B6862]">one-time</span>
                </div>
                <p className="text-[11px] text-[#5B6862] mt-0.5">Never pay software fees again.</p>
              </div>

              <ul className="space-y-2 text-xs text-[#121E1A] mb-4">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#237A4B]">check_circle</span>
                  <span>Lifetime permanent access</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#237A4B]">check_circle</span>
                  <span>Unlimited charger guns</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#237A4B]">check_circle</span>
                  <span>Dedicated hub server node</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#237A4B]">check_circle</span>
                  <span>VIP Super Admin direct hotline</span>
                </li>
              </ul>
            </div>

            <div className="p-2 bg-[#E9F7F0] rounded-lg text-[11px] text-[#003525] font-semibold text-center border border-[#C6E7D2]">
              One-Time Payment · Lifetime
            </div>
          </div>
        </div>

        {/* AutoPay Mandate & Payment Rail Setup */}
        <div className="bg-white rounded-2xl p-5 border border-[#CCD5CD] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3F1EA]">
            <div>
              <h3 className="text-sm font-bold text-[#121E1A] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#174D3A]">sync</span>
                <span>Payment & Mandate Setup</span>
              </h3>
              <p className="text-xs text-[#5B6862]">Authorized via RBI e-Mandate framework</p>
            </div>
            <span className="text-[11px] font-semibold text-[#237A4B] bg-[#EDF7F0] px-2.5 py-0.5 rounded-full border border-[#C6E7D2]">
              Secure 256-bit
            </span>
          </div>

          <label className="flex items-start gap-3 p-3 bg-[#F5F7F4] rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={enableAutoPay}
              onChange={(e) => setEnableAutoPay(e.target.checked)}
              className="mt-0.5 accent-[#174D3A] h-4 w-4"
            />
            <div className="text-xs">
              <span className="font-bold text-[#121E1A]">
                Enable AutoPay Mandate to unlock 1st Month FREE (₹0 charged today)
              </span>
              <p className="text-[#5B6862] text-[11px] mt-0.5">
                First recurring debit will only occur on Day 31. Notification is dispatched 24h prior to any transaction.
              </p>
            </div>
          </label>

          <div>
            <span className="text-[11px] font-bold text-[#404944] uppercase tracking-wider block mb-2">
              Select Payment Method:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label
                onClick={() => setPaymentRail("upi")}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentRail === "upi"
                    ? "border-[#174D3A] bg-[#E9F7F0] ring-1 ring-[#174D3A]"
                    : "border-[#CCD5CD] bg-white hover:bg-[#F5F7F4]"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-[#003525]">UPI AutoPay</div>
                  <div className="text-[10px] text-[#5B6862]">GPay, PhonePe, Paytm</div>
                </div>
                <input
                  type="radio"
                  name="rail"
                  checked={paymentRail === "upi"}
                  onChange={() => setPaymentRail("upi")}
                  className="accent-[#174D3A]"
                />
              </label>

              <label
                onClick={() => setPaymentRail("cards")}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentRail === "cards"
                    ? "border-[#174D3A] bg-[#E9F7F0] ring-1 ring-[#174D3A]"
                    : "border-[#CCD5CD] bg-white hover:bg-[#F5F7F4]"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-[#003525]">Cards e-Mandate</div>
                  <div className="text-[10px] text-[#5B6862]">Visa, Mastercard, RuPay</div>
                </div>
                <input
                  type="radio"
                  name="rail"
                  checked={paymentRail === "cards"}
                  onChange={() => setPaymentRail("cards")}
                  className="accent-[#174D3A]"
                />
              </label>

              <label
                onClick={() => setPaymentRail("netbanking")}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentRail === "netbanking"
                    ? "border-[#174D3A] bg-[#E9F7F0] ring-1 ring-[#174D3A]"
                    : "border-[#CCD5CD] bg-white hover:bg-[#F5F7F4]"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-[#003525]">NetBanking</div>
                  <div className="text-[10px] text-[#5B6862]">HDFC, ICICI, SBI & 40+</div>
                </div>
                <input
                  type="radio"
                  name="rail"
                  checked={paymentRail === "netbanking"}
                  onChange={() => setPaymentRail("netbanking")}
                  className="accent-[#174D3A]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Action Checkout Box */}
        <div className="bg-white rounded-2xl p-6 border-2 border-[#174D3A] text-center max-w-xl mx-auto shadow-md space-y-4">
          <div>
            <span className="text-[11px] font-bold text-[#5B6862] uppercase tracking-wider block">
              Due at Checkout Today
            </span>
            <div className="text-3xl font-black text-[#003525] mt-0.5">
              {enableAutoPay && selectedPlan !== "lifetime" ? "₹0.00" : selectedPlan === "lifetime" ? "₹24,999.00" : selectedPlan === "yearly" ? "₹9,000.00" : "₹1,000.00"}
            </div>
            <p className="text-xs text-[#5B6862] mt-1">
              {enableAutoPay && selectedPlan !== "lifetime"
                ? "First recurring debit on Day 31. You can cancel at any time."
                : "Instant permanent license activation upon payment confirmation."}
            </p>
          </div>

          <button
            onClick={handleCompletePayment}
            disabled={isProcessing}
            className="w-full h-12 bg-[#174D3A] hover:bg-[#1E5E47] text-[#C8F169] text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.985] transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-[#C8F169] border-t-transparent rounded-full animate-spin"></span>
                <span>Securing Payment & Provisioning Station...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">bolt</span>
                <span>
                  {enableAutoPay && selectedPlan !== "lifetime"
                    ? "Start 30-Day Free Trial & Activate Host Portal"
                    : `Pay ${selectedPlan === "lifetime" ? "₹24,999" : selectedPlan === "yearly" ? "₹9,000" : "₹1,000"} & Activate License`}
                </span>
              </>
            )}
          </button>

          {/* Super Admin Manual Approval Notice */}
          <div className="pt-3 border-t border-[#E3F1EA] text-xs text-[#5B6862]">
            <p>
              💡 <strong>Alternative Approval:</strong> If you are an enterprise partner, the Super Admin can also grant you custom duration or lifetime license directly from the Root Management Console.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
