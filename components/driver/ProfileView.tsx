"use client";

import React, { useState } from "react";

interface ProfileViewProps {
  onOpenAuthModal: () => void;
}

export default function ProfileView({ onOpenAuthModal }: ProfileViewProps) {
  const [autoChargeEnabled, setAutoChargeEnabled] = useState(true);
  const [walletBalance, setWalletBalance] = useState(1250.0);
  const [targetSoc, setTargetSoc] = useState(80);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(500);

  const handleTopUp = () => {
    setWalletBalance((prev) => prev + topUpAmount);
    setShowTopUpModal(false);
    alert(`Wallet successfully recharged with ₹${topUpAmount}.00 via ICICI AutoPay.`);
  };

  return (
    <div className="w-full flex flex-col pb-28">
      {/* Top Header */}
      <header className="bg-[#EFFDF6] sticky top-0 z-40 w-full shadow-sm border-b border-[#C0C9C2]/40">
        <div className="flex justify-between items-center w-full px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#174D3A] text-[#C8F169] flex items-center justify-center">
              <span className="material-symbols-outlined fill-icon">electric_bolt</span>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[#003525]">VoltSpot</h1>
              <p className="text-[11px] text-[#404944] leading-none">Driver Profile & Account</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => alert("Notifications: No unread alerts.")}
              aria-label="Notifications"
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#404944] hover:bg-[#E3F1EA] active:scale-[0.985] transition-all"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              onClick={() => alert("General settings menu.")}
              aria-label="Settings"
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#404944] hover:bg-[#E3F1EA] active:scale-[0.985] transition-all"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 pt-4 space-y-4">
        {/* Driver Profile Card */}
        <section className="bg-white rounded-xl border border-[#E1E7E2] p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-[#174D3A] text-[#C8F169] flex items-center justify-center font-bold text-2xl border border-[#CCD5CD] shadow-sm">
                AS
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#174D3A] text-[#C8F169] flex items-center justify-center border-2 border-white">
                <span className="material-symbols-outlined text-sm fill-icon">verified</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-[#003525] truncate">Aarav Sharma</h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDF7F0] border border-[#C6E7D2] text-[#237A4B] text-[11px] font-semibold whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#237A4B]"></span>
                  VoltClub Premium
                </span>
              </div>
              <p className="text-xs text-[#404944] mt-0.5 truncate">+91 98450 12890</p>
              <p className="text-xs text-[#404944] truncate">aarav.sharma@domain.in</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E1E7E2] grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#E9F7F0] rounded-lg p-2.5 border border-[#E1E7E2]">
              <p className="text-xs text-[#404944]">Lifetime</p>
              <p className="text-base font-bold text-[#003525] mt-0.5 tabular-nums">1,420</p>
              <p className="text-[11px] text-[#404944]">kWh charged</p>
            </div>
            <div className="bg-[#E9F7F0] rounded-lg p-2.5 border border-[#E1E7E2]">
              <p className="text-xs text-[#404944]">Sessions</p>
              <p className="text-base font-bold text-[#003525] mt-0.5 tabular-nums">48</p>
              <p className="text-[11px] text-[#404944]">Fast cycles</p>
            </div>
            <div className="bg-[#E9F7F0] rounded-lg p-2.5 border border-[#E1E7E2]">
              <p className="text-xs text-[#404944]">CO₂ Saved</p>
              <p className="text-base font-bold text-[#237A4B] mt-0.5 tabular-nums">1.18</p>
              <p className="text-[11px] text-[#404944]">Tonnes offset</p>
            </div>
          </div>
        </section>

        {/* My EV Garage */}
        <section className="bg-white rounded-xl border border-[#E1E7E2] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003525]">directions_car</span>
              <h3 className="text-sm font-bold text-[#003525]">My EV Garage</h3>
            </div>
            <button
              onClick={() => alert("Vehicle telemetry updated: battery capacity calibrated.")}
              className="text-xs font-semibold text-[#003525] hover:underline"
            >
              Manage Garage
            </button>
          </div>

          <div className="rounded-xl border border-[#CCD5CD] bg-[#F5F7F4] p-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#003525]">Tata Nexon EV Max</span>
                  <span className="text-[10px] bg-[#174D3A] text-[#C8F169] px-2 py-0.5 rounded-full font-semibold">
                    Dark Edition
                  </span>
                </div>
                <p className="text-xs text-[#404944] mt-0.5">Registration: KA-01-MJ-9042</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EDF7F0] border border-[#C6E7D2] text-[#237A4B] text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#237A4B]"></span> Active
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#E1E7E2]">
                <span className="material-symbols-outlined text-[#003525] text-base">
                  battery_charging_full
                </span>
                <div>
                  <span className="text-[#404944] block text-[10px]">Pack Capacity</span>
                  <span className="font-semibold text-[#003525]">40.5 kWh LFP</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#E1E7E2]">
                <span className="material-symbols-outlined text-[#003525] text-base">power</span>
                <div>
                  <span className="text-[#404944] block text-[10px]">Primary Inlet</span>
                  <span className="font-semibold text-[#003525]">CCS2 Combo</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#E1E7E2]">
              <span className="text-[#404944]">Max Acceptance:</span>
              <span className="text-[#003525] font-semibold">3.3 / 7.2 kW AC · 50 kW DC Fast</span>
            </div>
          </div>

          <button
            onClick={() => alert("Add EV Modal: Pair another vehicle via VIN or Bluetooth.")}
            className="mt-3 w-full h-11 border border-dashed border-[#CCD5CD] rounded-xl text-[#003525] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#E3F1EA] transition-all active:scale-[0.985]"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Add Another EV</span>
          </button>
        </section>

        {/* RFID & AutoCharge (Plug & Charge) */}
        <section className="bg-white rounded-xl border border-[#E1E7E2] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003525]">contactless</span>
              <h3 className="text-sm font-bold text-[#003525]">RFID & AutoCharge</h3>
            </div>
            <span className="text-[11px] bg-[#EDF7F0] text-[#237A4B] border border-[#C6E7D2] px-2 py-0.5 rounded-full font-semibold">
              2 Active
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-[#E1E7E2] bg-[#E9F7F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#174D3A] text-white flex items-center justify-center">
                <span className="material-symbols-outlined">nfc</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#003525]">VoltSpot Smart RFID Keycard</p>
                <p className="text-[11px] text-[#404944]">Card #VS-8842-DL · Active & Linked</p>
              </div>
            </div>
            <button
              onClick={() => alert("RFID Card settings: Card is synchronized with station hubs.")}
              className="text-[#003525] text-xs font-semibold hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="p-3.5 rounded-xl border border-[#E1E7E2] bg-white flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C8F169] text-[#003525] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined fill-icon">bolt</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#003525]">Plug & Charge (AutoCharge)</p>
                <p className="text-[11px] text-[#404944]">
                  Instant handshake authentication on Nexon EV Max (ISO 15118)
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer ml-2">
              <input
                type="checkbox"
                checked={autoChargeEnabled}
                onChange={() => setAutoChargeEnabled(!autoChargeEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#C0C9C2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#174D3A]"></div>
            </label>
          </div>
        </section>

        {/* Payment & AutoPay */}
        <section className="bg-white rounded-xl border border-[#E1E7E2] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003525]">
                account_balance_wallet
              </span>
              <h3 className="text-sm font-bold text-[#003525]">Payment & AutoPay</h3>
            </div>
            <button
              onClick={() => alert("Billing history statement.")}
              className="text-xs font-semibold text-[#003525] hover:underline"
            >
              History
            </button>
          </div>

          {/* Wallet Banner */}
          <div className="p-4 rounded-xl bg-[#174D3A] text-white flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-[#9CD2B9]">VoltSpot Dedicated Wallet</span>
              <div className="text-2xl font-bold text-white mt-0.5 tabular-nums">
                ₹{walletBalance.toFixed(2)}
              </div>
              <span className="text-[11px] text-[#C8F169] flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8F169]"></span> Auto-reload active
                under ₹300
              </span>
            </div>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="h-10 px-4 bg-[#C8F169] text-[#003525] text-xs font-bold rounded-lg hover:brightness-105 active:scale-[0.985] flex items-center gap-1 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Top Up</span>
            </button>
          </div>

          {/* Card info */}
          <div className="p-3.5 rounded-xl border border-[#E1E7E2] bg-[#E9F7F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E1E7E2] flex items-center justify-center text-[#003525]">
                <span className="material-symbols-outlined">credit_card</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-[#003525]">ICICI SuperSpeed Card</p>
                  <span className="text-[10px] bg-[#EDF7F0] text-[#237A4B] font-semibold px-1.5 py-0.2 rounded border border-[#C6E7D2]">
                    AutoPay
                  </span>
                </div>
                <p className="text-[11px] text-[#404944]">•••• 4092 · Visa Signature</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#404944] text-xl">chevron_right</span>
          </div>

          {/* GSTIN Invoicing */}
          <div className="p-3 rounded-lg border border-[#E1E7E2] bg-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-[#404944] text-base">receipt_long</span>
              <div className="truncate">
                <span className="text-[#404944] block text-[10px]">GSTIN Invoicing (Tax Credit)</span>
                <span className="font-mono text-[#003525] font-semibold text-xs">
                  29AAAAA0000A1Z5 · GreenTech
                </span>
              </div>
            </div>
            <button
              onClick={() => alert("GSTIN profile updated.")}
              className="text-[#003525] text-xs font-semibold hover:underline shrink-0 ml-2"
            >
              Edit
            </button>
          </div>
        </section>

        {/* Charging Defaults */}
        <section className="bg-white rounded-xl border border-[#E1E7E2] p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003525]">tune</span>
            <h3 className="text-sm font-bold text-[#003525]">Charging Defaults & Network</h3>
          </div>

          <div className="p-3.5 rounded-xl border border-[#E1E7E2] bg-[#F5F7F4] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#003525]">Target Battery SoC Limit</span>
              <span className="font-bold text-[#003525]">{targetSoc}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              step={5}
              value={targetSoc}
              onChange={(e) => setTargetSoc(Number(e.target.value))}
              className="w-full accent-[#003525] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#404944]">
              <span>Daily Battery Longevity Mode</span>
              <span className="text-[#003525] font-medium">Recommended: 80%</span>
            </div>
          </div>
        </section>

        {/* Support & Actions */}
        <section className="bg-white rounded-xl border border-[#E1E7E2] p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-[#003525]">Support & Station Assistance</h3>
          <a
            href="tel:+918049123000"
            className="flex items-center justify-between p-3 rounded-lg border border-[#E1E7E2] hover:bg-[#E9F7F0] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#E3F1EA] text-[#003525] flex items-center justify-center">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#003525]">24/7 EV Helpline</p>
                <p className="text-[11px] text-[#404944]">+91 80 4912 3000 (Toll Free)</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#404944]">call</span>
          </a>

          <div className="flex items-center justify-between pt-2 text-xs text-[#404944] px-1">
            <span>App Version: v2.4.1 (Build 4910)</span>
            <span className="inline-flex items-center gap-1 text-[#003525] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#237A4B]"></span> All systems operational
            </span>
          </div>

          <button
            onClick={onOpenAuthModal}
            className="w-full h-11 mt-2 rounded-xl border border-[#BA1A1A] text-[#BA1A1A] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#FFDAD6] active:scale-[0.985] transition-colors"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Switch / Sign Out of VoltSpot</span>
          </button>
        </section>
      </main>

      {/* Top Up Wallet Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-[380px] bg-white rounded-2xl border border-[#CCD5CD] shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E1E7E2]">
              <h3 className="font-bold text-sm text-[#121E1A]">Recharge VoltSpot Wallet</h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="w-7 h-7 rounded-lg bg-[#EDF1ED] flex items-center justify-center text-[#5B6862]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#404944]">Select Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {[300, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      topUpAmount === amt
                        ? "bg-[#174D3A] text-white border-[#174D3A]"
                        : "bg-[#F5F7F4] text-[#121E1A] border-[#CCD5CD]"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-[#E9F7F0] rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#404944]">Payment Source</span>
                  <span className="font-semibold text-[#003525]">ICICI Bank •••• 4092</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#404944]">Wallet Balance After</span>
                  <span className="font-bold text-[#003525]">
                    ₹{(walletBalance + topUpAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleTopUp}
              className="w-full h-11 bg-[#174D3A] hover:bg-[#1E5E47] text-[#C8F169] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">check</span>
              <span>Confirm & Pay ₹{topUpAmount}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
