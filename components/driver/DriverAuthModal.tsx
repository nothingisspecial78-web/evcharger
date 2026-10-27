"use client";

import React, { useState } from "react";
import { syncUserToSupabase } from "@/lib/supabase";

export interface HostSubscription {
  status: "pending" | "active";
  plan?: "monthly" | "yearly" | "lifetime";
  grantedBy?: "payment" | "superadmin";
  validUntil?: string;
}

export interface UserSession {
  phone: string;
  name: string;
  role: "driver" | "host" | "superadmin";
  vehicle?: string;
  verifiedAt: string;
  hostSubscription?: HostSubscription;
}

interface DriverAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
  initialPrompt?: string;
  initialRole?: "driver" | "host";
}

export const SUPER_ADMIN_PHONE = "8089210741";

export function isSuperAdminNumber(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  return digits === SUPER_ADMIN_PHONE || digits.endsWith(SUPER_ADMIN_PHONE);
}

export default function DriverAuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  initialPrompt,
  initialRole = "driver",
}: DriverAuthModalProps) {
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [selectedRole, setSelectedRole] = useState<"driver" | "host">(initialRole);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("Tata Nexon EV Max");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);
  const [whatsappToast, setWhatsappToast] = useState<{
    phone: string;
    code: string;
    isSuperAdmin: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const handleSendWhatsAppOtp = () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (authMode === "register" && !name.trim()) {
      alert("Please enter your name to register.");
      return;
    }

    const isSuper = isSuperAdminNumber(cleanPhone);
    // Use fixed code 8089 for super admin or random 4-digit code for normal users
    const code = isSuper ? "8089" : String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpCode(["", "", "", ""]);

    // Trigger realistic WhatsApp message popup
    setWhatsappToast({
      phone: cleanPhone,
      code,
      isSuperAdmin: isSuper,
    });
  };

  const handleAutoFillOtp = () => {
    if (generatedOtp.length === 4) {
      setOtpCode(generatedOtp.split(""));
    }
  };

  const handleVerifyOtp = () => {
    const entered = otpCode.join("");
    if (entered.length < 4) {
      alert("Please enter the complete 4-digit WhatsApp OTP.");
      return;
    }

    if (entered !== generatedOtp) {
      alert(`Invalid OTP code entered. Expected: ${generatedOtp}`);
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const isSuper = isSuperAdminNumber(cleanPhone);

    const roleToAssign: "driver" | "host" | "superadmin" = isSuper
      ? "superadmin"
      : selectedRole;

    const session: UserSession = {
      phone: cleanPhone,
      name: isSuper
        ? "Super Admin (Root)"
        : name.trim() ||
          (roleToAssign === "host"
            ? "Station Host Admin"
            : authMode === "register"
            ? "New Driver"
            : "Verified Driver"),
      role: roleToAssign,
      vehicle: roleToAssign === "driver" ? vehicle || "Tata Nexon EV Max" : undefined,
      verifiedAt: new Date().toISOString(),
      hostSubscription:
        roleToAssign === "host"
          ? {
              status: "pending", // Must pay or receive approval from Super Admin
            }
          : undefined,
    };

    // Save to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("voltspot_session", JSON.stringify(session));
      } catch (e) {
        console.error("Failed to save session", e);
      }
    }

    // Save to Supabase backend asynchronously
    syncUserToSupabase(session).catch((err) =>
      console.warn("Supabase user sync error:", err)
    );

    onLoginSuccess(session);
    setWhatsappToast(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      {/* Live Simulated WhatsApp Incoming Message Toast */}
      {whatsappToast && (
        <div className="fixed top-4 left-4 right-4 max-w-[420px] mx-auto z-60 bg-[#128C7E] text-white p-3.5 rounded-2xl shadow-2xl border-2 border-[#25D366] animate-in slide-in-from-top-4 space-y-1.5 select-none">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-ping"></span>
              <span className="text-[14px]">💬</span>
              <span>WhatsApp Notification</span>
            </div>
            <span className="text-[10px] text-white/80">Just now</span>
          </div>

          <div className="text-xs bg-[#075E54] p-2.5 rounded-xl border border-white/20">
            <p className="font-semibold text-[#C8F169]">
              {whatsappToast.isSuperAdmin
                ? "👑 VoltSpot Root Security [Super Admin Authentication]"
                : "VoltSpot Mobility Verification"}
            </p>
            <p className="mt-1 text-white/95">
              Your WhatsApp OTP code is:{" "}
              <span className="text-base font-extrabold text-[#C8F169] tracking-wider font-mono">
                {whatsappToast.code}
              </span>
            </p>
            <p className="text-[10px] text-white/70 mt-0.5">
              Sent to +91 {whatsappToast.phone}. Valid for 10 minutes. Do not share with anyone.
            </p>
          </div>

          <div className="flex gap-2 pt-0.5">
            <button
              onClick={handleAutoFillOtp}
              className="flex-1 h-7 bg-[#25D366] text-[#075E54] font-bold text-xs rounded-lg hover:brightness-105 active:scale-95 transition-transform"
            >
              Auto-fill OTP ({whatsappToast.code})
            </button>
            <a
              href={`https://wa.me/91${whatsappToast.phone}?text=Your%20VoltSpot%20OTP%20is%20${whatsappToast.code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 h-7 bg-white/20 text-white text-[11px] font-semibold rounded-lg flex items-center justify-center hover:bg-white/30"
            >
              Open WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Main Modal Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-[#CCD5CD] shadow-2xl p-5 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E1E7E2]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#174D3A] text-[#C8F169] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px] fill-icon">electric_bolt</span>
            </div>
            <div>
              <span className="text-sm font-bold text-[#003525] block leading-tight">VoltSpot Access</span>
              <span className="text-[10px] text-[#404944]">WhatsApp OTP Authentication</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#EDF1ED] flex items-center justify-center text-[#5B6862] hover:bg-[#E3F1EA]"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Custom prompt if user tried to access a locked feature */}
        {initialPrompt && (
          <div className="p-2.5 rounded-xl bg-[#FFF6E9] border border-[#F2D7B2] text-xs text-[#A96712] flex items-start gap-2">
            <span className="material-symbols-outlined text-base shrink-0 mt-0.5">lock</span>
            <div className="font-medium leading-snug">{initialPrompt}</div>
          </div>
        )}

        {/* Intro Banner */}
        <div>
          <h2 className="text-lg font-bold text-[#121E1A]">
            {authMode === "register" ? "Create Your Account" : "Sign In to VoltSpot"}
          </h2>
          <p className="text-xs text-[#5B6862] mt-0.5">
            Verification OTP will be securely sent directly to your WhatsApp.
          </p>
        </div>

        {/* Tab Switcher: Register vs Sign In (Host SSO removed) */}
        <div className="grid grid-cols-2 p-1 bg-[#E3F1EA] rounded-xl text-center text-xs font-semibold">
          <button
            onClick={() => {
              setAuthMode("register");
              setOtpSent(false);
            }}
            className={`py-1.5 rounded-lg transition-all ${
              authMode === "register" ? "bg-white text-[#003525] shadow-xs" : "text-[#5B6862]"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => {
              setAuthMode("login");
              setOtpSent(false);
            }}
            className={`py-1.5 rounded-lg transition-all ${
              authMode === "login" ? "bg-white text-[#003525] shadow-xs" : "text-[#5B6862]"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Account Role Selection */}
        {!otpSent && (
          <div>
            <label className="block text-[11px] font-semibold text-[#404944] mb-1.5">
              Select Account Type:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole("driver")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedRole === "driver"
                    ? "border-[#174D3A] bg-[#E9F7F0] ring-1 ring-[#174D3A]"
                    : "border-[#CCD5CD] bg-white hover:bg-[#F5F7F4]"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#003525]">
                  <span className="material-symbols-outlined text-[18px]">directions_car</span>
                  <span>EV Driver</span>
                </div>
                <p className="text-[10px] text-[#5B6862] mt-0.5 leading-tight">
                  Charge, navigate & pay
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("host")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedRole === "host"
                    ? "border-[#174D3A] bg-[#E9F7F0] ring-1 ring-[#174D3A]"
                    : "border-[#CCD5CD] bg-white hover:bg-[#F5F7F4]"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#003525]">
                  <span className="material-symbols-outlined text-[18px]">ev_station</span>
                  <span>Station Host / Admin</span>
                </div>
                <p className="text-[10px] text-[#5B6862] mt-0.5 leading-tight">
                  Manage chargers & earn
                </p>
              </button>
            </div>
          </div>
        )}

        {/* REGISTRATION FLOW */}
        {authMode === "register" && !otpSent && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#121E1A] mb-1">
                Full Name <span className="text-[#BA1A1A]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedRole === "host" ? "e.g. Suresh Kumar (Host)" : "e.g. Aarav Sharma"}
                className="w-full h-11 px-3 rounded-xl border border-[#CCD5CD] focus:border-[#003525] text-xs text-[#121E1A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#121E1A] mb-1">
                WhatsApp Mobile Number <span className="text-[#BA1A1A]">*</span>
              </label>
              <div className="flex items-center rounded-xl border border-[#CCD5CD] focus-within:border-[#003525] bg-white h-11 px-2.5 transition-all">
                <div className="flex items-center pr-2 border-r border-[#CCD5CD] mr-2 text-xs font-semibold text-[#003525] shrink-0">
                  <span className="mr-1">🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full bg-transparent border-none text-xs text-[#121E1A] focus:outline-none font-medium"
                />
              </div>
            </div>

            {selectedRole === "driver" ? (
              <div>
                <label className="block text-xs font-semibold text-[#121E1A] mb-1">
                  Primary EV Vehicle (Optional)
                </label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="e.g. Tata Nexon EV Max, MG ZS EV"
                  className="w-full h-11 px-3 rounded-xl border border-[#CCD5CD] focus:border-[#003525] text-xs text-[#121E1A] focus:outline-none"
                />
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-[#E9F7F0] border border-[#C6E7D2] text-[11px] text-[#003525] flex items-start gap-2">
                <span className="material-symbols-outlined text-base shrink-0 mt-0.5">verified</span>
                <div>
                  <strong>Station Host Activation:</strong> Once verified, you will be directed to configure your station subscription and tariffs.
                </div>
              </div>
            )}

            <button
              onClick={handleSendWhatsAppOtp}
              className="w-full h-11 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.985] shadow-sm transition-all"
            >
              <span>💬</span>
              <span>Send OTP via WhatsApp</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        )}

        {/* SIGN IN FLOW */}
        {authMode === "login" && !otpSent && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#121E1A] mb-1">
                Registered WhatsApp Mobile Number
              </label>
              <div className="flex items-center rounded-xl border border-[#CCD5CD] focus-within:border-[#003525] bg-white h-11 px-2.5 transition-all">
                <div className="flex items-center pr-2 border-r border-[#CCD5CD] mr-2 text-xs font-semibold text-[#003525] shrink-0">
                  <span className="mr-1">🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit phone number"
                  className="w-full bg-transparent border-none text-xs text-[#121E1A] focus:outline-none font-medium"
                />
              </div>
              <p className="text-[10px] text-[#5B6862] mt-1">
                Instant one-time security passcode will be sent to this WhatsApp number.
              </p>
            </div>

            <button
              onClick={handleSendWhatsAppOtp}
              className="w-full h-11 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.985] shadow-sm transition-all"
            >
              <span>💬</span>
              <span>Send WhatsApp Verification OTP</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        )}

        {/* OTP VERIFICATION STEP */}
        {otpSent && (
          <div className="space-y-3.5 pt-1">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EDF7F0] text-[#237A4B] text-[11px] font-semibold border border-[#C6E7D2]">
                <span className="material-symbols-outlined text-sm">mark_chat_read</span>
                <span>OTP Dispatched via WhatsApp</span>
              </div>

              <p className="text-xs text-[#5B6862] mt-1">
                Enter the 4-digit verification code sent to:
              </p>
              <p className="text-sm font-bold text-[#003525] font-mono">+91 {phone}</p>

              {/* 4-digit code inputs */}
              <div className="flex justify-center gap-2 pt-2">
                {otpCode.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-box-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const next = [...otpCode];
                      next[i] = e.target.value;
                      setOtpCode(next);
                      if (e.target.value && i < 3) {
                        const nextBox = document.getElementById(`otp-box-${i + 1}`);
                        nextBox?.focus();
                      }
                    }}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-[#174D3A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8F169] bg-[#F5F7F4]"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#5B6862] px-1">
              <span>Didn't receive code?</span>
              <button
                onClick={handleSendWhatsAppOtp}
                className="text-[#003525] font-bold hover:underline"
              >
                Resend via WhatsApp
              </button>
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full h-11 bg-[#174D3A] hover:bg-[#1E5E47] text-[#C8F169] text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.985]"
            >
              <span className="material-symbols-outlined text-base">verified</span>
              <span>Verify & Continue</span>
            </button>

            <button
              onClick={() => setOtpSent(false)}
              className="w-full text-xs text-[#5B6862] hover:text-[#003525] underline text-center"
            >
              Edit Mobile Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
