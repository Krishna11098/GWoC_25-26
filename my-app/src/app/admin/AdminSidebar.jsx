"use client";

import Link from "next/link";
import { auth } from "@/app/lib/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminSidebar({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">JoyJuncture</h1>
        <p className="text-gray-400 text-sm">Admin Panel</p>
      </div>

      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <p className="font-medium">{user?.email || "Admin"}</p>
        <p className="text-sm text-gray-400">Administrator</p>
      </div>

      <nav className="space-y-2">
        <Link
          href="/admin"
          className="flex items-center p-3 hover:bg-gray-800 rounded"
        >
          <span className="mr-3">📊</span>
          Dashboard
        </Link>

        <Link
          href="/admin/create-event"
          className="flex items-center p-3 hover:bg-gray-800 rounded"
        >
          <span className="mr-3">➕</span>
          Create Event
        </Link>

        <Link
          href="/admin/events"
          className="flex items-center p-3 hover:bg-gray-800 rounded"
        >
          <span className="mr-3">📋</span>
          All Events
        </Link>

        <Link
          href="/admin/sudoku"
          className="flex items-center p-3 hover:bg-gray-800 rounded"
        >
          <span className="mr-3">🎮</span>
          Sudoku
        </Link>

        <Link
          href="/admin/blogs"
          className="flex items-center p-3 hover:bg-gray-800 rounded"
        >
          <span className="mr-3">📝</span>
          Blogs
        </Link>

        <div className="p-3 text-gray-400">
          <span className="mr-3">👥</span>
          Users
        </div>

        <div className="p-3 text-gray-400">
          <span className="mr-3">⚙️</span>
          Settings
        </div>
      </nav>

      <div className="mt-8 p-4 bg-blue-900/30 rounded-lg">
        <p className="text-sm font-medium">Storage Status</p>
        <p className="text-xs text-green-400 mt-1">✓ Firebase Cloud</p>
        <p className="text-xs text-gray-400 mt-2">
          All data stored in cloud database
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 w-full p-3 bg-red-600 hover:bg-red-700 rounded flex items-center justify-center"
      >
        <span className="mr-2">🚪</span>
        Logout
      </button>
    </aside>
  );
}
