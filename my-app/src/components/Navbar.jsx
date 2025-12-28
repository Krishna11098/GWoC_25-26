"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Experiences", href: "/experiences" },
  { name: "Play", href: "/play" },
  { name: "Events", href: "/events/calendar" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || firebaseUser.email,
          uid: firebaseUser.uid,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const isActive = (href) => pathname === href;

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/home");
  };

  const linkClasses = (href) =>
    `relative text-sm font-light tracking-wide text-gray-900/80 hover:text-gray-900 transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-gray-900 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive(href) ? "text-gray-900 after:scale-x-100" : ""
    }`;

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 mt-4 md:mt-6 flex justify-center px-5 md:px-12 py-0 transition-all duration-300 bg-transparent"
      }
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-10">
        <div
          className={`flex items-center gap-5 rounded-2xl border border-white/60 bg-font-2 px-6 md:px-10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ${
            scrolled ? "py-3" : "py-5 md:py-6"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-sm font-semibold text-gray-900">
              JJ
            </span>
            <span className="text-lg font-semibold text-gray-900">
              JoyJuncture
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={linkClasses(link.href)}
              >
                {link.name}
              </Link>
            ))}

            {/* Community dropdown */}
            <div className="relative group">
              <Link href="/community" className={linkClasses("/community")}>
                Community
              </Link>
              <div className="absolute left-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
                <div className="py-2">
                  <Link
                    href="/about-us"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-slate-100"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/community/blog"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-slate-100"
                  >
                    Blogs
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* AUTH ACTIONS */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-3">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900"
                >
                  Welcome {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white"
            onClick={() => setMobileOpen((o) => !o)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
