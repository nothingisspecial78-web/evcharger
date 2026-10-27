import { createClient } from "@supabase/supabase-js";
import { UserSession, HostSubscription } from "@/components/driver/DriverAuthModal";
import { ChargerBookingRequest } from "@/components/host/HostDashboard";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://xkdacgndjryqwuhfaeew.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_bbyEIDHCjGZ2BvwFWKtXWQ_UfXMtFgu";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Persists or updates user profile in Supabase 'profiles' table
 */
export async function syncUserToSupabase(session: UserSession): Promise<boolean> {
  try {
    const { error } = await supabase.from("profiles").upsert(
      {
        phone: session.phone,
        name: session.name,
        role: session.role,
        vehicle: session.vehicle || null,
        verified_at: session.verifiedAt,
        host_subscription: session.hostSubscription || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "phone" }
    );

    if (error) {
      console.warn("Supabase profile sync warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase network error during user sync:", err);
    return false;
  }
}

/**
 * Fetches user profile from Supabase by phone
 */
export async function fetchUserFromSupabase(phone: string): Promise<UserSession | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error || !data) return null;

    return {
      phone: data.phone,
      name: data.name,
      role: data.role,
      vehicle: data.vehicle || undefined,
      verifiedAt: data.verified_at || data.created_at,
      hostSubscription: data.host_subscription || undefined,
    };
  } catch (err) {
    console.warn("Supabase fetch user error:", err);
    return null;
  }
}

/**
 * Updates host subscription state in Supabase
 */
export async function updateHostSubscriptionInSupabase(
  phone: string,
  subscription: HostSubscription
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        host_subscription: subscription,
        updated_at: new Date().toISOString(),
      })
      .eq("phone", phone);

    if (error) {
      console.warn("Supabase subscription update warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase subscription error:", err);
    return false;
  }
}

/**
 * Saves a new charger booking request to Supabase
 */
export async function saveBookingRequestToSupabase(
  request: ChargerBookingRequest
): Promise<boolean> {
  try {
    const { error } = await supabase.from("booking_requests").insert([
      {
        id: request.id,
        driver_name: request.driverName,
        driver_phone: request.driverPhone,
        vehicle: request.vehicle,
        station_name: request.stationName,
        bay_id: request.bayId,
        connector: request.connector,
        kw: request.kw,
        status: request.status,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn("Supabase booking insert warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase booking insert error:", err);
    return false;
  }
}

/**
 * Updates status of a charger booking request in Supabase
 */
export async function updateBookingRequestStatusInSupabase(
  id: string,
  status: "accepted" | "declined"
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("booking_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.warn("Supabase booking status update warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase booking status error:", err);
    return false;
  }
}

/**
 * Fetches all booking requests from Supabase
 */
export async function fetchBookingRequestsFromSupabase(): Promise<ChargerBookingRequest[]> {
  try {
    const { data, error } = await supabase
      .from("booking_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      driverName: d.driver_name,
      driverPhone: d.driver_phone,
      vehicle: d.vehicle,
      stationName: d.station_name,
      bayId: d.bay_id,
      connector: d.connector,
      kw: d.kw,
      timestamp: new Date(d.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: d.status,
    }));
  } catch (err) {
    console.warn("Supabase fetch bookings error:", err);
    return [];
  }
}
