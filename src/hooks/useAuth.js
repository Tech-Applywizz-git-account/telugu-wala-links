// src/hooks/useAuth.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext({
  user: null,
  role: null,
  paymentStatus: null,
  isPendingPayment: true,
  loading: true,
  checkingSub: true,
  signOut: async () => { },
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("userRole") || "user");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);   // true until session is checked (fast)
  const [checkingSub, setCheckingSub] = useState(true); // true until profile is loaded

  const fetchProfile = async (userId) => {
    if (!userId) return;
    setCheckingSub(true);
    console.log("📡 Fetching profile for:", userId);

    // Timeout promise — if Supabase takes >5s, fall back to 'pending' so UI never hangs
    const timeout = new Promise((resolve) =>
      setTimeout(() => resolve({ timedOut: true }), 5000)
    );

    try {
      const profileQuery = supabase
        .from("profiles")
        .select("role, payment_status, subscription_end_date")
        .eq("id", userId)
        .maybeSingle();

      const result = await Promise.race([profileQuery, timeout]);

      if (result?.timedOut) {
        console.warn("⏱️ Profile fetch timed out — defaulting to pending");
        setPaymentStatus('pending');
        return;
      }

      const { data, error } = result;

      if (error) {
        console.error("❌ Profile fetch error:", error.message);
        setPaymentStatus('pending');
      } else if (data) {
        console.log("👤 Profile loaded:", data.role, "| Status:", data.payment_status);
        setRole(data.role || "user");
        setPaymentStatus(data.payment_status || "pending");
        setProfile(data); // Store full profile
        localStorage.setItem("userRole", data.role || "user");
      } else {
        console.warn("📭 No profile found, using defaults");
        setPaymentStatus('pending');
      }
    } catch (err) {
      console.error("💥 Auth error:", err);
      setPaymentStatus('pending');
    } finally {
      setCheckingSub(false);
    }
  };

  const subscriptionEndDate = profile?.subscription_end_date ? new Date(profile.subscription_end_date) : null;
  const subscriptionExpired = subscriptionEndDate ? subscriptionEndDate < new Date() : false;

  useEffect(() => {
    // 1. Initial Session Check — only waits for getSession(), NOT fetchProfile
    const init = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id); // ← NO await: loading drops instantly after session check
        } else {
          setCheckingSub(false); // no user = no profile to fetch
        }
      } catch (err) {
        console.error("💥 Session init error:", err);
        setCheckingSub(false);
      } finally {
        setLoading(false); // ← releases immediately; profile loads in background
      }
    };
    init();

    // 2. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 Auth Event:", event);
      setLoading(false); // ← drop loading immediately on any auth event
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id); // ← NO await: non-blocking profile fetch
      } else {
        setUser(null);
        setRole("user");
        setPaymentStatus(null);
        setCheckingSub(false);
        localStorage.removeItem("userRole");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole("user");
    setPaymentStatus(null);
    localStorage.removeItem("userRole");
  };

  const value = {
    user,
    role,
    profile, // Exported
    isAdmin: role === "admin",
    paymentStatus,
    subscriptionExpired,
    subscriptionEndDate,
    isPendingPayment: role !== 'admin' && (paymentStatus !== 'completed' && paymentStatus !== 'paid' || subscriptionExpired),
    refresh: () => user && fetchProfile(user.id),
    loading,
    checkingSub,
    signOut,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export default function useAuth() {
  return useContext(AuthContext);
}