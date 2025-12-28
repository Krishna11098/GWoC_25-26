// components/ProtectedRoute.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
