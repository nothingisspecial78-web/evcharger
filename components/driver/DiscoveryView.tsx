"use client";

import React, { useState } from "react";
import InteractiveMap, { StationData } from "./InteractiveMap";

import { UserSession } from "./DriverAuthModal";

interface DiscoveryViewProps {
  onStartCharge: (stationName: string, maxKw: number) => void;
  onNavigateTab: (tab: "map" | "charge" | "activity" | "profile") => void;
  isAuthenticated?: boolean;
  onRequestAuth?: (reason: string) => void;
  onRequestBooking?: (details: {
    stationName: string;
    bayId: string;
    connector: string;
    kw: number;
  }) => void;
  currentUser?: UserSession | null;
}

const INITIAL_STATIONS: StationData[] = [
  {
    id: "st-1",
    name: "GreenPulse Supercharger Hub",
    location: "Cyberpark South Gate",
    distance: "1.4 km",
    status: "available",
    maxKw: 120,
    type: "Ultra DC",
    tariff: 16,
    baysOpen: 3,
    totalBays: 4,
    rating: 4.9,
    connectors: ["CCS2", "Type 2"],
    x: 48,
    y: 35,
  },
  {
    id: "st-2",
    name: "VoltCentral Express Station",
    location: "Beach Road Parking Bay",
    distance: "2.8 km",
    status: "in-use",
    maxKw: 60,
    type: "Fast DC",
    tariff: 14,
    baysOpen: 0,
    totalBays: 2,
    rating: 4.7,
    connectors: ["CCS2"],
    x: 28,
    y: 50,
  },
  {
    id: "st-3",
    name: "EcoCharge Mall Hypercharger",
    location: "Focus Mall Level B2",
    distance: "3.5 km",
    status: "available",
    maxKw: 50,
    type: "Standard DC",
    tariff: 15,
    baysOpen: 2,
    totalBays: 2,
    rating: 4.6,
    connectors: ["Type 2", "GB/T"],
    x: 68,
    y: 65,
  },
  {
    id: "st-4",
    name: "VoltSpot Highway Plaza",
    location: "NH 66 Bypass Mile 42",
    distance: "6.2 km",
    status: "available",
    maxKw: 180,
    type: "Ultra DC",
    tariff: 18,
    baysOpen: 4,
    totalBays: 6,
    rating: 4.8,
    connectors: ["CCS2", "NACS"],
    x: 75,
    y: 25,
  },
];

