"use client";

import React, { useState, useEffect } from "react";

interface ActiveChargeViewProps {
  stationName?: string;
  maxKw?: number;
  onNavigateTab: (tab: "map" | "charge" | "activity" | "profile") => void;
  onSessionComplete?: (sessionSummary: {
    stationName: string;
    kwh: number;
    cost: number;
    duration: string;
  }) => void;
}

export default function ActiveChargeView({
  stationName = "GreenPulse Supercharger",
  maxKw = 180,
  onNavigateTab,
  onSessionComplete,
}: ActiveChargeViewProps) {
  // Real-time ticking charging state
  const [elapsedSeconds, setElapsedSeconds] = useState(1458); // 24m 18s
  const [soc, setSoc] = useState(68);
  const [chargeLimit, setChargeLimit] = useState<80 | 90 | 100>(80);
  const [isCharging, setIsCharging] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [unlockedPort, setUnlockedPort] = useState(false);

  // Delivered energy & cost calculation
  const tariffPerKwh = 16.0;
  const kwhDelivered = (34.6 + (elapsedSeconds - 1458) * 0.026).toFixed(1);
  const currentBill = (parseFloat(kwhDelivered) * tariffPerKwh).toFixed(2);
  const addedRange = Math.round(parseFloat(kwhDelivered) * 5.26);

  // Ticking timer
  useEffect(() => {
    if (!isCharging) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCharging]);

  // Gradual SoC increment simulation
  useEffect(() => {
    if (!isCharging || soc >= chargeLimit) return;
    const socInterval = setInterval(() => {
      setSoc((prev) => {
        if (prev < chargeLimit) return prev + 1;
        return prev;
      });
    }, 12000); // increments every 12 seconds
    return () => clearInterval(socInterval);
  }, [isCharging, soc, chargeLimit]);

  // Format elapsed time string
  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  // Calculate SVG stroke offset for circle
  // Radius = 70 => Circumference = 2 * PI * 70 = 439.82
  const circumference = 439.82;
  const strokeDashoffset = circumference - (soc / 100) * circumference;
  const limitMarkerOffset = circumference - (chargeLimit / 100) * circumference;

  const handleStopCharging = () => {
    setIsCharging(false);
    setShowInvoiceModal(true);
  };

  return (
    <div className="w-full flex flex-col pb-28">
      {/* Top App Bar */}
      <header className="bg-[#EFFDF6] sticky top-0 z-40 shadow-sm border-b border-[#C0C9C2]/40">
        <div className="flex justify-between items-center w-full px-4 h-14">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#174D3A] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[#C8F169] fill-icon">
                electric_bolt
              </span>
            </div>
            <span className="text-base font-bold tracking-tight text-[#003525]">VoltSpot</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onNavigateTab("map")}
              aria-label="Locate Station"
              className="w-10 h-10 flex items-center justify-center text-[#404944] hover:bg-[#E3F1EA] rounded-lg active:scale-[0.985] transition-all"
            >
              <span className="material-symbols-outlined">near_me</span>
            </button>
            <button
              onClick={() =>
                alert("Session telemetry stream synchronized with vehicle BMS over ISO 15118 protocol.")
              }
              aria-label="Session Menu"
              className="w-10 h-10 flex items-center justify-center text-[#404944] hover:bg-[#E3F1EA] rounded-lg active:scale-[0.985] transition-all"
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 pt-3 pb-6 space-y-4">
        {/* Station Identity & Live Status Strip */}
        <section className="bg-white border border-[#C0C9C2]/60 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-[#003525] text-base fill-icon">
                ev_station
              </span>
              <h1 className="text-sm font-bold text-[#121E1A] leading-tight">{stationName}</h1>
            </div>
            <p className="text-xs text-[#404944]">Bay 02 · {maxKw} kW DC Ultra Charger</p>
          </div>

          <div className="flex flex-col items-end space-y-1">
            <div
              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border ${
                isCharging
                  ? "bg-[#E3F1EA] border-[#D8E6DF] text-[#003525]"
                  : "bg-[#EDF7F0] border-[#C6E7D2] text-[#237A4B]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isCharging ? "bg-[#4D6700] animate-pulse" : "bg-[#237A4B]"
                }`}
              ></span>
              <span className="text-xs font-semibold text-[#003525]">
                {isCharging ? "Charging" : "Completed"}
              </span>
            </div>
            <span className="text-xs font-mono tabular-nums text-[#404944]">
              {formatDuration(elapsedSeconds)} elapsed
            </span>
          </div>
        </section>

        {/* Hero Charging Gauge & Key Telemetry (Linear / Tesla Minimalist Bento) */}
        <section className="bg-white border border-[#C0C9C2]/60 rounded-xl p-5 shadow-sm space-y-5">
          {/* SoC Gauge Ring / Metric Center */}
          <div className="flex flex-col items-center justify-center pt-2 pb-1 relative">
            <div className="relative w-52 h-52 flex items-center justify-center">
              {/* Background Arc & Dynamic Progress Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke="#E3F1EA"
                  strokeWidth="9"
                />
                {/* Active Charge Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke="#003525"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700 ease-out"
                />
                {/* Target Limiter Indicator */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke="#C8F169"
                  strokeWidth="11"
                  strokeDasharray={`2 ${circumference}`}
                  strokeDashoffset={limitMarkerOffset}
                />
              </svg>

              {/* Center Metrics */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="flex items-center space-x-1 text-[#003525]">
                  <span className="material-symbols-outlined text-base fill-icon">bolt</span>
                  <span className="text-[11px] tracking-wider uppercase text-[#404944] font-semibold">
                    State of Charge
                  </span>
                </div>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl tabular-nums text-[#121E1A] font-bold tracking-tight">
                    {soc}
                  </span>
                  <span className="text-xl font-semibold text-[#404944] ml-0.5">%</span>
                </div>
                <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded bg-[#E3F1EA] text-[#003525] text-[11px] font-semibold">
                  Target {chargeLimit}% limit
                </div>
              </div>
            </div>

            {/* Dynamic Power Delivery Visualizer */}
            <div className="w-full max-w-xs mt-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs text-[#404944]">
                <span>Power Rate</span>
                <span className="tabular-nums font-semibold text-[#121E1A]">
                  {isCharging ? "94 kW" : "0 kW"}{" "}
                  <span className="text-[#404944] font-normal">/ {maxKw} kW peak</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E3F1EA] overflow-hidden">
                <div
                  className="h-full bg-[#174D3A] rounded-full transition-all duration-500"
                  style={{ width: isCharging ? "78%" : "0%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Primary Telemetry 4-Cell Bento Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <div className="bg-[#E9F7F0] rounded-lg p-3 border border-[#E3F1EA] flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-[#404944]">
                <span className="material-symbols-outlined text-base">speed</span>
                <span className="text-xs">Added Range</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-1">
                <span className="text-xl font-bold tabular-nums text-[#121E1A]">
                  +{addedRange}
                </span>
                <span className="text-xs text-[#404944]">km</span>
              </div>
            </div>

            <div className="bg-[#E9F7F0] rounded-lg p-3 border border-[#E3F1EA] flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-[#404944]">
                <span className="material-symbols-outlined text-base">battery_charging_full</span>
                <span className="text-xs">Delivered</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-1">
                <span className="text-xl font-bold tabular-nums text-[#121E1A]">
                  {kwhDelivered}
                </span>
                <span className="text-xs text-[#404944]">kWh</span>
              </div>
            </div>

            <div className="bg-[#E9F7F0] rounded-lg p-3 border border-[#E3F1EA] flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-[#404944]">
                <span className="material-symbols-outlined text-base">timer</span>
                <span className="text-xs">Time to {chargeLimit}%</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-1">
                <span className="text-xl font-bold tabular-nums text-[#121E1A]">
                  {isCharging ? (chargeLimit === 80 ? "~11" : chargeLimit === 90 ? "~18" : "~28") : "0"}
                </span>
                <span className="text-xs text-[#404944]">mins</span>
              </div>
            </div>

            <div className="bg-[#E9F7F0] rounded-lg p-3 border border-[#E3F1EA] flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-[#404944]">
                <span className="material-symbols-outlined text-base">schedule</span>
                <span className="text-xs">Est. Finish</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-1">
                <span className="text-xl font-bold tabular-nums text-[#121E1A]">14:48</span>
                <span className="text-xs text-[#404944]">IST</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Cost & Tariff Breakdown Card */}
        <section className="bg-white border border-[#C0C9C2]/60 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-[#E3F1EA] flex items-center justify-center text-[#003525]">
                <span className="material-symbols-outlined text-base">receipt_long</span>
              </div>
              <span className="text-sm font-bold text-[#121E1A]">Session Bill & Tariff</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-[#DDEBE5] text-[#003525] font-semibold">
              AutoPay Active
            </span>
          </div>

          {/* Current Bill Amount */}
          <div className="p-3 bg-[#E9F7F0] rounded-lg border border-[#E3F1EA] flex items-baseline justify-between">
            <div>
              <div className="text-xs text-[#404944]">Current Bill ({kwhDelivered} kWh)</div>
              <div className="text-2xl tabular-nums text-[#121E1A] font-bold tracking-tight">
                ₹{currentBill}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#121E1A] font-semibold">₹16.00 / kWh</div>
              <div className="text-xs text-[#404944]">Zero idle fees</div>
            </div>
          </div>

          <p className="text-xs text-[#404944] leading-relaxed">
            Energy: ₹{currentBill} · GST & network fees included · Grace period: Idle fee applies 10 mins post-completion.
          </p>

          {/* Payment Instrument Detail */}
          <div className="pt-2 border-t border-[#C0C9C2]/60 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="material-symbols-outlined text-[#003525] text-xl">credit_card</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#121E1A]">AutoCharge · ICICI Bank</span>
                <span className="text-xs font-mono tabular-nums text-[#404944] mt-0.5">
                  •••• 4892 (Default Card)
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="text-xs text-[#003525] font-semibold hover:underline"
            >
              Receipt
            </button>
          </div>
        </section>

        {/* Hardware & Connector Telemetry */}
        <section className="bg-white border border-[#C0C9C2]/60 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#121E1A]">Connector & Battery Health</span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-semibold ${
                unlockedPort
                  ? "bg-[#FFF6E9] text-[#A96712]"
                  : "bg-[#E3F1EA] text-[#003525]"
              }`}
            >
              {unlockedPort ? "Unlocked" : "Locked"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-[#E9F7F0] rounded-lg border border-[#E3F1EA]">
              <div className="text-[#404944]">Type</div>
              <div className="font-semibold text-[#121E1A] mt-1">CCS2 Gun A</div>
            </div>
            <div className="p-2.5 bg-[#E9F7F0] rounded-lg border border-[#E3F1EA]">
              <div className="text-[#404944]">Line Output</div>
              <div className="tabular-nums font-semibold text-[#121E1A] mt-1">412V · 228A</div>
            </div>
            <div className="p-2.5 bg-[#E9F7F0] rounded-lg border border-[#E3F1EA]">
              <div className="text-[#404944]">Pack Temp</div>
              <div className="tabular-nums font-semibold text-[#121E1A] mt-1">31°C (Safe)</div>
            </div>
          </div>

          {/* Charging Limit Selector */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#121E1A] font-semibold">Charge Limit</span>
              <span className="text-[#404944] font-mono text-[11px]">80% recommended for daily health</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#E9F7F0] rounded-lg border border-[#E3F1EA]">
              {[80, 90, 100].map((limit) => (
                <button
                  key={limit}
                  onClick={() => setChargeLimit(limit as 80 | 90 | 100)}
                  className={`py-1.5 text-xs font-semibold rounded text-center transition-all ${
                    chargeLimit === limit
                      ? "bg-white shadow-sm text-[#003525]"
                      : "text-[#404944] hover:text-[#121E1A]"
                  }`}
                >
                  {limit}% {limit === 80 ? "(Daily)" : limit === 90 ? "(Trip)" : "(Max)"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Controls & Stop Session */}
        <section className="space-y-2.5 pt-1">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                if (isCharging) {
                  alert("Safety Guard: Port lock cannot be released while high-voltage DC is actively flowing. Stop the session first.");
                } else {
                  setUnlockedPort(true);
                  alert("Connector port unlocked. Safe to unplug cable.");
                }
              }}
              className={`h-11 px-4 rounded-lg border border-[#C0C9C2] text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                isCharging
                  ? "bg-[#E9F7F0] text-[#707974] cursor-not-allowed opacity-75"
                  : "bg-white text-[#003525] hover:bg-[#E3F1EA]"
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {unlockedPort ? "lock_open" : "lock"}
              </span>
              <span>{unlockedPort ? "Port Unlocked" : "Unlock Port"}</span>
            </button>

            <button
              onClick={() => {
                const nextLimit = chargeLimit === 80 ? 90 : chargeLimit === 90 ? 100 : 80;
                setChargeLimit(nextLimit as 80 | 90 | 100);
              }}
              className="h-11 px-4 rounded-lg border border-[#C0C9C2] bg-white hover:bg-[#E3F1EA] text-[#121E1A] text-xs font-semibold flex items-center justify-center space-x-1.5 active:scale-[0.985] transition-transform"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>Adjust Limit ({chargeLimit}%)</span>
            </button>
          </div>

          {/* Primary Destructive Action */}
          {isCharging ? (
            <button
              onClick={handleStopCharging}
              className="w-full h-12 rounded-lg border border-[#BA1A1A] bg-white hover:bg-[#FFDAD6] text-[#BA1A1A] text-xs font-bold flex items-center justify-center space-x-2 active:scale-[0.985] transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">stop_circle</span>
              <span>Stop Charging Session</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsCharging(true);
                setUnlockedPort(false);
              }}
              className="w-full h-12 rounded-lg bg-[#174D3A] hover:bg-[#1E5E47] text-[#C8F169] text-xs font-bold flex items-center justify-center space-x-2 active:scale-[0.985] transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">play_arrow</span>
              <span>Resume Charging Session</span>
            </button>
          )}

          {/* Station Help Reference */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#404944]">
              Station issues? Call 24/7 Ops:{" "}
              <a href="tel:+918049123000" className="text-[#003525] font-semibold hover:underline">
                +91 80 4912 3000
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* Invoice / Session Receipt Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-[420px] bg-white rounded-2xl border border-[#CCD5CD] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E1E7E2]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#237A4B] text-2xl">
                  check_circle
                </span>
                <div>
                  <h3 className="font-bold text-sm text-[#121E1A]">Charging Session Receipt</h3>
                  <p className="text-[11px] text-[#5B6862]">Tax Invoice #VOLT-2026-8924</p>
                </div>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="w-7 h-7 rounded-lg bg-[#EDF1ED] flex items-center justify-center text-[#5B6862]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="bg-[#F5F7F4] p-3 rounded-xl border border-[#E1E7E2] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5B6862]">Station</span>
                <span className="font-bold text-[#121E1A]">{stationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6862]">Energy Dispensed</span>
                <span className="font-bold text-[#121E1A]">{kwhDelivered} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6862]">Duration</span>
                <span className="font-bold text-[#121E1A]">{formatDuration(elapsedSeconds)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6862]">Added Range</span>
                <span className="font-bold text-[#237A4B]">+{addedRange} km</span>
              </div>
              <div className="pt-2 border-t border-[#E1E7E2] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#121E1A]">Total Settled</span>
                <span className="text-lg font-bold text-[#003525] tabular-nums">
                  ₹{currentBill}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[#5B6862] text-center">
              AutoCharge processed via ICICI Bank •••• 4892. Tax breakdown: CGST 9% (₹
              {(parseFloat(currentBill) * 0.09).toFixed(2)}) + SGST 9% (₹
              {(parseFloat(currentBill) * 0.09).toFixed(2)}).
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  alert("Receipt PDF generated and saved to your device.");
                  setShowInvoiceModal(false);
                }}
                className="flex-1 h-11 bg-[#174D3A] text-[#C8F169] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>Download Invoice PDF</span>
              </button>
              <button
                onClick={() => {
                  setShowInvoiceModal(false);
                  if (onSessionComplete) {
                    onSessionComplete({
                      stationName,
                      kwh: parseFloat(kwhDelivered),
                      cost: parseFloat(currentBill),
                      duration: formatDuration(elapsedSeconds),
                    });
                  }
                  onNavigateTab("activity");
                }}
                className="h-11 px-3 bg-[#E3F1EA] text-[#003525] rounded-xl text-xs font-semibold flex items-center justify-center"
              >
                <span>View Activity</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
