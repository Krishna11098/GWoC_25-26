"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href) => pathname === href;

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
          className={`flex items-center gap-5 rounded-2xl border border-white/60 bg-white/90 px-6 md:px-10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ${
            scrolled ? "py-3" : "py-5 md:py-6"
          }`}
        >
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-sm font-semibold text-gray-900 shadow-sm">
              JJ
            </span>
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              JoyJuncture
            </span>
          </Link>

          <nav className="hidden md:flex flex-1 items-center justify-center gap-8 lg:gap-10">
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

          <div className="hidden md:flex flex-1 items-center justify-end gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-[1px]"
            >
              <span>Login / Profile</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </Link>
          </div>

          <button
            className="md:hidden ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white transition-all duration-200"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            <div className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                  mobileOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-[1.5px] w-full bg-current transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : "-translate-y-1/2"
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                  mobileOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-x-0 top-0 z-40 bg-white/95 backdrop-blur-2xl transition-all duration-300 ease-out ${
          mobileOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-6 pt-20 pb-12 space-y-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block text-lg font-light tracking-wide text-gray-900/90 transition-colors duration-200 ${
                isActive(link.href) ? "text-gray-900" : "hover:text-gray-950"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="block text-lg font-light tracking-wide text-gray-900/90 hover:text-gray-950 transition-colors duration-200"
            onClick={() => setMobileOpen(false)}
          >
            Login / Profile
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
