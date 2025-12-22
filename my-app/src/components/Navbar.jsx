"use client";

<<<<<<< HEAD
import { useState, useContext } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar, Home, LogIn, LogOut, User } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Events", href: "/events", icon: <Calendar className="h-5 w-5" /> },
  ];

  if (user) {
    navItems.push({
      name: "Admin",
      href: "/admin",
      icon: <User className="h-5 w-5" />,
    });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-2">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Joy <span className="text-purple-600">Juncture</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-gray-700 transition-colors hover:text-purple-600"
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 transition-colors hover:text-purple-600"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            ) : (
              <Link
                href="/admin/login"
                className="flex items-center gap-2 text-gray-700 transition-colors hover:text-purple-600"
              >
                <LogIn className="h-5 w-5" />
                <span className="font-medium">Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="space-y-2 pb-4 pt-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}

                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                ) : (
                  <Link
                    href="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    <LogIn className="h-5 w-5" />
                    <span className="font-medium">Admin Login</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
=======
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
  { name: "Events", href: "/events" },
  { name: "Community", href: "/community" },
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
      className={`sticky top-0 z-50 flex justify-center px-5 md:px-12 pt-5 pb-3 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm"
          : "bg-white/60 backdrop-blur-2xl"
      }`}
    >
      <div className="mx-auto mt-4 w-full max-w-6xl px-4 md:px-10">
        <div
          className={`flex items-center gap-5 rounded-2xl border border-white/60 bg-foreground px-6 md:px-10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ${
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
>>>>>>> 8dfdad754552b02a0d2f8c7ab591d3921992848b
  );
};

export default Navbar;
