"use client";

import React, { useState } from "react";

interface ActivityRecord {
  id: string;
  station: string;
  bay: string;
  time: string;
  location: string;
  socChange: string;
  kwh: number;
  rateKw: number;
  type: string;
  duration: string;
  connector: string;
  totalInvoiced: number;
  percentage: number;
  invoiceNo: string;
}

const PAST_SESSIONS: ActivityRecord[] = [
  {
    id: "act-1",
    station: "GreenPulse Supercharger",
    bay: "Bay 02",
    time: "Yesterday, 14:48 IST",
    location: "Outer Ring Road, Tech Corridor",
    socChange: "22% → 80% SoC",
    kwh: 34.6,
    rateKw: 180,
    type: "DC",
    duration: "26m 07s",
    connector: "CCS2 Combo",
    totalInvoiced: 553.6,
    percentage: 78,
    invoiceNo: "VOLT-892401",
  },
  {
    id: "act-2",
    station: "Nexus Hub CyberCity",
    bay: "Bay 01",
    time: "Oct 21, 18:15 IST",
    location: "Basement 2, Tower C",
    socChange: "35% → 75% SoC",
    kwh: 22.4,
    rateKw: 60,
    type: "DC",
    duration: "21m 10s",
    connector: "CCS2",
    totalInvoiced: 358.4,
    percentage: 58,
    invoiceNo: "VOLT-879102",
  },
  {
    id: "act-3",
    station: "EcoCharge TechPark",
    bay: "P-08 AC",
    time: "Oct 18, 09:30 IST",
    location: "Visitor Parking Bay 14",
    socChange: "18% → 90% SoC",
    kwh: 41.2,
    rateKw: 22,
    type: "AC",
    duration: "2h 45m",
    connector: "Type 2 AC",
    totalInvoiced: 494.4,
    percentage: 88,
    invoiceNo: "VOLT-852109",
  },
  {
    id: "act-4",
    station: "VoltSpot Highway Plaza",
    bay: "Bay 04",
    time: "Oct 12, 11:20 IST",
    location: "Highway Rest Mile 42",
    socChange: "15% → 70% SoC",
    kwh: 28.5,
    rateKw: 150,
    type: "DC",
    duration: "24m 00s",
    connector: "CCS2",
    totalInvoiced: 456.0,
    percentage: 65,
    invoiceNo: "VOLT-819920",
  },
];

