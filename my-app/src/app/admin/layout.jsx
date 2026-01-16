"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "@/app/lib/firebaseConfig";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar"; // Make sure this exists
import { Ban, Menu } from "lucide-react";

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdminStatus = async (user) => {
      if (user) {
        try {
          const db = getFirestore();
          const adminDoc = await getDoc(doc(db, "admins", user.uid));

          if (adminDoc.exists()) {
            setIsAdmin(true);
            console.log("✅ User is admin:", user.email);
          } else {
            console.log("❌ User is not admin:", user.email);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Admin check error:", error);
          setIsAdmin(false);
        } finally {
          setAdminLoading(false);
        }
      } else {
        setAdminLoading(false);
        setIsAdmin(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        checkAdminStatus(user);

        // If on login page, redirect to dashboard
        if (pathname === "/admin/login") {
          router.push("/admin");
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setAdminLoading(false);

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

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"></div>
          <p className="mt-4">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (user && !isAdmin && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8 rounded-xl shadow-lg text-center">
          <div className="flex justify-center mb-4 text-red-500">
            <Ban size={64} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="mb-6">
            You don't have permission to access the admin panel.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full px-4 py-2 rounded-lg"
            >
              Go to Homepage
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-lg"
            >
              Switch Account
            </button>
          </div>
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
    <div className="flex min-h-screen">
      <AdminSidebar
        user={user}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 p-6 text-font ml-0 md:ml-64">
        {/* Admin Status Badge */}
        {isAdmin && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-bold bg-orange text-fontcolor">
                ✅ Admin Mode
              </span>
              <span className="text-sm text-font/70">
                Logged in as: {user?.email}
              </span>
            </div>
            {/* Mobile toggle for sidebar */}
            <button
              className="md:hidden ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-lg bg-green text-fontcolor hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>
        )}

        <div className="rounded-lg shadow p-6 min-h-[calc(100vh-3rem) backdrop-blur">
          {children}
        </div>
      </main>
    </div>
  );
}
