"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";

export default function MaintenanceGate({ children }) {
  const { settings, loading } = useSettings();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only check if not loading
    if (
      !loading &&
      settings?.maintenanceMode &&
      !pathname?.startsWith("/admin") &&
      pathname !== "/maintenance"
    ) {
      router.push("/maintenance");
    }
  }, [settings, loading, pathname, router]);

  // Show loading state or children based on conditions
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // If maintenance is OFF, show children
  if (!settings?.maintenanceMode) {
    return children;
  }

  // If maintenance is ON but we're on allowed pages, show content
  if (pathname?.startsWith("/admin") || pathname === "/maintenance") {
    return children;
  }

  // Show nothing while redirect happens
  return null;
}
