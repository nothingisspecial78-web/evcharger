"use client";

import React, { useState, useEffect } from "react";
import TopRoleNav, { PortalRole } from "@/components/TopRoleNav";
import DiscoveryView from "@/components/driver/DiscoveryView";
import ActiveChargeView from "@/components/driver/ActiveChargeView";
import ActivityView from "@/components/driver/ActivityView";
import ProfileView from "@/components/driver/ProfileView";
import DriverAuthModal, { UserSession, HostSubscription } from "@/components/driver/DriverAuthModal";
import HostDashboard, { ChargerBookingRequest } from "@/components/host/HostDashboard";
import HostSubscriptionView from "@/components/host/HostSubscriptionView";
import SuperAdminDashboard from "@/components/superadmin/SuperAdminDashboard";
import {
  supabase,
  fetchBookingRequestsFromSupabase,
  saveBookingRequestToSupabase,
  updateBookingRequestStatusInSupabase,
  updateHostSubscriptionInSupabase,
  fetchUserFromSupabase,
} from "@/lib/supabase";

export type DriverTab = "map" | "charge" | "activity" | "profile";

export default function HomePage() {
  const [currentRole, setCurrentRole] = useState<PortalRole>("driver");
  const [isFrameMode, setIsFrameMode] = useState(true);
  const [driverTab, setDriverTab] = useState<DriverTab>("map");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptReason, setAuthPromptReason] = useState("");
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  const [activeStationName, setActiveStationName] = useState("GreenPulse Supercharger");
  const [activeStationKw, setActiveStationKw] = useState(180);

  // Real-time booking requests from drivers to station host admin (synced via Supabase)
  const [bookingRequests, setBookingRequests] = useState<ChargerBookingRequest[]>([
    {
      id: "req-init-101",
      driverName: "Aarav Sharma",
      driverPhone: "9845012890",
      vehicle: "Tata Nexon EV Max (KA 03 MP 4410)",
      stationName: "Indiranagar FastStation #104",
      bayId: "Bay 02 - CCS2",
      connector: "CCS2 · DC Dual",
      kw: 60,
      timestamp: "3 mins ago",
      status: "pending",
    },
  ]);

  // Restore saved session & synchronize with Supabase backend
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("voltspot_session");
        if (saved) {
          const parsed = JSON.parse(saved) as UserSession;
          setCurrentUser(parsed);
          if (parsed.role === "host") {
            setCurrentRole("host");
          } else if (parsed.role === "superadmin") {
            setCurrentRole("superadmin");
          } else {
            setCurrentRole("driver");
          }

          // Fetch fresh profile state from Supabase
          if (parsed.phone) {
            fetchUserFromSupabase(parsed.phone).then((remoteUser) => {
              if (remoteUser) {
                setCurrentUser(remoteUser);
                localStorage.setItem("voltspot_session", JSON.stringify(remoteUser));
              }
            });
          }
        }
      } catch (e) {
        console.error("Error loading session", e);
      }
    }

    // Fetch initial booking requests from Supabase
    fetchBookingRequestsFromSupabase().then((remoteRequests) => {
      if (remoteRequests && remoteRequests.length > 0) {
        setBookingRequests(remoteRequests);
      }
    });

    // Supabase Realtime channel for live booking alerts
    const channel = supabase
      .channel("voltspot-realtime-bookings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "booking_requests" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const row = payload.new as any;
            const newReq: ChargerBookingRequest = {
              id: row.id,
              driverName: row.driver_name,
              driverPhone: row.driver_phone,
              vehicle: row.vehicle,
              stationName: row.station_name,
              bayId: row.bay_id,
              connector: row.connector,
              kw: row.kw,
              timestamp: "Just now",
              status: row.status,
            };
            setBookingRequests((prev) => {
              if (prev.some((r) => r.id === newReq.id)) return prev;
              return [newReq, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const row = payload.new as any;
            setBookingRequests((prev) =>
              prev.map((r) =>
                r.id === row.id ? { ...r, status: row.status } : r
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStartCharge = (name: string, kw: number) => {
    if (!currentUser) {
      setAuthPromptReason("Please register or sign in via WhatsApp OTP to start your charging session.");
      setIsAuthModalOpen(true);
      return;
    }
    setActiveStationName(name);
    setActiveStationKw(kw);
    setDriverTab("charge");
  };

  const handleTabChange = (tab: DriverTab) => {
    if (tab !== "map" && !currentUser) {
      setAuthPromptReason(
        tab === "charge"
          ? "Please register or sign in via WhatsApp OTP to access the live charging monitor."
          : tab === "activity"
          ? "Please register or sign in via WhatsApp OTP to view charging records & invoices."
          : "Please register or sign in via WhatsApp OTP to manage your profile, garage, and wallet."
      );
      setIsAuthModalOpen(true);
      return;
    }
    setDriverTab(tab);
  };

  const handleRoleChange = (newRole: PortalRole) => {
    // Regular users / guests can ONLY view driver interface
    if (newRole === "superadmin" && currentUser?.role !== "superadmin") {
      setAuthPromptReason("Super Admin access is restricted to authorized personnel.");
      setIsAuthModalOpen(true);
      return;
    }

    if (newRole === "host" && currentUser?.role !== "host" && currentUser?.role !== "superadmin") {
      setAuthPromptReason("Station Host Portal requires a registered Station Host account.");
      setIsAuthModalOpen(true);
      return;
    }

    setCurrentRole(newRole);
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("voltspot_session");
    }
    setCurrentUser(null);
    setCurrentRole("driver");
    setDriverTab("map");
    alert("You have been signed out. Welcome back anytime!");
  };

  const handleLoginSuccess = (session: UserSession) => {
    setCurrentUser(session);
    if (session.role === "superadmin") {
      setCurrentRole("superadmin");
      alert("👑 Super Admin Root Access Granted. Unlocking Global Platform Telemetry.");
    } else if (session.role === "host") {
      setCurrentRole("host");
    } else {
      setCurrentRole("driver");
    }
  };

  // Driver submits request for charger
  const handleNewBookingRequest = (details: {
    stationName: string;
    bayId: string;
    connector: string;
    kw: number;
  }) => {
    const newReq: ChargerBookingRequest = {
      id: "req-" + Date.now(),
      driverName: currentUser?.name || "Aarav Sharma",
      driverPhone: currentUser?.phone || "9845012890",
      vehicle: currentUser?.vehicle || "Tata Nexon EV Max",
      stationName: details.stationName,
      bayId: details.bayId,
      connector: details.connector,
      kw: details.kw,
      timestamp: "Just now",
      status: "pending",
    };
    setBookingRequests((prev) => [newReq, ...prev]);

    // Persist new booking request to Supabase
    saveBookingRequestToSupabase(newReq).catch((err) =>
      console.warn("Supabase booking insert error:", err)
    );
  };

  // Host accepts booking request
  const handleAcceptBookingRequest = (id: string) => {
    setBookingRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" as const } : r))
    );
    const target = bookingRequests.find((r) => r.id === id);

    // Update status in Supabase backend
    updateBookingRequestStatusInSupabase(id, "accepted").catch((err) =>
      console.warn("Supabase booking status update error:", err)
    );

    alert(
      `🔒 Bay 02 Locked! Hardware connector reserved for ${
        target?.driverName || "driver"
      }. Driver notified over MQTT websocket.`
    );
  };

  // Host declines booking request
  const handleDeclineBookingRequest = (id: string) => {
    setBookingRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "declined" as const } : r))
    );

    // Update status in Supabase backend
    updateBookingRequestStatusInSupabase(id, "declined").catch((err) =>
      console.warn("Supabase booking status update error:", err)
    );

    alert("Charger request declined. Connector released to general pool.");
  };

  // Host completes payment or starts free trial
  const handleActivateSubscription = (sub: HostSubscription) => {
    if (currentUser) {
      const updated: UserSession = {
        ...currentUser,
        hostSubscription: sub,
      };
      setCurrentUser(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("voltspot_session", JSON.stringify(updated));
      }

      // Persist active subscription to Supabase backend
      updateHostSubscriptionInSupabase(currentUser.phone, sub).catch((err) =>
        console.warn("Supabase subscription update error:", err)
      );
    }
  };

  // Super Admin overrides / grants host status for a period or lifetime
  const handleGrantHostStatus = (
    hostName: string,
    status: "active" | "pending",
    period: string
  ) => {
    if (currentUser?.role === "host") {
      const newSub: HostSubscription = {
        status,
        plan: period.includes("Lifetime") ? "lifetime" : "yearly",
        grantedBy: "superadmin",
        validUntil: period,
      };
      const updated: UserSession = {
        ...currentUser,
        hostSubscription: newSub,
      };
      setCurrentUser(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("voltspot_session", JSON.stringify(updated));
      }

      // Persist granted subscription to Supabase backend
      updateHostSubscriptionInSupabase(currentUser.phone, newSub).catch((err) =>
        console.warn("Supabase subscription update error:", err)
      );
    }
  };

  // Determine whether Host is allowed into operational dashboard or gated by Subscription Paywall
  const isHostSubscriptionActive =
    currentUser?.role === "superadmin" ||
    currentUser?.hostSubscription?.status === "active";

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F4] text-[#121E1A]">
      {/* Top Universal Role Switcher & Viewport Control */}
      <TopRoleNav
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        isFrameMode={isFrameMode}
        onToggleFrameMode={() => setIsFrameMode(!isFrameMode)}
        onOpenAuthModal={() => {
          setAuthPromptReason("");
          setIsAuthModalOpen(true);
        }}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main View Area */}
      <div className="flex-1 w-full flex justify-center py-2 sm:py-4 px-0 sm:px-4">
        {/* Container: If frameMode is on & role is driver, render in mobile simulation frame */}
        <div
          className={`w-full transition-all duration-300 ${
            isFrameMode && currentRole === "driver"
              ? "max-w-[420px] bg-white sm:rounded-3xl sm:border sm:border-[#CCD5CD] sm:shadow-2xl overflow-hidden relative"
              : "max-w-5xl bg-white sm:rounded-2xl sm:border sm:border-[#CCD5CD] sm:shadow-sm overflow-hidden relative"
          }`}
        >
          {/* 1. Driver User Portal (Visible to user, admin, super admin) */}
          {currentRole === "driver" && (
            <div className="relative min-h-[85vh] flex flex-col justify-between">
              {driverTab === "map" && (
                <DiscoveryView
                  onStartCharge={handleStartCharge}
                  onNavigateTab={handleTabChange}
                  isAuthenticated={!!currentUser}
                  onRequestAuth={(reason) => {
                    setAuthPromptReason(reason);
                    setIsAuthModalOpen(true);
                  }}
                  onRequestBooking={handleNewBookingRequest}
                  currentUser={currentUser}
                />
              )}

              {driverTab === "charge" && (
                <ActiveChargeView
                  stationName={activeStationName}
                  maxKw={activeStationKw}
                  onNavigateTab={handleTabChange}
                />
              )}

              {driverTab === "activity" && <ActivityView />}

              {driverTab === "profile" && (
                <ProfileView
                  onOpenAuthModal={() => {
                    setAuthPromptReason("");
                    setIsAuthModalOpen(true);
                  }}
                />
              )}

              {/* Driver Docked Bottom Navigation Bar */}
              <nav
                aria-label="Bottom Navigation"
                className="fixed sm:absolute bottom-0 left-0 w-full z-40 bg-[#EFFDF6]/95 backdrop-blur-md border-t border-[#C0C9C2]/40 shadow-[0_-2px_10px_rgba(23,35,31,0.04)]"
              >
                <div className="flex justify-around items-center px-3 py-2 h-16 max-w-[420px] mx-auto">
                  {/* Tab 1: Map / Explore */}
                  <button
                    onClick={() => handleTabChange("map")}
                    aria-current={driverTab === "map" ? "page" : undefined}
                    className={`flex flex-col items-center justify-center rounded-lg px-3 py-1.5 min-h-[44px] min-w-[44px] active:scale-[0.985] transition-all ${
                      driverTab === "map"
                        ? "bg-[#C8F169] text-[#526D00] font-semibold"
                        : "text-[#404944] hover:bg-[#E9F7F0]"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[22px] ${
                        driverTab === "map" ? "fill-icon" : ""
                      }`}
                    >
                      explore
                    </span>
                    <span className="text-[11px] mt-0.5 font-semibold">Map</span>
                  </button>

                  {/* Tab 2: Charge / Stations */}
                  <button
                    onClick={() => handleTabChange("charge")}
                    aria-current={driverTab === "charge" ? "page" : undefined}
                    className={`flex flex-col items-center justify-center rounded-lg px-3 py-1.5 min-h-[44px] min-w-[44px] active:scale-[0.985] transition-all relative ${
                      driverTab === "charge"
                        ? "bg-[#C8F169] text-[#526D00] font-semibold"
                        : "text-[#404944] hover:bg-[#E9F7F0]"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[22px] ${
                        driverTab === "charge" ? "fill-icon" : ""
                      }`}
                    >
                      ev_station
                    </span>
                    <span className="text-[11px] mt-0.5 font-semibold">Charge</span>
                    {currentUser && (
                      <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#174D3A] ring-1 ring-white"></span>
                    )}
                  </button>

                  {/* Tab 3: Activity / History */}
                  <button
                    onClick={() => handleTabChange("activity")}
                    aria-current={driverTab === "activity" ? "page" : undefined}
                    className={`flex flex-col items-center justify-center rounded-lg px-3 py-1.5 min-h-[44px] min-w-[44px] active:scale-[0.985] transition-all ${
                      driverTab === "activity"
                        ? "bg-[#C8F169] text-[#526D00] font-semibold"
                        : "text-[#404944] hover:bg-[#E9F7F0]"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[22px] ${
                        driverTab === "activity" ? "fill-icon" : ""
                      }`}
                    >
                      history
                    </span>
                    <span className="text-[11px] mt-0.5 font-semibold">Activity</span>
                  </button>

                  {/* Tab 4: Profile */}
                  <button
                    onClick={() => handleTabChange("profile")}
                    aria-current={driverTab === "profile" ? "page" : undefined}
                    className={`flex flex-col items-center justify-center rounded-lg px-3 py-1.5 min-h-[44px] min-w-[44px] active:scale-[0.985] transition-all ${
                      driverTab === "profile"
                        ? "bg-[#C8F169] text-[#526D00] font-semibold"
                        : "text-[#404944] hover:bg-[#E9F7F0]"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[22px] ${
                        driverTab === "profile" ? "fill-icon" : ""
                      }`}
                    >
                      person
                    </span>
                    <span className="text-[11px] mt-0.5 font-semibold">Profile</span>
                  </button>
                </div>
              </nav>
            </div>
          )}

          {/* 2. Host Admin Portal:
              - If Host has NOT paid or approved: show ONLY the HostSubscriptionView (Take Premium display)
              - If Host HAS paid or Super Admin approved status: show full operational HostDashboard */}
          {currentRole === "host" && (
            <>
              {isHostSubscriptionActive ? (
                <HostDashboard
                  bookingRequests={bookingRequests}
                  onAcceptRequest={handleAcceptBookingRequest}
                  onDeclineRequest={handleDeclineBookingRequest}
                  onSwitchToDriver={() => setCurrentRole("driver")}
                  hostName={currentUser?.name || "Indiranagar Hub #104"}
                />
              ) : (
                <HostSubscriptionView
                  hostName={currentUser?.name || "Station Host Admin"}
                  onActivateSubscription={handleActivateSubscription}
                  onSwitchToDriver={() => setCurrentRole("driver")}
                />
              )}
            </>
          )}

          {/* 3. Super Admin Portal (ONLY visible to Super Admin) */}
          {currentRole === "superadmin" && currentUser?.role === "superadmin" && (
            <SuperAdminDashboard
              onGrantHostStatus={handleGrantHostStatus}
              onSwitchToHost={() => setCurrentRole("host")}
              onSwitchToDriver={() => setCurrentRole("driver")}
            />
          )}
        </div>
      </div>

      {/* WhatsApp OTP Authentication & Registration Modal */}
      <DriverAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialPrompt={authPromptReason}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
