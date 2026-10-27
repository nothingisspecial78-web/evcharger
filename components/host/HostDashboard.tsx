"use client";

import React, { useState } from "react";

export interface ChargerBookingRequest {
  id: string;
  driverName: string;
  driverPhone: string;
  vehicle: string;
  stationName: string;
  bayId: string;
  connector: string;
  kw: number;
  timestamp: string;
  status: "pending" | "accepted" | "declined";
}

interface HostDashboardProps {
  bookingRequests?: ChargerBookingRequest[];
  onAcceptRequest?: (id: string) => void;
  onDeclineRequest?: (id: string) => void;
  onSwitchToDriver?: () => void;
  hostName?: string;
}

export default function HostDashboard({
  bookingRequests = [],
  onAcceptRequest,
  onDeclineRequest,
  onSwitchToDriver,
  hostName = "Indiranagar Hub #104",
}: HostDashboardProps) {
  const [broadcastActive, setBroadcastActive] = useState(true);
  const [gun1Status, setGun1Status] = useState<"available" | "private" | "maintenance" | "offline">("available");
  const [gun2Extended, setGun2Extended] = useState(false);
  const [gun2Released, setGun2Released] = useState(false);
  const [showAddGunModal, setShowAddGunModal] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [newGunKw, setNewGunKw] = useState("120");
  const [newGunType, setNewGunType] = useState("CCS2");
  const [newGunTariff, setNewGunTariff] = useState("20.00");

  const [gunsList, setGunsList] = useState([
    {
      id: "VSP-INDR-01A",
      name: "Charger Gun 01",
      connector: "CCS2 · DC Dual",
      kw: 180,
      tariff: 21.5,
      amps: 300,
    },
  ]);

  const pendingRequests = bookingRequests.filter((r) => r.status === "pending");

  const handleAddGun = (e: React.FormEvent) => {
    e.preventDefault();
    setGunsList((prev) => [
      ...prev,
      {
        id: `VSP-INDR-0${prev.length + 2}C`,
        name: `Charger Gun 0${prev.length + 2}`,
        connector: newGunType,
        kw: parseInt(newGunKw),
        tariff: parseFloat(newGunTariff),
        amps: 250,
      },
    ]);
    setShowAddGunModal(false);
    alert(`New hardware gun (${newGunKw} kW ${newGunType}) registered into Indiranagar Hub telemetry grid.`);
  };

  return (
    <div className="w-full flex flex-col pb-24 bg-[#EFFDF6] min-h-screen">
      {/* Top App Bar */}
      <header className="bg-white text-[#003525] shadow-sm sticky top-0 z-40 border-b border-[#C0C9C2]/40">
        <div className="flex justify-between items-center w-full px-4 h-14 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003525] text-[24px] fill-icon">
              electric_bolt
            </span>
            <span className="text-base font-bold tracking-tight text-[#003525]">
              VoltSpot Host Portal
            </span>
            <span className="hidden sm:inline-block bg-[#E3F1EA] text-[#003525] text-[10px] font-bold px-2 py-0.5 rounded-md">
              ADMIN
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Location Pin Chip */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F1EA] border border-[#C0C9C2] text-[#003525] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] text-[#003525] fill-icon">
                location_on
              </span>
              <span>Indiranagar Hub · 2 Ports Active</span>
            </div>

            {/* Quick Switch to Driver Account */}
            {onSwitchToDriver && (
              <button
                onClick={onSwitchToDriver}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#E9F7F0] text-[#003525] hover:bg-[#D8E6DF] transition-colors border border-[#C0C9C2]"
                title="Switch to Driver User Interface"
              >
                Switch to Driver
              </button>
            )}

            {/* Notification Bell with Real-time Badge */}
            <button
              onClick={() => setShowNotificationDrawer(true)}
              aria-label="Notifications"
              className="relative p-2 rounded-lg text-[#003525] hover:bg-[#E3F1EA] transition-colors duration-150 min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {pendingRequests.length > 0 ? (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#BA1A1A] text-white text-[10px] font-bold flex items-center justify-center animate-bounce ring-2 ring-white">
                  {pendingRequests.length}
                </span>
              ) : (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C8F169] ring-2 ring-white"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto px-4 pt-4 flex-1 space-y-4">
        {/* INCOMING CHARGER BOOKING REQUEST NOTIFICATION BANNER */}
        {pendingRequests.length > 0 && (
          <div className="bg-[#FFF6E9] border-2 border-[#E5A84B] rounded-2xl p-4 sm:p-5 shadow-lg animate-in slide-in-from-top-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E5A84B] animate-ping"></span>
                <span className="material-symbols-outlined text-[#A96712] text-xl">notification_important</span>
                <h3 className="font-bold text-sm sm:text-base text-[#121E1A]">
                  New Driver Charger Request Received!
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-[#A96712] text-white px-2 py-0.5 rounded-full font-bold">
                {pendingRequests.length} Pending
              </span>
            </div>

            <div className="divide-y divide-[#F2D7B2]">
              {pendingRequests.map((req) => (
                <div key={req.id} className="pt-2.5 first:pt-0 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div>
                      <span className="font-bold text-[#003525] text-sm">{req.driverName}</span>
                      <span className="text-[#404944] ml-2">({req.vehicle})</span>
                      <span className="text-[11px] text-[#A96712] ml-2">· {req.timestamp}</span>
                    </div>
                    <div className="font-semibold text-[#003525]">
                      Requested: <span className="font-mono">{req.bayId}</span> ({req.connector} · {req.kw} kW)
                    </div>
                  </div>

                  <p className="text-[11px] text-[#5B6862]">
                    Driver is waiting for station authorization. Accepting will lock the hardware connector and prevent conflicting bookings.
                  </p>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onAcceptRequest && onAcceptRequest(req.id)}
                      className="px-4 py-2 bg-[#174D3A] hover:bg-[#1E5E47] text-[#C8F169] rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <span>Accept & Lock Bay</span>
                    </button>
                    <button
                      onClick={() => onDeclineRequest && onDeclineRequest(req.id)}
                      className="px-3.5 py-2 bg-white hover:bg-[#FFF0F0] border border-[#CCD5CD] text-[#BA1A1A] rounded-xl font-semibold text-xs active:scale-95 transition-all"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Station Public Visibility & Geofence Banner */}
        <section className="bg-white rounded-xl p-4 sm:p-5 border border-[#C0C9C2]/60 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-[#E3F1EA] text-[#003525] text-xs font-bold border border-[#C0C9C2]">
                  Station ID #104
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    broadcastActive
                      ? "bg-[#EDF7F0] border border-[#C6E7D2] text-[#237A4B]"
                      : "bg-[#FDF0F0] border border-[#F8CDCD] text-[#BA1A1A]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      broadcastActive ? "bg-[#237A4B] animate-pulse" : "bg-[#BA1A1A]"
                    }`}
                  ></span>
                  {broadcastActive ? "Public & Discoverable" : "Station Hidden (Private)"}
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C8F169] text-[#526D00] text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Anti-Conflict Guard Active
                </span>
              </div>

              <h1 className="text-lg font-bold text-[#003525] mt-1">
                VoltSpot FastStation #104 - 100ft Road, Indiranagar
              </h1>
              <p className="text-xs text-[#404944] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#707974]">
                  near_me
                </span>
                Bengaluru, Karnataka · Lat 12.9719° N, Long 77.6412° E · Geofence Radius 25m
              </p>
            </div>

            {/* Master Visibility Toggle Switch */}
            <div className="flex items-center gap-3 bg-[#E9F7F0] px-4 py-2.5 rounded-xl border border-[#C0C9C2] shrink-0">
              <div className="text-left">
                <div className="text-xs font-bold text-[#003525]">Broadcast to Driver Map</div>
                <div className="text-[11px] text-[#404944]">Instant visibility to nearby EVs</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer min-w-[44px] min-h-[44px]">
                <input
                  type="checkbox"
                  checked={broadcastActive}
                  onChange={() => setBroadcastActive(!broadcastActive)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#C0C9C2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[14px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#174D3A]"></div>
              </label>
            </div>
          </div>

          {/* Real-time Station Telemetry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[#C0C9C2]/60">
            <div className="bg-[#E9F7F0] p-3 rounded-lg border border-[#C0C9C2]/60">
              <div className="text-xs text-[#404944]">Completed Today</div>
              <div className="text-xl font-bold text-[#003525] mt-0.5 tabular-nums">
                14 <span className="text-xs font-normal text-[#404944]">sessions</span>
              </div>
            </div>
            <div className="bg-[#E9F7F0] p-3 rounded-lg border border-[#C0C9C2]/60">
              <div className="text-xs text-[#404944]">Host Today's Net</div>
              <div className="text-xl font-bold text-[#003525] mt-0.5 tabular-nums">₹3,840</div>
            </div>
            <div className="bg-[#E9F7F0] p-3 rounded-lg border border-[#C0C9C2]/60">
              <div className="text-xs text-[#404944]">Telemetry Health</div>
              <div className="text-xl font-bold text-[#003525] mt-0.5 tabular-nums">
                99.4% <span className="text-xs font-semibold text-[#237A4B]">Uptime</span>
              </div>
            </div>
            <div className="bg-[#E9F7F0] p-3 rounded-lg border border-[#C0C9C2]/60">
              <div className="text-xs text-[#404944]">Anti-Lock Shield</div>
              <div className="text-xl font-bold text-[#003525] mt-0.5 tabular-nums">
                0 <span className="text-xs font-normal text-[#404944]">conflicts</span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Row: Add New Charger & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#003525]">Station Connector Fleet</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#B7EFD4] text-[#002116] text-xs font-semibold">
              {gunsList.length + 1} Guns Configured
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Connector fleet filter: displaying all active hardware pins.")}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#C0C9C2] text-[#003525] text-xs font-semibold hover:bg-[#E3F1EA] transition-colors min-h-[40px]"
            >
              <span className="material-symbols-outlined text-[17px]">tune</span>
              <span>Filter Status</span>
            </button>
            <button
              onClick={() => setShowAddGunModal(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#174D3A] text-white text-xs font-bold hover:bg-[#1E5E47] transition-all active:scale-[0.985] min-h-[40px] shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-[#C8F169]">
                add_circle
              </span>
              <span>+ Add New EV Charger / Gun</span>
            </button>
          </div>
        </div>

        {/* Charger Fleet List */}
        <div className="space-y-4">
          {/* Charger Gun 01: Available (180 kW Ultra Fast) */}
          <article className="bg-white rounded-xl border border-[#C0C9C2]/80 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#E9F7F0] border border-[#C0C9C2] flex items-center justify-center text-[#003525] shrink-0">
                  <span className="material-symbols-outlined text-[26px] fill-icon">ev_station</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-[#003525]">Charger Gun 01</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#E3F1EA] text-[#404944] text-xs font-mono border border-[#C0C9C2]">
                      CCS2 · DC Dual
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#C8F169] text-[#526D00] text-xs font-bold">
                      180 kW Ultra Fast
                    </span>
                  </div>
                  <p className="text-xs text-[#404944] mt-0.5">
                    Base Tariff: ₹21.50 / kWh · Gun ID: VSP-INDR-01A · Max Amperage: 300A
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    gun1Status === "available"
                      ? "bg-[#EDF7F0] border border-[#C6E7D2] text-[#237A4B]"
                      : gun1Status === "private"
                      ? "bg-[#FFF6E9] border border-[#F2D7B2] text-[#A96712]"
                      : "bg-[#FDF0F0] border border-[#F8CDCD] text-[#BA1A1A]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      gun1Status === "available"
                        ? "bg-[#237A4B] animate-pulse"
                        : gun1Status === "private"
                        ? "bg-[#A96712]"
                        : "bg-[#BA1A1A]"
                    }`}
                  ></span>
                  <span>
                    {gun1Status === "available"
                      ? "Available · Ready for Drivers"
                      : gun1Status === "private"
                      ? "Reserved Privately"
                      : gun1Status === "maintenance"
                      ? "Maintenance Mode"
                      : "Offline for Diagnostics"}
                  </span>
                </div>
              </div>
            </div>

            {/* Instant Status Override Selector Buttons */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-3 border-t border-[#C0C9C2]/60 items-center">
              <div className="lg:col-span-7 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#404944]">
                  Instant Host Operational Override:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      setGun1Status("available");
                      alert("Gun 01 set to Available for driver mobile discovery.");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] flex items-center gap-1 transition-all ${
                      gun1Status === "available"
                        ? "bg-[#174D3A] text-white shadow-sm"
                        : "bg-white text-[#003525] border border-[#C0C9C2] hover:bg-[#E3F1EA]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Available</span>
                  </button>

                  <button
                    onClick={() => {
                      setGun1Status("private");
                      alert("Gun 01 locked out for host depot fleet priority.");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] flex items-center gap-1 transition-all ${
                      gun1Status === "private"
                        ? "bg-[#174D3A] text-white shadow-sm"
                        : "bg-white text-[#003525] border border-[#C0C9C2] hover:bg-[#E3F1EA]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">lock_clock</span>
                    <span>Reserve Privately</span>
                  </button>

                  <button
                    onClick={() => {
                      setGun1Status("maintenance");
                      alert("Gun 01 flagged for maintenance inspection.");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] flex items-center gap-1 transition-all ${
                      gun1Status === "maintenance"
                        ? "bg-[#174D3A] text-white shadow-sm"
                        : "bg-white text-[#003525] border border-[#C0C9C2] hover:bg-[#E3F1EA]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">build</span>
                    <span>Maintenance</span>
                  </button>

                  <button
                    onClick={() => {
                      setGun1Status("offline");
                      alert("Hardware override: Gun 01 set to Offline.");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] flex items-center gap-1 transition-all ${
                      gun1Status === "offline"
                        ? "bg-[#BA1A1A] text-white shadow-sm"
                        : "bg-white text-[#BA1A1A] border border-[#C0C9C2] hover:bg-[#FFDAD6]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">power_off</span>
                    <span>Set Offline</span>
                  </button>
                </div>
              </div>

              {/* Anti-Double Booking Guard Pill */}
              <div className="lg:col-span-5 bg-[#E9F7F0] p-3 rounded-lg border border-[#C0C9C2]/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#003525] text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px] text-[#4D6700]">
                      verified_user
                    </span>
                    <span>Anti-Double Booking Guard</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#526D00] bg-[#C8F169] px-2 py-0.5 rounded font-bold">
                    STRICT LOCK ON
                  </span>
                </div>
                <p className="text-xs text-[#404944] mt-1">
                  Synchronized with driver mobile discovery. Driver tap instantly locks this slot
                  for 10 minutes to reject duplicate requests.
                </p>
              </div>
            </div>
          </article>

          {/* Charger Gun 02: In Session (60 kW DC Fast) */}
          <article className="bg-white rounded-xl border-2 border-[#174D3A] p-4 sm:p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#E9F7F0] border border-[#C0C9C2] flex items-center justify-center text-[#003525] shrink-0 relative">
                  <span className="material-symbols-outlined text-[28px]">battery_charging_full</span>
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#C8F169] ring-2 ring-white"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-[#003525]">Charger Gun 02</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#E3F1EA] text-[#404944] text-xs font-mono border border-[#C0C9C2]">
                      Type 2 / CCS2
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#DDEBE5] text-[#003525] text-xs font-semibold">
                      60 kW DC Fast
                    </span>
                  </div>
                  <p className="text-xs text-[#404944] mt-0.5">
                    Base Tariff: ₹18.00 / kWh · Gun ID: VSP-INDR-02B · Slot Reserved
                  </p>
                </div>
              </div>

              {/* Live Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8F169] text-[#526D00] border border-[#C8F169] text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>{gun2Released ? "Slot Released" : "Booked / In Session"}</span>
              </div>
            </div>

            {/* Active Booking Metrics & Conflict Lock */}
            <div className="bg-[#E9F7F0] rounded-xl p-3 sm:p-4 border border-[#C0C9C2]/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#003525]">person</span>
                  <span className="text-[#003525]">Driver: Aarav S.</span>
                  <span className="text-[#404944]">· Tata Nexon EV Max (KA 03 MP 4410)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#003525]">
                  <span className="material-symbols-outlined text-[16px] text-[#707974]">schedule</span>
                  <span>
                    {gun2Extended ? "14:15 - 15:00 IST (33 mins remaining)" : "14:15 - 14:45 IST (18 mins remaining)"}
                  </span>
                </div>
              </div>

              {/* Progress and Live Flow Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#404944]">
                  <span>Current Delivery: 52 kW continuous</span>
                  <span className="font-semibold text-[#003525]">78% SoC · 24.6 kWh dispensed</span>
                </div>
                <div className="h-2 w-full bg-[#C0C9C2] rounded-full overflow-hidden">
                  <div className="h-full bg-[#174D3A] rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>

              {/* Conflict Lock Guarantee Notice */}
              <div className="flex items-start sm:items-center gap-2 bg-white p-2.5 rounded-lg border border-[#C0C9C2]/60 text-xs text-[#404944]">
                <span className="material-symbols-outlined text-[18px] text-[#003525] shrink-0">
                  shield_lock
                </span>
                <div className="flex-1">
                  <strong className="text-[#003525]">Live Slot Lock Engaged:</strong> Discovery broadcast
                  hidden for this gun. All concurrent booking API calls automatically return HTTP 423
                  (Locked).
                </div>
              </div>
            </div>

            {/* Emergency Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-[#404944]">
                <span className="material-symbols-outlined text-[16px] text-[#707974]">sync</span>
                <span>Auto-releases on cable disconnect or session completion.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setGun2Extended(true);
                    alert("Session extended by 15 minutes. Driver notified.");
                  }}
                  className="px-3.5 py-2 rounded-lg bg-white border border-[#C0C9C2] text-[#003525] text-xs font-semibold hover:bg-[#E3F1EA] transition-colors min-h-[40px]"
                >
                  Extend Window (+15 min)
                </button>
                <button
                  onClick={() => {
                    setGun2Released(true);
                    alert("Emergency Override: Slot lock disengaged and port unlocked.");
                  }}
                  className="px-3.5 py-2 rounded-lg bg-white border border-[#BA1A1A] text-[#BA1A1A] text-xs font-semibold hover:bg-[#FFDAD6] transition-colors min-h-[40px] flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">eject</span>
                  <span>Override Emergency Release</span>
                </button>
              </div>
            </div>
          </article>
        </div>

        {/* Policy Bento Card */}
        <section className="bg-[#E9F7F0] rounded-xl p-4 sm:p-5 border border-[#C0C9C2]/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#003525]">
            <span className="material-symbols-outlined text-[22px]">policy</span>
            <h3 className="text-sm font-bold">Automated Concurrent Booking Protection Policy</h3>
          </div>
          <p className="text-xs text-[#404944] leading-relaxed">
            When an authorized driver selects and confirms a timeslot through the VoltSpot application,
            the hardware gun connector is dynamically isolated from discovery algorithms. No secondary
            driver can reserve the concurrent window, mitigating arrival queue friction and station physical disputes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-white p-3 rounded-lg border border-[#C0C9C2]/60">
              <div className="flex items-center gap-2 text-xs font-bold text-[#003525]">
                <span className="material-symbols-outlined text-[18px]">timer</span>
                <span>10-Min Arrival Hold</span>
              </div>
              <p className="text-[11px] text-[#404944] mt-1">
                If the EV does not plug in within 10 minutes of booking start, lock auto-expires.
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#C0C9C2]/60">
              <div className="flex items-center gap-2 text-xs font-bold text-[#003525]">
                <span className="material-symbols-outlined text-[18px]">speed</span>
                <span>Zero-Latency Map Sync</span>
              </div>
              <p className="text-[11px] text-[#404944] mt-1">
                Status switches propagate over MQTT websockets to navigation units in under 400ms.
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#C0C9C2]/60">
              <div className="flex items-center gap-2 text-xs font-bold text-[#003525]">
                <span className="material-symbols-outlined text-[18px]">handshake</span>
                <span>Host Override Authority</span>
              </div>
              <p className="text-[11px] text-[#404944] mt-1">
                Physical station staff can unlock guns manually if an EV stalls or leaves prematurely.
              </p>
            </div>
          </div>
        </section>

        {/* Host Payout & Plan Summary */}
        <section className="bg-white rounded-xl p-4 sm:p-5 border border-[#C0C9C2]/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E3F1EA] flex items-center justify-center text-[#003525] shrink-0">
              <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
            </div>
            <div>
              <div className="text-xs text-[#404944]">Daily Settlements & Billing Tier</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-bold text-[#003525] tabular-nums">₹3,840</span>
                <span className="text-xs text-[#404944]">
                  accrued today (auto-transfer at 23:59 IST)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-[#003525]">Enterprise Host Plan</div>
              <div className="text-[11px] text-[#404944]">Yearly Active · AutoPay Enabled</div>
            </div>
            <button
              onClick={() => alert("Host Plan & Tariff Manager opened.")}
              className="px-4 py-2 rounded-lg bg-[#E9F7F0] border border-[#C0C9C2] text-[#003525] text-xs font-bold hover:bg-[#D8E6DF] transition-colors min-h-[40px]"
            >
              Manage Plan & Tariffs
            </button>
          </div>
        </section>
      </main>

      {/* Add New EV Charger Modal */}
      {showAddGunModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-[420px] bg-white rounded-2xl border border-[#CCD5CD] shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E1E7E2]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003525]">add_circle</span>
                <h3 className="font-bold text-sm text-[#121E1A]">Add New Charger Gun</h3>
              </div>
              <button
                onClick={() => setShowAddGunModal(false)}
                className="w-7 h-7 rounded-lg bg-[#EDF1ED] flex items-center justify-center text-[#5B6862]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleAddGun} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#121E1A] mb-1">
                  Connector Standard
                </label>
                <select
                  value={newGunType}
                  onChange={(e) => setNewGunType(e.target.value)}
                  className="w-full h-10 px-3 border border-[#CCD5CD] rounded-lg bg-white text-[#121E1A] focus:outline-none"
                >
                  <option value="CCS2">CCS2 DC Combo (Standard)</option>
                  <option value="Type 2">Type 2 AC (Fast AC)</option>
                  <option value="NACS">NACS Tesla Standard</option>
                  <option value="GB/T">GB/T Standard</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#121E1A] mb-1">
                  Power Rating (kW)
                </label>
                <input
                  type="number"
                  value={newGunKw}
                  onChange={(e) => setNewGunKw(e.target.value)}
                  className="w-full h-10 px-3 border border-[#CCD5CD] rounded-lg bg-white text-[#121E1A] focus:outline-none font-bold"
                  placeholder="e.g. 120"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#121E1A] mb-1">
                  Base Tariff (₹ / kWh)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newGunTariff}
                  onChange={(e) => setNewGunTariff(e.target.value)}
                  className="w-full h-10 px-3 border border-[#CCD5CD] rounded-lg bg-white text-[#121E1A] focus:outline-none font-bold"
                  placeholder="e.g. 20.00"
                  required
                />
              </div>

              <div className="p-2.5 bg-[#E9F7F0] rounded-lg text-[#003525] text-[11px] leading-snug">
                The new gun will automatically be provisioned with OCPP 2.0.1 smart load balancing and Anti-Conflict Lock.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGunModal(false)}
                  className="flex-1 h-10 rounded-lg border border-[#CCD5CD] text-[#5B6862] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-lg bg-[#174D3A] text-[#C8F169] font-bold"
                >
                  Register Gun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Drawer Modal */}
      {showNotificationDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-[440px] bg-white rounded-2xl border border-[#CCD5CD] shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-[#E1E7E2]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003525]">notifications</span>
                <h3 className="font-bold text-sm text-[#121E1A]">Charger Requests & Alerts</h3>
              </div>
              <button
                onClick={() => setShowNotificationDrawer(false)}
                className="w-7 h-7 rounded-lg bg-[#EDF1ED] flex items-center justify-center text-[#5B6862]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {bookingRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#5B6862]">
                <span className="material-symbols-outlined text-3xl text-[#CCD5CD] mb-1">
                  notifications_none
                </span>
                <p>No new driver charger requests at this time.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E3F1EA] space-y-2 text-xs">
                {bookingRequests.map((req) => (
                  <div key={req.id} className="pt-2.5 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#003525]">{req.driverName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === "pending"
                            ? "bg-[#FFF6E9] text-[#A96712] border border-[#F2D7B2]"
                            : req.status === "accepted"
                            ? "bg-[#EDF7F0] text-[#237A4B] border border-[#C6E7D2]"
                            : "bg-[#FFF0F0] text-[#BA1A1A] border border-[#F8CDCD]"
                        }`}
                      >
                        {req.status === "pending"
                          ? "Pending Approval"
                          : req.status === "accepted"
                          ? "Bay Locked & Active"
                          : "Declined"}
                      </span>
                    </div>

                    <p className="text-[#5B6862]">
                      {req.bayId} ({req.connector} · {req.kw} kW) · {req.vehicle}
                    </p>
                    <p className="text-[10px] text-[#707974]">{req.timestamp}</p>

                    {req.status === "pending" && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            if (onAcceptRequest) onAcceptRequest(req.id);
                            setShowNotificationDrawer(false);
                          }}
                          className="px-3 py-1.5 bg-[#174D3A] text-[#C8F169] rounded-lg font-bold text-xs shadow-xs"
                        >
                          Accept & Lock Bay
                        </button>
                        <button
                          onClick={() => {
                            if (onDeclineRequest) onDeclineRequest(req.id);
                          }}
                          className="px-3 py-1.5 bg-white border border-[#CCD5CD] text-[#BA1A1A] rounded-lg font-semibold text-xs"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
