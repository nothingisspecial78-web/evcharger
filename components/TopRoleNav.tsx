"use client";

import React from "react";
import { UserSession } from "./driver/DriverAuthModal";

export type PortalRole = "driver" | "host" | "superadmin";

interface TopRoleNavProps {
  currentRole: PortalRole;
  onRoleChange: (role: PortalRole) => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  onOpenAuthModal: () => void;
  currentUser: UserSession | null;
  onSignOut: () => void;
  activeDriverCount?: number;
}

export default function TopRoleNav({
  currentRole,
  onRoleChange,
  isFrameMode,
  onToggleFrameMode,
  onOpenAuthModal,
  currentUser,
  onSignOut,
  activeDriverCount = 18420,
}: TopRoleNavProps) {
  const isSuperAdmin = currentUser?.role === "superadmin";
  const isHost = currentUser?.role === "host";
  const canSeeHost = isHost || isSuperAdmin;

  return (
    <div className="w-full bg-[#003525] text-white border-b border-[#174D3A] sticky top-0 z-50 px-3 py-2 text-xs select-none shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Brand & Network Live Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-bold tracking-tight text-sm text-[#C8F169]">
            <span className="material-symbols-outlined text-[18px] fill-icon">electric_bolt</span>
            <span>VoltSpot Mobility</span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#174D3A] text-[#C8F169] border border-[#346853]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8F169] animate-pulse"></span>
            OCPP 2.0.1 Live
          </span>

          <span className="hidden md:inline-flex text-[11px] text-[#87bda4]">
            {activeDriverCount.toLocaleString()} Active EVs Online
          </span>
        </div>

        {/* Role-based Portal Switcher:
            - Regular User: ONLY sees Driver App
            - Admin (Host): Sees Driver App and Host Admin (can switch between them)
            - Super Admin: Sees Driver App, Host Admin, and Super Admin */}
        <div className="flex items-center bg-[#0B251B] p-0.5 rounded-lg border border-[#174D3A]">
          <button
            onClick={() => onRoleChange("driver")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
              currentRole === "driver"
                ? "bg-[#C8F169] text-[#003525] font-semibold shadow-sm"
                : "text-[#87bda4] hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">directions_car</span>
            <span>Driver App</span>
          </button>

          {canSeeHost && (
            <button
              onClick={() => onRoleChange("host")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                currentRole === "host"
                  ? "bg-[#C8F169] text-[#003525] font-semibold shadow-sm"
                  : "text-[#87bda4] hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">ev_station</span>
              <span>Host Admin</span>
            </button>
          )}

          {isSuperAdmin && (
            <button
              onClick={() => onRoleChange("superadmin")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                currentRole === "superadmin"
                  ? "bg-[#C8F169] text-[#003525] font-semibold shadow-sm"
                  : "text-[#C8F169] hover:text-white font-bold"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">analytics</span>
              <span>Super Admin 👑</span>
            </button>
          )}
        </div>

        {/* Viewport Toggle & User Authentication State */}
        <div className="flex items-center space-x-2">
          {/* Mobile frame vs Full desktop toggle */}
          <button
            onClick={onToggleFrameMode}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] transition-colors ${
              isFrameMode
                ? "bg-[#174D3A] border-[#C8F169] text-[#C8F169]"
                : "border-[#174D3A] text-[#87bda4] hover:text-white hover:border-[#346853]"
            }`}
            title="Toggle between mobile device frame simulation and fluid responsive view"
          >
            <span className="material-symbols-outlined text-[14px]">
              {isFrameMode ? "stay_current_portrait" : "desktop_windows"}
            </span>
            <span>{isFrameMode ? "Mobile Frame" : "Fluid Screen"}</span>
          </button>

          {currentUser ? (
            /* Logged In State */
            <div className="flex items-center gap-2 bg-[#174D3A] pl-2.5 pr-1 py-1 rounded-lg border border-[#346853]">
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-[#C8F169]"></span>
                <span className="font-bold text-white max-w-[120px] truncate">
                  {currentUser.name}
                </span>
                {isSuperAdmin && (
                  <span className="bg-[#C8F169] text-[#003525] text-[9px] px-1 py-0.2 rounded font-black">
                    ROOT
                  </span>
                )}
              </div>
              <button
                onClick={onSignOut}
                className="text-[11px] text-[#C0C9C2] hover:text-white px-2 py-0.5 rounded hover:bg-[#1E5E47] transition-colors"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            /* Unauthenticated / Guest state */
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#C8F169] hover:brightness-105 text-[#003525] font-bold text-xs shadow-sm active:scale-95 transition-all"
            >
              <span>💬</span>
              <span>Register / Sign In</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
