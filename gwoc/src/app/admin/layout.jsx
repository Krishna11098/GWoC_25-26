// app/admin/layout.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// DON'T use useAuth here directly if this might render before AuthProvider
// Instead, create a client component wrapper

export default function AdminLayout({ children }) {
  // This layout should NOT use useAuth directly if it might render
  // before AuthProvider is available

  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}

// Create a separate client component that uses useAuth
function AdminLayoutContent({ children }) {
  const router = useRouter();

  // We'll handle auth check in a way that doesn't break
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("joyjuncture_admin");
      if (!storedUser) {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen p-4">
          <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="block p-2 hover:bg-gray-100 rounded"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin/create-event"
              className="block p-2 hover:bg-gray-100 rounded"
            >
              ➕ Create Event
            </Link>
            <Link
              href="/admin/events"
              className="block p-2 hover:bg-gray-100 rounded"
            >
              📋 All Events
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
