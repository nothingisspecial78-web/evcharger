"use client";

import React, { useState } from "react";

interface SuperAdminDashboardProps {
  onGrantHostStatus?: (hostName: string, status: "active" | "pending", period: string) => void;
  onSwitchToHost?: () => void;
  onSwitchToDriver?: () => void;
}

export default function SuperAdminDashboard({
  onGrantHostStatus,
  onSwitchToHost,
  onSwitchToDriver,
}: SuperAdminDashboardProps) {
  const [timeFilter, setTimeFilter] = useState("This Month");
  const [showPrivilegeModal, setShowPrivilegeModal] = useState(false);
  const [selectedHostForPrivilege, setSelectedHostForPrivilege] = useState("Suresh K. (Indiranagar FastStation #104)");
  const [grantPeriod, setGrantPeriod] = useState<"30_days" | "1_year" | "lifetime">("lifetime");
  const [customSplit, setCustomSplit] = useState(88); // 88% to host, 12% to platform
  const [lifetimeGranted, setLifetimeGranted] = useState(true);

  return (
    <div className="w-full flex flex-col pb-24 bg-[#EFFDF6] min-h-screen">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-white w-full shadow-sm border-b border-[#C0C9C2]/40">
        <div className="flex justify-between items-center w-full px-4 h-14 max-w-5xl mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#174D3A] flex items-center justify-center text-[#C8F169]">
              <span className="material-symbols-outlined text-[20px] fill-icon">bolt</span>
            </div>
            <span className="text-base font-bold text-[#003525] tracking-tight">
              VoltSpot Super Admin
            </span>
          </div>

          {/* Health & Notifications */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E9F7F0] border border-[#C0C9C2]">
              <span className="w-2 h-2 rounded-full bg-[#4D6700] animate-pulse"></span>
              <span className="text-xs font-bold text-[#003525] tabular-nums">99.98% Uptime</span>
            </div>

            <button
              onClick={() => alert("System Observability: All 520 nodal hubs reporting normal telemetry.")}
              aria-label="Notifications"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#404944] hover:bg-[#E3F1EA] active:scale-[0.985] transition-all"
            >
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-[#003525] text-[22px]">
                  notifications
                </span>
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#BA1A1A] ring-2 ring-white"></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto px-4 pt-3 flex-1 space-y-4">
        {/* Quick Summary & Telemetry Filter Banner */}
        <section className="bg-white rounded-xl p-4 border border-[#C0C9C2]/60 shadow-sm">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#003525]">
                  analytics
                </span>
                <h1 className="text-base font-bold text-[#003525]">
                  Global Fleet & User Telemetry
                </h1>
              </div>
              <p className="text-xs text-[#404944] mt-0.5">Real-time synchronized nodal observability</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#E3F1EA] text-[#003525] text-xs font-mono tabular-nums">
              UTC +05:30
            </span>
          </div>

          {/* Filter Segment Bar */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#E9F7F0] rounded-lg border border-[#C0C9C2]/60">
            {["Today", "This Week", "This Month", "All Time"].map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeFilter(tab)}
                className={`py-1.5 px-2 text-center text-xs rounded-md transition-all ${
                  timeFilter === tab
                    ? "bg-white text-[#003525] font-bold shadow-xs border border-[#C0C9C2]/60"
                    : "text-[#404944] hover:text-[#003525]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Primary KPI Metrics Grid */}
        <section className="space-y-3">
          {/* Dual Column Pair 1: Drivers & Station Hosts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Metric Card: New Drivers / Users */}
            <div className="bg-white rounded-xl p-4 border border-[#C0C9C2]/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[#404944] uppercase tracking-wider">
                    New Drivers / Users
                  </span>
                  <span className="material-symbols-outlined text-[#003525] text-[18px]">
                    directions_car
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#003525] tabular-nums tracking-tight">
                  18,420
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#E3F1EA] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#404944]">This month</span>
                  <span className="text-[#237A4B] font-bold tabular-nums">+1,240</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#404944]">Today</span>
                  <span className="text-[#003525] font-semibold tabular-nums">+84</span>
                </div>
              </div>
            </div>

            {/* Metric Card: Station Hosts / Admins */}
            <div className="bg-white rounded-xl p-4 border border-[#C0C9C2]/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[#404944] uppercase tracking-wider">
                    Station Hosts / Admins
                  </span>
                  <span className="material-symbols-outlined text-[#003525] text-[18px]">
                    corporate_fare
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#003525] tabular-nums tracking-tight">
                  342
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#E3F1EA] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#404944]">This month</span>
                  <span className="text-[#237A4B] font-bold tabular-nums">+28</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#404944]">Today</span>
                  <span className="text-[#003525] font-semibold tabular-nums">+4</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Card: Recorded Chargers & Physical Guns */}
          <div className="bg-white rounded-xl p-4 border border-[#C0C9C2]/60 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[11px] font-bold text-[#404944] uppercase tracking-wider">
                  Recorded Chargers
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-bold text-[#003525] tabular-nums">1,180 Guns</span>
                  <span className="text-xs text-[#404944]">across 520 stations</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-[#E3F1EA] flex items-center justify-center text-[#003525]">
                <span className="material-symbols-outlined text-[20px]">ev_station</span>
              </div>
            </div>

            {/* Sub-breakdown of Guns */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-[#E9F7F0] rounded-lg p-2.5 border border-[#C0C9C2]/60">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#C8F169] ring-1 ring-[#526D00]"></span>
                  <span className="text-xs font-bold text-[#121E1A]">DC Fast</span>
                </div>
                <div className="text-base font-bold text-[#003525] tabular-nums">
                  842 <span className="text-xs font-normal text-[#404944]">guns</span>
                </div>
                <span className="text-[11px] text-[#404944]">71.4% share</span>
              </div>

              <div className="bg-[#E9F7F0] rounded-lg p-2.5 border border-[#C0C9C2]/60">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#174D3A]"></span>
                  <span className="text-xs font-bold text-[#121E1A]">AC Level 2</span>
                </div>
                <div className="text-base font-bold text-[#003525] tabular-nums">
                  338 <span className="text-xs font-normal text-[#404944]">guns</span>
                </div>
                <span className="text-[11px] text-[#404944]">28.6% share</span>
              </div>
            </div>
          </div>

          {/* Metric Card: Net Platform Revenue */}
          <div className="bg-white rounded-xl p-4 border border-[#C0C9C2]/60 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#404944] uppercase tracking-wider">
                  Net Platform Revenue
                </span>
                <div className="text-2xl font-bold text-[#003525] tabular-nums mt-0.5 tracking-tight">
                  ₹14,44,200
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#EDF7F0] border border-[#C6E7D2] text-[#237A4B] text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+22.4%</span>
              </span>
            </div>

            {/* Deduction Breakdown Banner */}
            <div className="mt-3 p-3 bg-[#E9F7F0] rounded-lg border border-[#C0C9C2]/60 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#404944]">Gross Transaction Volume</span>
                <span className="font-bold text-[#003525] tabular-nums">₹14,82,400</span>
              </div>
              <div className="flex justify-between items-center text-[#BA1A1A]">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">remove_circle</span>
                  <span>Transfer & Gateway Fees (1.8% + ₹5/payout)</span>
                </div>
                <span className="font-bold tabular-nums">-₹38,200</span>
              </div>
              <div className="pt-2 border-t border-[#C0C9C2]/60 flex justify-between items-center">
                <span className="text-[#003525] font-bold">Net Earned & Disbursed</span>
                <span className="font-bold text-[#003525] tabular-nums">₹14,44,200</span>
              </div>
            </div>
          </div>
        </section>

        {/* Regional & Geographic Adoption Analytics */}
        <section className="bg-white rounded-xl p-4 border border-[#C0C9C2]/60 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#003525]">public</span>
              <h2 className="text-sm font-bold text-[#003525]">Geographic & Regional Adoption</h2>
            </div>
            <span className="text-xs text-[#404944] font-medium">Global Share</span>
          </div>

          {/* Global Share Stacked Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#003525]">India (Primary Territory)</span>
              <span className="tabular-nums font-bold text-[#003525]">
                88.4%{" "}
                <span className="font-normal text-[#404944]">(16,280 drivers · 302 stations)</span>
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#E3F1EA] flex overflow-hidden">
              <div className="h-full bg-[#174D3A] rounded-l-full" style={{ width: "88.4%" }}></div>
              <div className="h-full bg-[#C8F169]" style={{ width: "6.2%" }}></div>
              <div className="h-full bg-[#707974]" style={{ width: "3.4%" }}></div>
              <div className="h-full bg-[#D8E6DF]" style={{ width: "2.0%" }}></div>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#404944] pt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#174D3A]"></span> India 88.4%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8F169]"></span> UAE 6.2%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#707974]"></span> Singapore 3.4%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8E6DF]"></span> Other 2.0%
              </span>
            </div>
          </div>

          {/* State Level Concentration */}
          <div className="pt-2 border-t border-[#E3F1EA] space-y-2.5 text-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#404944] font-bold block">
              State Level Concentration (India)
            </span>

            {/* Karnataka */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#003525]">Karnataka</span>
                  <span className="text-[#404944]">(Bengaluru hub)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded bg-[#EDF7F0] text-[#237A4B] text-[10px] font-bold">
                    +34% MoM
                  </span>
                  <span className="tabular-nums font-bold text-[#003525]">42.1%</span>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E3F1EA] overflow-hidden">
                <div className="h-full bg-[#174D3A] rounded-full" style={{ width: "42.1%" }}></div>
              </div>
              <span className="text-[11px] text-[#404944]">6,854 users · 142 host hubs</span>
            </div>

            {/* Maharashtra */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#003525]">Maharashtra</span>
                  <span className="text-[#404944]">(Mumbai / Pune)</span>
                </div>
                <span className="tabular-nums font-bold text-[#003525]">24.8%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E3F1EA] overflow-hidden">
                <div className="h-full bg-[#174D3A] rounded-full" style={{ width: "24.8%" }}></div>
              </div>
              <span className="text-[11px] text-[#404944]">4,038 users · 86 host hubs</span>
            </div>

            {/* Tamil Nadu */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#003525]">Tamil Nadu</span>
                  <span className="text-[#404944]">(Chennai / Coimbatore)</span>
                </div>
                <span className="tabular-nums font-bold text-[#003525]">16.5%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E3F1EA] overflow-hidden">
                <div className="h-full bg-[#174D3A] rounded-full" style={{ width: "16.5%" }}></div>
              </div>
              <span className="text-[11px] text-[#404944]">2,686 users · 54 host hubs</span>
            </div>

            {/* Delhi NCR */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#003525]">Delhi NCR</span>
                <span className="tabular-nums font-bold text-[#003525]">11.2%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E3F1EA] overflow-hidden">
                <div className="h-full bg-[#174D3A] rounded-full" style={{ width: "11.2%" }}></div>
              </div>
              <span className="text-[11px] text-[#404944]">1,824 users · 38 host hubs</span>
            </div>
          </div>
        </section>

        {/* Recent Registrations Stream */}
        <section className="bg-white rounded-xl p-4 border border-[#C0C9C2]/60 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#003525]">stream</span>
              <h2 className="text-sm font-bold text-[#003525]">Recent Registrations Stream</h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#237A4B] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#237A4B] animate-ping"></span>
              <span>Live Feed</span>
            </div>
          </div>

          <div className="divide-y divide-[#E3F1EA] space-y-2 text-xs">
            {/* Item 1 */}
            <div className="pt-2 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E3F1EA] flex items-center justify-center text-[#003525] mt-0.5 shrink-0">
                <span className="material-symbols-outlined text-[18px]">
                  supervised_user_circle
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#003525]">Suresh K.</span>
                  <span className="text-[11px] text-[#404944]">22m ago</span>
                </div>
                <p className="text-[#404944]">New Host Admin · Indiranagar FastStation #104</p>
                <div className="mt-1">
                  <span className="px-1.5 py-0.2 rounded bg-[#E3F1EA] text-[10px] text-[#003525] font-semibold">
                    Station Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="pt-2 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E3F1EA] flex items-center justify-center text-[#003525] mt-0.5 shrink-0">
                <span className="material-symbols-outlined text-[18px]">electric_car</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#003525]">Amit Patel</span>
                  <span className="text-[11px] text-[#404944]">45m ago</span>
                </div>
                <p className="text-[#404944]">New Driver · Nexon EV · Ahmedabad</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="pt-2 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E3F1EA] flex items-center justify-center text-[#003525] mt-0.5 shrink-0">
                <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#003525]">GreenPulse Infra</span>
                  <span className="text-[11px] text-[#404944]">2h ago</span>
                </div>
                <p className="text-[#404944]">New Host Admin · 4 Chargers Registered</p>
                <div className="mt-1">
                  <span className="px-1.5 py-0.2 rounded bg-[#C8F169]/30 text-[10px] text-[#003525] font-bold">
                    Bulk Fleet Host
                  </span>
                </div>
              </div>
            </div>

            {/* Item 4 */}
            <div className="pt-2 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E3F1EA] flex items-center justify-center text-[#003525] mt-0.5 shrink-0">
                <span className="material-symbols-outlined text-[18px]">electric_car</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#003525]">Ananya Roy</span>
                  <span className="text-[11px] text-[#404944]">3h ago</span>
                </div>
                <p className="text-[#404944]">New Driver · MG ZS EV · Bengaluru</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Action: Manage Subscriptions & Grant Lifetime Access */}
        <section className="bg-[#174D3A] text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8F169]">
                Host Ecosystem Control
              </span>
              <span className="material-symbols-outlined text-[#C8F169] text-[20px]">vpn_key</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Manage Subscriptions & Grant Lifetime Access
            </h3>
            <p className="text-xs text-[#87BDA4] leading-relaxed">
              Elevate host quotas, review custom fee splits, or assign permanent operational bypass
              licenses across stations.
            </p>

            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowPrivilegeModal(true)}
                className="min-h-[40px] px-4 rounded-lg bg-[#C8F169] text-[#003525] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:brightness-105 active:scale-[0.985] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  admin_panel_settings
                </span>
                <span>Open Host Privileges</span>
              </button>

              <button
                onClick={() => alert("Audit Log: 14 authorization and tariff modifications recorded in ledger.")}
                className="min-h-[40px] px-3.5 rounded-lg border border-white/30 text-white font-medium text-xs hover:bg-white/10 active:scale-[0.985] transition-all"
              >
                View Audit Log
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Host Privileges & Subscription Modal */}
      {showPrivilegeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-[440px] bg-white rounded-2xl border border-[#CCD5CD] shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E1E7E2]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003525]">admin_panel_settings</span>
                <h3 className="font-bold text-sm text-[#121E1A]">Grant Host Privileges</h3>
              </div>
              <button
                onClick={() => setShowPrivilegeModal(false)}
                className="w-7 h-7 rounded-lg bg-[#EDF1ED] flex items-center justify-center text-[#5B6862]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#121E1A] mb-1">Target Host Station</label>
                <select
                  value={selectedHostForPrivilege}
                  onChange={(e) => setSelectedHostForPrivilege(e.target.value)}
                  className="w-full h-10 px-3 border border-[#CCD5CD] rounded-lg bg-white text-[#121E1A] focus:outline-none"
                >
                  <option value="Suresh K. (Indiranagar Hub)">Suresh K. (Indiranagar FastStation #104)</option>
                  <option value="GreenPulse Infra (Kozhikode)">GreenPulse Infra (Cyberpark South Gate)</option>
                  <option value="VoltCentral (Beach Road)">VoltCentral (Beach Road Bay)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-[#121E1A]">Custom Revenue Split (Host Share)</label>
                  <span className="font-bold text-[#003525]">{customSplit}% Host / {100 - customSplit}% Platform</span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={95}
                  value={customSplit}
                  onChange={(e) => setCustomSplit(Number(e.target.value))}
                  className="w-full accent-[#003525] cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#121E1A] mb-1">
                  Access Duration / Operational Period
                </label>
                <select
                  value={grantPeriod}
                  onChange={(e) => {
                    const val = e.target.value as "30_days" | "1_year" | "lifetime";
                    setGrantPeriod(val);
                    setLifetimeGranted(val === "lifetime");
                  }}
                  className="w-full h-10 px-3 border border-[#CCD5CD] rounded-lg bg-white text-[#121E1A] font-medium focus:outline-none"
                >
                  <option value="30_days">30 Days (1 Month Operational Pass)</option>
                  <option value="1_year">1 Year (Annual Enterprise License)</option>
                  <option value="lifetime">Lifetime License (Permanent Access)</option>
                </select>
              </div>

              <div className="p-3 bg-[#E9F7F0] rounded-xl border border-[#C0C9C2]/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#003525]">Direct Status Override: ACTIVE</div>
                  <div className="text-[11px] text-[#404944]">
                    Instantly unlocks Host Dashboard without payment requirement
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#237A4B] text-xl">
                  verified
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrivilegeModal(false)}
                  className="flex-1 h-10 rounded-lg border border-[#CCD5CD] text-[#5B6862] font-semibold hover:bg-[#F5F7F4]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const periodLabel =
                      grantPeriod === "lifetime"
                        ? "Lifetime License"
                        : grantPeriod === "1_year"
                        ? "1 Year (Annual)"
                        : "30 Days";
                    if (onGrantHostStatus) {
                      onGrantHostStatus(selectedHostForPrivilege, "active", periodLabel);
                    }
                    alert(`✅ Privileges Applied: Host status updated to ACTIVE (${periodLabel}) for ${selectedHostForPrivilege}. Host can now access full station operational telemetry!`);
                    setShowPrivilegeModal(false);
                  }}
                  className="flex-1 h-10 rounded-lg bg-[#174D3A] text-[#C8F169] font-bold hover:bg-[#1E5E47] shadow-sm"
                >
                  Apply & Activate Host
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
