"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBanned, setIsBanned] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState({});
  const router = useRouter();

  // Mock Firestore ban check (replace with actual Firebase)
  const checkBanStatus = async (email) => {
    try {
      // In production, replace this with actual Firebase Firestore call
      // For demo, we'll use localStorage to simulate ban status
      const bannedUsers = JSON.parse(
        localStorage.getItem("joyjuncture_banned_users") || "[]"
      );
      return bannedUsers.includes(email);
    } catch (error) {
      console.error("Error checking ban status:", error);
      return false;
    }
  };

  const validateSession = useCallback((storedUser) => {
    try {
      const parsed = JSON.parse(storedUser);

      // Check if session hasn't expired
      if (parsed.expiry && parsed.expiry > Date.now()) {
        // Check if user is banned
        const bannedUsers = JSON.parse(
          localStorage.getItem("joyjuncture_banned_users") || "[]"
        );
        if (bannedUsers.includes(parsed.email)) {
          setIsBanned(true);
          localStorage.removeItem("joyjuncture_admin");
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("joyjuncture_admin");

      if (storedUser) {
        const validUser = validateSession(storedUser);
        if (validUser) {
          setUser(validUser);

          // Check ban status on mount
          const banned = await checkBanStatus(validUser.email);
          if (banned) {
            setIsBanned(true);
            setUser(null);
            localStorage.removeItem("joyjuncture_admin");
            router.push("/admin/banned");
          }
        } else {
          localStorage.removeItem("joyjuncture_admin");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [validateSession, router]);

  const login = async (email, password) => {
    // Rate limiting check
    const attempts = loginAttempts[email] || 0;
    if (attempts >= 5) {
      return {
        success: false,
        error: "Too many attempts. Please try again in 15 minutes.",
      };
    }

    // Check if user is banned before login
    const banned = await checkBanStatus(email);
    if (banned) {
      setIsBanned(true);
      return {
        success: false,
        error: "Your account has been suspended. Please contact support.",
      };
    }

    // Input validation
    if (!email || !password) {
      return {
        success: false,
        error: "Email and password are required",
      };
    }

    // Admin credentials
    const adminEmails = ["admin@joyjuncture.com", "superadmin@joyjuncture.com"];
    const adminPassword = "admin123";

    if (adminEmails.includes(email) && password === adminPassword) {
      const userData = {
        email: email,
        displayName: email.split("@")[0],
        userId: email.replace(/[^a-zA-Z0-9]/g, "_"), // Simple ID generation
        expiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiry
        loginTime: Date.now(),
        role: email.includes("superadmin") ? "superadmin" : "admin",
      };

      // Store session
      localStorage.setItem("joyjuncture_admin", JSON.stringify(userData));
      setUser(userData);
      setIsBanned(false);

      // Reset attempts on success
      setLoginAttempts((prev) => {
        const newAttempts = { ...prev };
        delete newAttempts[email];
        return newAttempts;
      });

      return {
        success: true,
        user: userData,
        message: "Login successful!",
      };
    }

    // Increment failed attempts
    setLoginAttempts((prev) => ({
      ...prev,
      [email]: (prev[email] || 0) + 1,
    }));

    return {
      success: false,
      error: "Invalid email or password. Use admin@joyjuncture.com / admin123",
    };
  };

  const logout = useCallback(() => {
    localStorage.removeItem("joyjuncture_admin");
    setUser(null);
    setIsBanned(false);
    router.push("/admin/login");
    return { success: true };
  }, [router]);

  // Admin function to ban/unban users
  const banUser = (email, reason = "Violation of terms") => {
    try {
      const bannedUsers = JSON.parse(
        localStorage.getItem("joyjuncture_banned_users") || "[]"
      );

      if (!bannedUsers.includes(email)) {
        bannedUsers.push(email);
        localStorage.setItem(
          "joyjuncture_banned_users",
          JSON.stringify(bannedUsers)
        );

        // If banned user is currently logged in, log them out
        if (user && user.email === email) {
          logout();
        }

        // Log ban action
        const banLogs = JSON.parse(
          localStorage.getItem("joyjuncture_ban_logs") || "[]"
        );
        banLogs.push({
          email,
          reason,
          bannedBy: user?.email || "system",
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem("joyjuncture_ban_logs", JSON.stringify(banLogs));
      }

      return { success: true, message: `User ${email} has been banned.` };
    } catch (error) {
      return { success: false, error: "Failed to ban user" };
    }
  };

  const unbanUser = (email) => {
    try {
      const bannedUsers = JSON.parse(
        localStorage.getItem("joyjuncture_banned_users") || "[]"
      );
      const updatedUsers = bannedUsers.filter((user) => user !== email);
      localStorage.setItem(
        "joyjuncture_banned_users",
        JSON.stringify(updatedUsers)
      );

      return { success: true, message: `User ${email} has been unbanned.` };
    } catch (error) {
      return { success: false, error: "Failed to unban user" };
    }
  };

  const getBannedUsers = () => {
    try {
      return JSON.parse(
        localStorage.getItem("joyjuncture_banned_users") || "[]"
      );
    } catch {
      return [];
    }
  };

  const value = {
    user,
    loading,
    isBanned,
    login,
    logout,
    banUser,
    unbanUser,
    getBannedUsers,
    isAuthenticated: !!user && !isBanned,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Ban Check Component
export const BanCheck = ({ children }) => {
  const { user, isBanned, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && isBanned) {
      router.push("/admin/banned");
    }
  }, [user, isBanned, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isBanned) {
    return null; // Will redirect to banned page
  }

  return children;
};
