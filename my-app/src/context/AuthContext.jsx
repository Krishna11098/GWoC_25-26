// context/AuthContext.jsx
"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

// Create the context
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("joyjuncture_admin");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("joyjuncture_admin");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    // Hardcoded admin credentials for demo
    const adminEmails = ["admin@joyjuncture.com", "superadmin@joyjuncture.com"];
    const adminPassword = "admin123";

    if (adminEmails.includes(email) && password === adminPassword) {
      const userData = {
        email: email,
        displayName: email.split("@")[0],
      };

      // Store in localStorage
      localStorage.setItem("joyjuncture_admin", JSON.stringify(userData));
      setUser(userData);

      return {
        success: true,
        user: userData,
        message: "Login successful!",
      };
    }

    return {
      success: false,
      error: "Invalid email or password. Use admin@joyjuncture.com / admin123",
    };
  };

  // Logout function
  const logout = async () => {
    localStorage.removeItem("joyjuncture_admin");
    setUser(null);
    router.push("/admin/login");
    return { success: true };
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
