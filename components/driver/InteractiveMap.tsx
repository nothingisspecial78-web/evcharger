"use client";

import React, { useState } from "react";

export interface StationData {
  id: string;
  name: string;
  location: string;
  distance: string;
  status: "available" | "in-use" | "busy" | "offline";
  maxKw: number;
  type: string;
  tariff: number;
  baysOpen: number;
  totalBays: number;
  rating: number;
  connectors: string[];
  x: number; // percentage on map
  y: number; // percentage on map
}

interface InteractiveMapProps {
  stations: StationData[];
  selectedStationId: string | null;
  onSelectStation: (id: string) => void;
  onStartCharge: (station: StationData) => void;
}

export default function InteractiveMap({
  stations,
  selectedStationId,
  onSelectStation,
  onStartCharge,
}: InteractiveMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const selectedStation = stations.find((s) => s.id === selectedStationId);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] bg-[#E3EBE6] rounded-2xl overflow-hidden border border-[#CCD5CD] shadow-inner select-none">
      {/* SVG Vector City Map Background */}
      <svg
        className="w-full h-full transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* City Waterway / Shoreline */}
        <path
          d="M0 0 L180 0 C160 120, 210 240, 150 360 C110 440, 160 520, 140 600 L0 600 Z"
          fill="#D0E4DC"
          opacity="0.8"
        />

        {/* City Green Parks */}
        <rect x="260" y="80" width="130" height="90" rx="16" fill="#D7EADF" />
        <rect x="520" y="320" width="160" height="120" rx="20" fill="#D7EADF" />
        <circle cx="680" cy="140" r="60" fill="#D7EADF" />

        {/* Arterial Highways & Ring Roads */}
        <path
          d="M150 180 C 300 200, 500 150, 780 220"
          stroke="#FFFFFF"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M150 180 C 300 200, 500 150, 780 220"
          stroke="#C8D6CE"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* North-South Ring Expressway */}
        <path
          d="M420 20 C 430 180, 380 400, 480 580"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M420 20 C 430 180, 380 400, 480 580"
          stroke="#C8D6CE"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Secondary Grid Streets */}
        <path
          d="M200 320 H750 M220 440 H700 M320 80 V550 M600 80 V550 M240 240 L720 240 M480 120 L740 400"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M200 320 H750 M220 440 H700 M320 80 V550 M600 80 V550 M240 240 L720 240 M480 120 L740 400"
          stroke="#DDE6E0"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Neighborhood & Landmark Labels */}
        <text x="280" y="130" fill="#707974" fontSize="13" fontWeight="600" fontFamily="Inter">
          Cyberpark District
        </text>
        <text x="540" y="380" fill="#707974" fontSize="13" fontWeight="600" fontFamily="Inter">
          Focus Mall Tech Hub
        </text>
        <text x="35" y="300" fill="#526D00" fontSize="12" fontWeight="700" fontFamily="Inter" opacity="0.7">
          Arabian Coastline
        </text>
        <text x="440" y="270" fill="#707974" fontSize="12" fontWeight="600" fontFamily="Inter">
          Beach Rd Junction
        </text>
      </svg>

      {/* GPS Current User Marker Pin */}
      <div
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: "38%", top: "45%" }}
      >
        <div className="relative flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-[#174D3A]/20 animate-ping absolute"></div>
          <div className="w-5 h-5 rounded-full bg-[#174D3A] border-2 border-white shadow-md flex items-center justify-center text-white">
            <span className="w-2 h-2 rounded-full bg-[#C8F169]"></span>
          </div>
        </div>
        <div className="bg-[#174D3A] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm mt-1 text-center whitespace-nowrap">
          Your EV
        </div>
      </div>

      {/* Station Map Pins */}
      {stations.map((st) => {
        const isSelected = st.id === selectedStationId;
        const isAvailable = st.status === "available";

        return (
          <div
            key={st.id}
            onClick={() => onSelectStation(st.id)}
            style={{ left: `${st.x}%`, top: `${st.y}%` }}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group ${
              isSelected ? "scale-110 z-30" : "hover:scale-105"
            }`}
          >
            {/* Pulsing Beacon for Available */}
            {isAvailable && (
              <span className="absolute -inset-1 rounded-full bg-[#237A4B]/30 animate-pulse"></span>
            )}

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shadow-md font-bold text-xs transition-all ${
                isSelected
                  ? "bg-[#003525] text-white border-[#C8F169] ring-2 ring-[#C8F169]/40"
                  : isAvailable
                  ? "bg-[#FFFFFF] text-[#003525] border-[#237A4B]"
                  : "bg-[#FFFFFF] text-[#A96712] border-[#F2D7B2]"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[15px] ${
                  isSelected ? "text-[#C8F169] fill-icon" : isAvailable ? "text-[#237A4B]" : "text-[#A96712]"
                }`}
              >
                ev_station
              </span>
              <span className="tabular-nums font-semibold">{st.maxKw} kW</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isAvailable ? "bg-[#237A4B]" : "bg-[#A96712]"
                }`}
              ></span>
            </div>
          </div>
        );
      })}

      {/* Selected Station Bottom Floating Preview Card */}
      {selectedStation && (
        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-[#CCD5CD] shadow-lg z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#121E1A] truncate">{selectedStation.name}</h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedStation.status === "available"
                    ? "bg-[#EDF7F0] text-[#237A4B] border border-[#C6E7D2]"
                    : "bg-[#FFF6E9] text-[#A96712] border border-[#F2D7B2]"
                }`}
              >
                {selectedStation.status === "available" ? "Available" : "In Use"}
              </span>
            </div>
            <p className="text-xs text-[#5B6862] mt-0.5 flex items-center gap-2">
              <span>{selectedStation.location}</span>
              <span>•</span>
              <span className="font-semibold text-[#174D3A]">{selectedStation.distance}</span>
              <span>•</span>
              <span className="text-[#237A4B] font-semibold">
                {selectedStation.baysOpen}/{selectedStation.totalBays} Bays Open
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onStartCharge(selectedStation)}
              className="flex-1 sm:flex-initial h-9 px-3.5 bg-[#174D3A] hover:bg-[#1E5E47] text-[#C8F169] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 active:scale-[0.985] shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Start Charge</span>
            </button>
            <button
              onClick={() =>
                alert(`Routing initiated to ${selectedStation.name} (${selectedStation.distance})`)
              }
              className="w-9 h-9 rounded-lg bg-[#E9F7F0] border border-[#CCD5CD] text-[#174D3A] flex items-center justify-center hover:bg-[#DDEBE5] active:scale-[0.985] transition-colors"
              title="Navigate with GPS"
            >
              <span className="material-symbols-outlined text-[18px]">directions</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Map Controls (Zoom & Recenter) */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5">
        <button
          onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8))}
          className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm border border-[#CCD5CD] text-[#174D3A] font-bold flex items-center justify-center hover:bg-white active:scale-95 shadow-sm"
          title="Zoom In"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
        <button
          onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8))}
          className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm border border-[#CCD5CD] text-[#174D3A] font-bold flex items-center justify-center hover:bg-white active:scale-95 shadow-sm"
          title="Zoom Out"
        >
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm border border-[#CCD5CD] text-[#174D3A] flex items-center justify-center hover:bg-white active:scale-95 shadow-sm"
          title="Recenter"
        >
          <span className="material-symbols-outlined text-[18px]">my_location</span>
        </button>
      </div>
    </div>
  );
}