export default function DiscoveryView({
  onStartCharge,
  onNavigateTab,
  isAuthenticated = false,
  onRequestAuth,
  onRequestBooking,
  currentUser,
}: DiscoveryViewProps) {
  const [searchQuery, setSearchQuery] = useState("Cyberpark & Calicut City");
  const [filterConnector, setFilterConnector] = useState(true);
  const [filterPower, setFilterPower] = useState(false);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedStationId, setSelectedStationId] = useState<string | null>("st-1");
  const [detailModalStation, setDetailModalStation] = useState<StationData | null>(null);
  const [requestSentToast, setRequestSentToast] = useState<string | null>(null);

  // Filtered stations
  const filteredStations = INITIAL_STATIONS.filter((s) => {
    if (filterAvailable && s.status !== "available") return false;
    if (filterPower && s.maxKw < 60) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.connectors.some((c) => c.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleChargeClick = (name: string, kw: number) => {
    if (!isAuthenticated) {
      if (onRequestAuth) {
        onRequestAuth("Please register or sign in with your WhatsApp number to start charging sessions.");
      }
      return;
    }
    if (onRequestBooking) {
      onRequestBooking({
        stationName: name,
        bayId: "Bay 02 - CCS2",
        connector: "CCS2 · Fast DC",
        kw,
      });
    }
    setRequestSentToast(`Request submitted to Station Host Admin for ${name}.`);
    setTimeout(() => setRequestSentToast(null), 4000);
    onStartCharge(name, kw);
  };

  const handleApplyRequestToHost = (station: StationData) => {
    if (!isAuthenticated) {
      if (onRequestAuth) {
        onRequestAuth("Please register or sign in with your WhatsApp number to request a charger bay.");
      }
      return;
    }
    if (onRequestBooking) {
      onRequestBooking({
        stationName: station.name,
        bayId: "Bay 02 - CCS2",
        connector: station.connectors[0] || "CCS2",
        kw: station.maxKw,
      });
    }
    setRequestSentToast(`🚨 Charger request sent to Station Host Admin for ${station.name}! Awaiting Host bay lock.`);
    setTimeout(() => setRequestSentToast(null), 4500);
    setDetailModalStation(null);
  };

  return (
    <div className="w-full flex flex-col pb-28 relative">
      {/* Toast Notification when Request is Sent to Admin */}
      {requestSentToast && (
        <div className="fixed top-14 left-4 right-4 max-w-[420px] mx-auto z-50 bg-[#174D3A] text-white p-3 rounded-xl shadow-xl border border-[#C8F169] text-xs flex items-center gap-2 animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[#C8F169] text-lg shrink-0">check_circle</span>
          <span className="font-medium">{requestSentToast}</span>
        </div>
      )}
      {/* Top Header & Search Area */}
      <header className="sticky top-0 z-40 bg-[#EFFDF6]/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-[#C0C9C2]/40 shadow-sm">
        {/* Brand & Context */}
        <div className="flex items-center justify-between h-11">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#174D3A] text-[#C8F169] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px] fill-icon">electric_bolt</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base font-bold text-[#003525] tracking-tight">VoltSpot</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#C8F169] text-[#526D00] tracking-wider">
                  LIVE
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#404944] mt-0.5">
                <span className="material-symbols-outlined text-[13px] text-[#003525]">near_me</span>
                <span className="truncate max-w-[170px]">Kozhikode, KL · Within 10 km</span>
              </div>
            </div>
          </div>

          {/* Action / Profile Targets */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => alert("Notifications: 2 new fast chargers available in Cyberpark!")}
              aria-label="Notifications"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-[#404944] hover:bg-[#E3F1EA] active:scale-[0.985] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button
              onClick={() => onNavigateTab("profile")}
              aria-label="Profile account"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#E3F1EA] border border-[#C0C9C2]/60 active:scale-[0.985] transition-transform overflow-hidden"
            >
              <span className="material-symbols-outlined text-[#003525] text-[22px]">person</span>
            </button>
          </div>
        </div>

        {/* Unauthenticated User Warning / Gating Notice */}
        {!isAuthenticated && (
          <div className="mt-2.5 px-3 py-2 bg-[#FFF6E9] border border-[#F2D7B2] rounded-xl flex items-center justify-between text-xs text-[#A96712]">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-base">lock</span>
              <span>Preview Mode: Register or Sign In to charge & book.</span>
            </div>
            <button
              onClick={() => onRequestAuth && onRequestAuth("Sign in with WhatsApp to start charging and view telemetry.")}
              className="px-2 py-1 bg-[#174D3A] text-[#C8F169] font-bold rounded-lg text-[11px] shadow-xs hover:brightness-105"
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* Search & Location Input */}
        <div className="mt-3 flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#404944]">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stations, hubs, networks..."
              className="w-full h-11 pl-9 pr-9 bg-[#FFFFFF] text-[#121E1A] text-sm rounded-xl border border-[#C0C9C2]/70 focus:outline-none focus:border-[#003525] focus:ring-1 focus:ring-[#003525] placeholder:text-[#404944]/70 transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#404944] hover:text-[#121E1A]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* GPS Quick Recenter */}
          <button
            onClick={() => {
              setSearchQuery("Cyberpark & Calicut City");
              alert("Location pinned: GPS coordinates accurate within 4m.");
            }}
            aria-label="Re-center on current GPS location"
            className="w-11 h-11 shrink-0 flex items-center justify-center bg-[#FFFFFF] border border-[#C0C9C2]/70 text-[#003525] rounded-xl hover:bg-[#E3F1EA] active:scale-[0.985] transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">my_location</span>
          </button>
        </div>

        {/* Filter Strip */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setFilterConnector(!filterConnector)}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold shrink-0 border transition-all active:scale-[0.985] ${
              filterConnector
                ? "bg-[#174D3A] text-white border-[#174D3A] shadow-xs"
                : "bg-white text-[#121E1A] border-[#C0C9C2]/80 hover:bg-[#E9F7F0]"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">power</span>
            <span>CCS2, Type 2</span>
            {filterConnector && <span className="w-1.5 h-1.5 rounded-full bg-[#C8F169]"></span>}
          </button>

          <button
            onClick={() => setFilterPower(!filterPower)}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold shrink-0 border transition-all active:scale-[0.985] ${
              filterPower
                ? "bg-[#174D3A] text-white border-[#174D3A] shadow-xs"
                : "bg-white text-[#121E1A] border-[#C0C9C2]/80 hover:bg-[#E9F7F0]"
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#003525]">bolt</span>
            <span>60kW+</span>
            {filterPower && <span className="w-1.5 h-1.5 rounded-full bg-[#C8F169]"></span>}
          </button>

          <button
            onClick={() => setFilterAvailable(!filterAvailable)}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold shrink-0 border transition-all active:scale-[0.985] ${
              filterAvailable
                ? "bg-[#174D3A] text-white border-[#174D3A] shadow-xs"
                : "bg-white text-[#121E1A] border-[#C0C9C2]/80 hover:bg-[#E9F7F0]"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#004F2B]"></span>
            <span>Available now</span>
            {filterAvailable && <span className="w-1.5 h-1.5 rounded-full bg-[#C8F169]"></span>}
          </button>

          {(filterPower || filterAvailable) && (
            <button
              onClick={() => {
                setFilterPower(false);
                setFilterAvailable(false);
                setSearchQuery("");
              }}
              className="text-xs text-[#404944] hover:text-[#003525] px-2 shrink-0 underline decoration-[#C0C9C2] underline-offset-2"
            >
              Clear all
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 pt-3 flex-1 flex flex-col space-y-3.5">
        {/* Meta & View Segment Header */}
        <div className="flex items-center justify-between pt-1 pb-0.5">
          <div>
            <p className="text-sm font-bold text-[#121E1A]">
              {filteredStations.length} chargers nearby
            </p>
            <p className="text-xs text-[#404944]">Sorted by real-time distance</p>
          </div>

          {/* List / Map Segment Toggle */}
          <div className="flex items-center p-0.5 bg-[#E3F1EA] border border-[#C0C9C2]/60 rounded-xl" role="tablist">
            <button
              onClick={() => setViewMode("list")}
              className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "list"
                  ? "bg-white text-[#003525] shadow-xs"
                  : "text-[#404944] hover:text-[#121E1A]"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_list</span>
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "map"
                  ? "bg-white text-[#003525] shadow-xs"
                  : "text-[#404944] hover:text-[#121E1A]"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* View Mode: Map View */}
        {viewMode === "map" ? (
          <div className="space-y-3">
            <InteractiveMap
              stations={filteredStations}
              selectedStationId={selectedStationId}
              onSelectStation={(id) => setSelectedStationId(id)}
              onStartCharge={(station) => handleChargeClick(station.name, station.maxKw)}
            />
          </div>
        ) : (
          /* View Mode: List of Charger Cards */
          <div className="space-y-3.5">
            {filteredStations.map((station) => (
              <article
                key={station.id}
                className="bg-white rounded-2xl border border-[#C0C9C2]/60 p-4 shadow-sm hover:border-[#707974] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-[#121E1A] tracking-tight truncate">
                        {station.name}
                      </h2>
                      <p className="text-xs text-[#404944] mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                        <span>
                          {station.location} · {station.distance}
                        </span>
                      </p>
                    </div>

                    {/* Status Badge */}
                    {station.status === "available" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#EDF7F0] border border-[#C6E7D2] text-[#237A4B] shrink-0 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#237A4B]"></span>
                        <span className="material-symbols-outlined text-[13px] -ml-0.5">check</span>
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#FFF6E9] border border-[#F2D7B2] text-[#A96712] shrink-0 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A96712]"></span>
                        <span className="material-symbols-outlined text-[13px] -ml-0.5">schedule</span>
                        In Use
                      </span>
                    )}
                  </div>

                  {/* Tabular Telemetry Metrics Well */}
                  <div className="mt-3.5 p-3 rounded-xl bg-[#E3F1EA] border border-[#C0C9C2]/40 grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-xs text-[#404944] block">Max Output</span>
                      <span className="text-base font-bold text-[#003525] tracking-tight tabular-nums">
                        {station.maxKw} kW
                      </span>
                      <span className="text-[11px] text-[#404944] block uppercase font-medium">
                        {station.type}
                      </span>
                    </div>

                    <div className="border-l border-[#C0C9C2]/50 pl-3">
                      <span className="text-xs text-[#404944] block">Tariff</span>
                      <span className="text-base font-bold text-[#121E1A] tracking-tight tabular-nums">
                        ₹{station.tariff}
                        <span className="text-xs font-normal text-[#404944]">/kWh</span>
                      </span>
                      <span className="text-[11px] text-[#404944] block font-medium">No idle fee</span>
                    </div>

                    <div className="border-l border-[#C0C9C2]/50 pl-3">
                      <span className="text-xs text-[#404944] block">Bays</span>
                      <span className="text-base font-bold text-[#004F2B] tracking-tight tabular-nums">
                        {station.baysOpen}
                        <span className="text-xs font-normal text-[#404944]">
                          /{station.totalBays} open
                        </span>
                      </span>
                      <span
                        className={`text-[11px] block font-medium ${
                          station.baysOpen > 0 ? "text-[#237A4B]" : "text-[#A96712]"
                        }`}
                      >
                        {station.baysOpen > 0 ? "Ready now" : "~12 min wait"}
                      </span>
                    </div>
                  </div>

                  {/* Connectors Row */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {station.connectors.map((conn) => (
                        <span
                          key={conn}
                          className="px-2 py-0.5 bg-[#DDEBE5] rounded-md text-[11px] font-mono font-semibold tracking-wide text-[#003525] border border-[#C0C9C2]/50"
                        >
                          {conn}
                        </span>
                      ))}
                      <span className="text-xs text-[#404944] ml-1">· Autocharge ready</span>
                    </div>

                    <div className="flex items-center text-xs text-[#404944]">
                      <span className="material-symbols-outlined text-[15px] text-[#003525] fill-icon">
                        star
                      </span>
                      <span className="font-semibold text-[#121E1A] ml-0.5">{station.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-4 pt-3 border-t border-[#C0C9C2]/40 flex items-center gap-2">
                  <button
                    onClick={() => setDetailModalStation(station)}
                    className="flex-1 h-11 bg-[#174D3A] hover:bg-[#1E5E47] active:scale-[0.985] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>View details</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        if (onRequestAuth) {
                          onRequestAuth("Please sign in or register to get GPS directions & reservations.");
                        }
                        return;
                      }
                      alert(`Opening navigation instructions to ${station.name} (${station.location})`);
                    }}
                    aria-label="Route to station"
                    className="w-11 h-11 rounded-xl bg-[#E3F1EA] border border-[#C0C9C2]/60 flex items-center justify-center text-[#003525] hover:bg-[#DDEBE5] active:scale-[0.985] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">directions</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Network Reliability Indicator Banner */}
        <div className="p-3.5 rounded-xl bg-[#E3F1EA] border border-[#C0C9C2]/40 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#003525] shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-[#121E1A]">100% Verified Telemetry</h4>
            <p className="text-xs text-[#404944]">
              OCPP 2.0.1 live status synchronized 18 seconds ago.
            </p>
          </div>
        </div>
      </main>

      {/* Floating Map View Toggle Pill (when in list mode) */}
      {viewMode === "list" && (
        <div className="fixed bottom-20 left-0 right-0 max-w-[420px] mx-auto flex justify-center pointer-events-none z-30 px-4">
          <button
            onClick={() => setViewMode("map")}
            className="pointer-events-auto shadow-lg hover:shadow-xl active:scale-[0.985] transition-all bg-[#174D3A] text-white px-4 py-2.5 rounded-full flex items-center gap-2 border border-[#003525] text-xs font-semibold min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[19px] text-[#C8F169]">explore</span>
            <span>View Map</span>
            <span className="px-1.5 py-0.2 bg-[#C8F169]/20 text-[#C8F169] text-[11px] rounded-full font-mono">
              {filteredStations.length}
            </span>
          </button>
        </div>
      )}

      {/* Station Details & Charging Setup Modal */}
      {detailModalStation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-[460px] bg-white rounded-t-2xl sm:rounded-2xl border border-[#CCD5CD] shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#003525] px-2 py-0.5 rounded-full bg-[#E9F7F0] border border-[#C6E7D2]">
                  {detailModalStation.type} · {detailModalStation.maxKw} kW
                </span>
                <h3 className="text-lg font-bold text-[#121E1A] mt-1">
                  {detailModalStation.name}
                </h3>
                <p className="text-xs text-[#5B6862]">
                  {detailModalStation.location} · {detailModalStation.distance}
                </p>
              </div>
              <button
                onClick={() => setDetailModalStation(null)}
                className="w-8 h-8 rounded-lg bg-[#EDF1ED] flex items-center justify-center text-[#5B6862] hover:text-[#121E1A]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Bays Overview */}
            <div className="p-3 rounded-xl bg-[#F5F7F4] border border-[#E1E7E2] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#121E1A]">Bay Connectors Status</span>
                <span className="text-[#237A4B] font-bold">
                  {detailModalStation.baysOpen} of {detailModalStation.totalBays} Available
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded-lg border border-[#CCD5CD]">
                  <div className="font-bold text-[#003525]">Bay 01 · CCS2</div>
                  <div className="text-[11px] text-[#237A4B] flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#237A4B]"></span> Ready (180 kW)
                  </div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-[#CCD5CD]">
                  <div className="font-bold text-[#003525]">Bay 02 · CCS2</div>
                  <div className="text-[11px] text-[#237A4B] flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#237A4B]"></span> Ready (120 kW)
                  </div>
                </div>
              </div>
            </div>

            {/* Tariff Breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E1E7E2]">
                <span className="text-[#5B6862]">Energy Rate</span>
                <span className="font-bold text-[#121E1A]">₹{detailModalStation.tariff}.00 / kWh</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E1E7E2]">
                <span className="text-[#5B6862]">Idle Fee Grace Period</span>
                <span className="font-medium text-[#121E1A]">10 minutes post-charge</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#5B6862]">AutoPay / AutoCharge</span>
                <span className="text-[#237A4B] font-bold">Supported (Plug & Charge)</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => handleApplyRequestToHost(detailModalStation)}
                className="w-full sm:flex-1 h-11 bg-[#E3F1EA] hover:bg-[#D4E8DD] text-[#003525] rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#C0C9C2] active:scale-[0.985] transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-[#003525]">notification_important</span>
                <span>Request Bay & Notify Admin</span>
              </button>

              <button
                onClick={() => {
                  const name = detailModalStation.name;
                  const kw = detailModalStation.maxKw;
                  setDetailModalStation(null);
                  handleChargeClick(name, kw);
                }}
                className="w-full sm:flex-1 h-11 bg-[#174D3A] hover:bg-[#1E5E47] text-[#C8F169] rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.985] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Plug In & Start Charging</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
