import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext({
  user: null,
  role: null,
  loading: true,
  signOut: async () => { },
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (email, id) => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching role:", error);
        setRole("user");
      } else {
        console.log("Fetched role for user:", email, "Role:", data?.role);
        setRole(data?.role || "user");
      }
    } catch (err) {
      console.error("Error in fetchUserRole:", err);
      setRole("user");
    }
  };

  const signOut = async () => {
    console.log("🚨 SignOut called from AuthContext");
    try {
      // Clear state immediately for instant UI feedback
      setUser(null);
      setRole(null);

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Supabase signOut error:", error);
      } else {
        console.log("✅ Successfully signed out");
      }
    } catch (err) {
      console.error("SignOut exception:", err);
    }
  };

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          await fetchUserRole(session.user.email, session.user.id);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      if (event === 'SIGNED_OUT' || !session) {
        console.log("User signed out, clearing state");
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        await fetchUserRole(session.user.email, session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    role,
    isAdmin: role === "admin",
    loading,
    signOut,
  };

  // Use React.createElement instead of JSX
  return React.createElement(AuthContext.Provider, { value }, children);
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
