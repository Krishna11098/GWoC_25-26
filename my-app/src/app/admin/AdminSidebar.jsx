"use client";

import Link from "next/link";
import { auth } from "@/app/lib/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminSidebar({ user, isAdmin }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "/icons/party.svg" },
    {
      href: "/admin/create-event",
      label: "Create Event",
      icon: "/icons/plus.svg",
    },
    { href: "/admin/events", label: "All Events", icon: "/icons/calendar.svg" },
    { href: "/admin/sudoku", label: "Sudoku", icon: "/icons/keyboard.svg" },
    { href: "/admin/blogs", label: "Blogs", icon: "/icons/edit.svg" },
    { href: "/admin/users", label: "Users", icon: "/icons/users.svg" },
    { href: "/admin/settings", label: "Settings", icon: "/icons/bulb.svg" },
  ];

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 overflow-y-auto p-6 bg-font text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">JoyJuncture</h1>
        <p className="text-sm opacity-90">Admin Panel</p>
      </div>

      <div className="mb-6 p-4 rounded-lg bg-background/20">
        <p className="font-medium">{user?.email || "Admin"}</p>
        <p className="text-sm opacity-80">Administrator</p>
      </div>

      <nav className="space-y-2">
        <Link
          href="/admin"
          className="flex items-center p-3 hover:bg-bg hover:text-black rounded"
        >
          <span className="mr-3">📊</span>
          Dashboard
        </Link>

        <Link
          href="/admin/create-event"
          className="flex items-center p-3 hover:bg-bg hover:text-black rounded"
        >
          <span className="mr-3">➕</span>
          Create Event
        </Link>

        <Link
          href="/admin/events"
          className="flex items-center p-3 hover:bg-bg hover:text-black rounded"
        >
          <span className="mr-3">📋</span>
          All Events
        </Link>

        <Link
          href="/admin/sudoku"
          className="flex items-center p-3 hover:bg-bg hover:text-black rounded"
        >
          <span className="mr-3">🎮</span>
          Sudoku
        </Link>

        <Link
          href="/admin/riddles"
          className="flex items-center p-3 hover:bg-bg hover:text-black rounded"
        >
          <span className="mr-3">🧩</span>
          Riddles
        </Link>

        <Link
          href="/admin/blogs"
          className="flex items-center p-3 hover:bg-bg hover:text-black rounded"
        >
          <span className="mr-3">📝</span>
          Blogs
        </Link>

        {isAdmin && (
          <Link
            href="/admin/experiences"
            className="flex items-center p-3 hover:bg-bg hover:text-black rounded"
          >
            <span className="mr-3">🎟️</span>
            Experience
          </Link>
        )}

        <Link
          href="/admin/users"
          className="flex items-center p-3 hover:bg-bg hover:text-black rounded"
        >
          <span className="mr-3">👥</span>
          Users
        </Link>

        <Link
          href="/admin/settings"
          className="flex items-center p-3 hover:bg-bg hover:text-black rounded"
        >
          <span className="mr-3">⚙️</span>
          Settings
        </Link>
      </nav>

      <div className="mt-8 p-4 rounded-lg bg-foreground/20">
        <p className="text-sm font-medium">Storage Status</p>
        <p className="text-xs mt-1">✓ Firebase Cloud</p>
        <p className="text-xs mt-2 opacity-80">
          All data stored in cloud database
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 w-full p-3 rounded flex items-center justify-center bg-foreground-2 text-fontcolor hover:opacity-90 hover:bg-bg hover:text-black transition"
      >
        <img src="/icons/cross.svg" alt="Logout" className="mr-2 w-5 h-5" />
        Logout
      </button>
    </aside>
  );
}
