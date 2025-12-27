// src/app/admin/layout.jsx - UPDATE AUTH LOGIC
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebaseConfig";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar"; // Make sure this exists

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
        console.log("👤 Admin user:", user.email);

        // If on login page, redirect to dashboard
        if (pathname === "/admin/login") {
          router.push("/admin");
        }
      } else {
        // User is signed out
        setUser(null);

        // If not on login page, redirect to login
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("✅ User logged out");
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If not logged in and not on login page, show nothing (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar user={user} onLogout={handleLogout} />
      <main className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow p-6 min-h-[calc(100vh-3rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}