export default function ActivityView() {
  const [timeFilter, setTimeFilter] = useState("This Month");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecordForInvoice, setSelectedRecordForInvoice] = useState<ActivityRecord | null>(null);
  const [selectedRecordForTelemetry, setSelectedRecordForTelemetry] = useState<ActivityRecord | null>(null);

  const filteredSessions = PAST_SESSIONS.filter((rec) => {
    if (categoryFilter === "dc" && rec.type !== "DC") return false;
    if (categoryFilter === "ac" && rec.type !== "AC") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rec.station.toLowerCase().includes(q) ||
        rec.location.toLowerCase().includes(q) ||
        rec.connector.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full flex flex-col pb-28">
      {/* Header bar */}
      <header className="sticky top-0 z-40 bg-[#EFFDF6] border-b border-[#C0C9C2]/40 shadow-sm px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#003525] fill-icon">electric_bolt</span>
          <span className="text-base font-bold text-[#003525]">VoltSpot</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const q = prompt("Search session history:", searchQuery);
              if (q !== null) setSearchQuery(q);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#E3F1EA] text-[#404944]"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
          <button
            onClick={() => alert("Consolidated Tax Statement PDF (Oct 2026) exported successfully.")}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#E3F1EA] text-[#404944]"
            title="Download Monthly Statement"
          >
            <span className="material-symbols-outlined">file_download</span>
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="px-4 pt-3 space-y-4">
        {/* Title and Statement CTA */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <h1 className="text-xl font-bold text-[#003525] tracking-tight">Activity</h1>
            <p className="text-xs text-[#404944]">Real-time session records & energy telemetry</p>
          </div>
          <button
            onClick={() => alert("Exporting certified statement PDF for current billing cycle...")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#E3F1EA] text-[#003525] text-xs font-semibold border border-[#C0C9C2] hover:bg-[#D8E6DF] transition-colors active:scale-[0.985]"
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Statement</span>
          </button>
        </div>

        {/* 1. Summary Stats Bar & Bento Module */}
        <section className="bg-white rounded-xl border border-[#E1E7E2] p-4 shadow-sm">
          {/* Time Range Pills */}
          <div className="flex items-center gap-1.5 pb-3 border-b border-[#E1E7E2] overflow-x-auto no-scrollbar">
            {["This Month", "Last Month", "Past 90 Days", "All Time"].map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  timeFilter === tab
                    ? "bg-[#003525] text-white shadow-sm"
                    : "bg-[#EFFDF6] text-[#404944] border border-[#E1E7E2] hover:bg-[#E3F1EA]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Bento Metric Cluster */}
          <div className="grid grid-cols-2 gap-2.5 pt-3">
            {/* Delivered */}
            <div className="p-3 rounded-lg bg-[#EDF1ED] border border-[#E1E7E2]">
              <div className="flex items-center justify-between text-[#404944] mb-1">
                <span className="text-xs">Delivered</span>
                <span className="material-symbols-outlined text-[16px] text-[#003525]">bolt</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#003525] tabular-nums">142.8</span>
                <span className="text-xs font-mono text-[#404944]">kWh</span>
              </div>
              <p className="text-xs text-[#237A4B] font-semibold mt-0.5 flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                <span>+18% vs Sep</span>
              </p>
            </div>

            {/* Total Spent */}
            <div className="p-3 rounded-lg bg-[#EDF1ED] border border-[#E1E7E2]">
              <div className="flex items-center justify-between text-[#404944] mb-1">
                <span className="text-xs">Total Spent</span>
                <span className="material-symbols-outlined text-[16px] text-[#003525]">
                  currency_rupee
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#003525] tabular-nums">
                  2,284<span className="text-xs">.80</span>
                </span>
                <span className="text-xs font-mono text-[#404944]">INR</span>
              </div>
              <p className="text-xs text-[#404944] mt-0.5">₹16.00 / kWh avg</p>
            </div>

            {/* Total Sessions */}
            <div className="p-3 rounded-lg bg-[#EDF1ED] border border-[#E1E7E2]">
              <div className="flex items-center justify-between text-[#404944] mb-1">
                <span className="text-xs">Sessions</span>
                <span className="material-symbols-outlined text-[16px] text-[#003525]">
                  ev_station
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#003525] tabular-nums">6</span>
                <span className="text-xs font-mono text-[#404944]">charges</span>
              </div>
              <p className="text-xs text-[#404944] mt-0.5">100% successful</p>
            </div>

            {/* CO2 Offset */}
            <div className="p-3 rounded-lg bg-[#EDF1ED] border border-[#E1E7E2]">
              <div className="flex items-center justify-between text-[#404944] mb-1">
                <span className="text-xs">CO₂ Offset</span>
                <span className="material-symbols-outlined text-[16px] text-[#237A4B]">eco</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#003525] tabular-nums">118.4</span>
                <span className="text-xs font-mono text-[#404944]">kg</span>
              </div>
              <p className="text-xs text-[#237A4B] font-semibold mt-0.5">≈ 5.4 trees/yr</p>
            </div>
          </div>
        </section>

        {/* 2. Filter Category Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
              categoryFilter === "all"
                ? "bg-[#174D3A] text-white"
                : "bg-white text-[#121E1A] border border-[#E1E7E2]"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>All Chargers</span>
          </button>

          <button
            onClick={() => setCategoryFilter("dc")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === "dc"
                ? "bg-[#174D3A] text-white"
                : "bg-white text-[#121E1A] border border-[#E1E7E2]"
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#003525]">flash_on</span>
            <span>DC Fast Only</span>
          </button>

          <button
            onClick={() => setCategoryFilter("ac")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === "ac"
                ? "bg-[#174D3A] text-white"
                : "bg-white text-[#121E1A] border border-[#E1E7E2]"
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#003525]">
              electric_car
            </span>
            <span>AC Level 2</span>
          </button>

          <button
            onClick={() => alert("All 6 tax invoices downloaded to your local PDF storage.")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#E1E7E2] hover:bg-[#E3F1EA] text-[#121E1A] text-xs font-semibold whitespace-nowrap transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#003525]">receipt</span>
            <span>Download All</span>
          </button>
        </div>

        {/* 3. Charging Sessions Feed */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-xs font-bold text-[#121E1A] uppercase tracking-wider">
              Recent Sessions
            </h2>
            <span className="text-xs font-mono text-[#404944]">
              Showing {filteredSessions.length} of {PAST_SESSIONS.length}
            </span>
          </div>

          {filteredSessions.map((session) => (
            <article
              key={session.id}
              className="bg-white rounded-xl border border-[#CCD5CD] p-4 shadow-sm hover:border-[#003525] transition-all"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-sm font-bold text-[#121E1A]">{session.station}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EDF1ED] text-xs font-mono text-[#121E1A] border border-[#E1E7E2]">
                      {session.bay}
                    </span>
                  </div>
                  <p className="text-xs text-[#404944]">
                    {session.time} • {session.location}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#EDF7F0] border border-[#C6E7D2] text-[#237A4B] text-xs font-semibold whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#237A4B]"></span>
                  AutoPay
                </span>
              </div>

              {/* Telemetry Progress & Hardware Details */}
              <div className="my-3 p-3 rounded-lg bg-[#EDF1ED] border border-[#E1E7E2] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#404944] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[#003525]">
                      battery_charging_full
                    </span>
                    <span>{session.socChange}</span>
                  </span>
                  <span className="font-mono font-semibold text-[#003525]">
                    {session.kwh} kWh delivered
                  </span>
                </div>

                {/* Progress Pill Bar */}
                <div className="w-full h-2 rounded-full bg-[#E1E7E2] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      session.rateKw >= 100 ? "bg-[#C8F169]" : "bg-[#174D3A]"
                    }`}
                    style={{ width: `${session.percentage}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 pt-1 text-center divide-x divide-[#CCD5CD] text-xs">
                  <div>
                    <span className="block text-[#404944] text-[10px] font-semibold">RATE / PEAK</span>
                    <span className="font-mono font-bold text-[#121E1A]">
                      {session.rateKw} kW {session.type}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#404944] text-[10px] font-semibold">DURATION</span>
                    <span className="font-mono font-bold text-[#121E1A]">{session.duration}</span>
                  </div>
                  <div>
                    <span className="block text-[#404944] text-[10px] font-semibold">CONNECTOR</span>
                    <span className="font-mono font-bold text-[#121E1A]">{session.connector}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Action & Billing */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[11px] text-[#404944] block">Total Invoiced</span>
                  <span className="text-base font-bold text-[#003525] tabular-nums">
                    ₹{session.totalInvoiced.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRecordForTelemetry(session)}
                    className="h-10 px-3 rounded-lg border border-[#CCD5CD] bg-white hover:bg-[#F5F7F4] text-[#121E1A] text-xs font-semibold flex items-center gap-1 active:scale-[0.985] transition-all"
                  >
                    <span className="material-symbols-outlined text-[17px]">show_chart</span>
                    <span>Telemetry</span>
                  </button>

                  <button
                    onClick={() => setSelectedRecordForInvoice(session)}
                    className="h-10 px-3.5 rounded-lg bg-[#174D3A] text-white hover:bg-[#1E5E47] text-xs font-semibold flex items-center gap-1 active:scale-[0.985] transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[17px] text-[#C8F169]">
                      download
                    </span>
                    <span>Invoice</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* 4. Session Analytics & Histogram Chart */}
        <section className="bg-white rounded-xl border border-[#E1E7E2] p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#121E1A]">Session Acceptance Analytics</h3>
              <p className="text-xs text-[#404944]">Charging curve efficiency & thermal drift</p>
            </div>
            <span className="material-symbols-outlined text-[#003525]">insights</span>
          </div>

          {/* Histogram Visualization Bar Representation */}
          <div className="p-3 bg-[#EDF1ED] rounded-lg border border-[#E1E7E2]">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-medium text-[#121E1A]">Average Acceptance Rate</span>
              <span className="font-mono font-bold text-[#003525]">112 kW DC</span>
            </div>

            <div className="flex items-end gap-1.5 h-16 pt-2">
              {[
                { height: "45%", label: "Session 1", kw: "80 kW" },
                { height: "65%", label: "Session 2", kw: "120 kW" },
                { height: "95%", label: "Session 3 (Peak)", kw: "180 kW", highlight: true },
                { height: "50%", label: "Session 4", kw: "90 kW" },
                { height: "85%", label: "Session 5", kw: "150 kW", highlight: true },
                { height: "72%", label: "Session 6", kw: "130 kW" },
              ].map((bar, idx) => (
                <div
                  key={idx}
                  title={`${bar.label}: ${bar.kw}`}
                  className={`flex-1 rounded-t-sm transition-all hover:opacity-80 cursor-pointer ${
                    bar.highlight ? "bg-[#C8F169]" : "bg-[#174D3A]"
                  }`}
                  style={{ height: bar.height }}
                ></div>
              ))}
            </div>

            <div className="flex justify-between text-[10px] text-[#404944] mt-2 font-mono">
              <span>01 Oct</span>
              <span>Peak: 180 kW DC</span>
              <span>Today</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => alert("Consolidated Tax Invoices for Financial Year 2026-27 generated.")}
              className="h-10 px-3 rounded-lg border border-[#CCD5CD] bg-white hover:bg-[#F5F7F4] text-[#121E1A] text-xs font-semibold flex items-center justify-center gap-1 active:scale-[0.985]"
            >
              <span className="material-symbols-outlined text-[17px] text-[#003525]">
                request_quote
              </span>
              <span>Consolidated Tax Invoices</span>
            </button>
            <button
              onClick={() => alert("Efficiency Report: Battery thermal resistance was within ±1.2% nominal limits.")}
              className="h-10 px-3 rounded-lg bg-[#174D3A] text-white hover:bg-[#1E5E47] text-xs font-semibold flex items-center justify-center gap-1 active:scale-[0.985]"
            >
              <span className="material-symbols-outlined text-[17px] text-[#C8F169]">tune</span>
              <span>Efficiency Report</span>
            </button>
          </div>
        </section>
      </main>

      {/* Invoice Download Modal */}
      {selectedRecordForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-[420px] bg-white rounded-2xl border border-[#CCD5CD] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E1E7E2]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003525] text-2xl">receipt_long</span>
                <div>
                  <h3 className="font-bold text-sm text-[#121E1A]">Tax Invoice</h3>
                  <p className="text-[11px] text-[#5B6862]">#{selectedRecordForInvoice.invoiceNo}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecordForInvoice(null)}
                className="w-7 h-7 rounded-lg bg-[#EDF1ED] flex items-center justify-center text-[#5B6862]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-3 bg-[#F5F7F4] rounded-xl border border-[#E1E7E2] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5B6862]">Station & Bay</span>
                <span className="font-bold text-[#121E1A]">
                  {selectedRecordForInvoice.station} ({selectedRecordForInvoice.bay})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6862]">Date & Time</span>
                <span className="font-medium text-[#121E1A]">{selectedRecordForInvoice.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6862]">Energy Dispensed</span>
                <span className="font-bold text-[#121E1A]">{selectedRecordForInvoice.kwh} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6862]">Peak Rate</span>
                <span className="font-mono text-[#121E1A]">
                  {selectedRecordForInvoice.rateKw} kW {selectedRecordForInvoice.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6862]">Duration</span>
                <span className="font-medium text-[#121E1A]">{selectedRecordForInvoice.duration}</span>
              </div>
              <div className="pt-2 border-t border-[#E1E7E2] flex justify-between items-baseline">
                <span className="font-bold text-[#121E1A]">Total Settled (incl. 18% GST)</span>
                <span className="text-lg font-bold text-[#003525] tabular-nums">
                  ₹{selectedRecordForInvoice.totalInvoiced.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Downloaded PDF Invoice #${selectedRecordForInvoice.invoiceNo}`);
                setSelectedRecordForInvoice(null);
              }}
              className="w-full h-11 bg-[#174D3A] hover:bg-[#1E5E47] text-[#C8F169] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Download Official Tax PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Telemetry Curve Modal */}
      {selectedRecordForTelemetry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-[460px] bg-white rounded-2xl border border-[#CCD5CD] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E1E7E2]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003525] text-2xl">show_chart</span>
                <div>
                  <h3 className="font-bold text-sm text-[#121E1A]">Telemetry Curve Analysis</h3>
                  <p className="text-[11px] text-[#5B6862]">
                    {selectedRecordForTelemetry.station} · {selectedRecordForTelemetry.bay}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecordForTelemetry(null)}
                className="w-7 h-7 rounded-lg bg-[#EDF1ED] flex items-center justify-center text-[#5B6862]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* SVG Telemetry Curve Chart */}
            <div className="bg-[#121E1A] p-4 rounded-xl border border-[#27332F] text-white">
              <div className="flex justify-between items-center text-xs mb-3 text-[#9CD2B9]">
                <span>Charging Power Curve (kW vs Minutes)</span>
                <span className="font-mono text-[#C8F169]">Peak: {selectedRecordForTelemetry.rateKw} kW</span>
              </div>
              <svg className="w-full h-32" viewBox="0 0 300 120">
                {/* Grid Lines */}
                <line x1="0" y1="30" x2="300" y2="30" stroke="#27332F" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="#27332F" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="300" y2="90" stroke="#27332F" strokeDasharray="3 3" />

                {/* Curve Area & Line */}
                <path
                  d="M0 100 Q 40 20, 100 24 T 200 45 T 300 90 L 300 120 L 0 120 Z"
                  fill="url(#curveGradient)"
                  opacity="0.3"
                />
                <path
                  d="M0 100 Q 40 20, 100 24 T 200 45 T 300 90"
                  fill="none"
                  stroke="#C8F169"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C8F169" />
                    <stop offset="100%" stopColor="#174D3A" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex justify-between text-[10px] font-mono text-[#87BDA4] mt-2">
                <span>0m (Plug In)</span>
                <span>12m (Peak Absorption)</span>
                <span>{selectedRecordForTelemetry.duration}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#F5F7F4] rounded-lg border border-[#E1E7E2]">
                <div className="text-[#5B6862]">Pack Temperature Range</div>
                <div className="font-bold text-[#121E1A] mt-0.5">28°C → 34°C (Optimal)</div>
              </div>
              <div className="p-2.5 bg-[#F5F7F4] rounded-lg border border-[#E1E7E2]">
                <div className="text-[#5B6862]">Conversion Efficiency</div>
                <div className="font-bold text-[#237A4B] mt-0.5">97.4% High Efficiency</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
