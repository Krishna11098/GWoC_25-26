"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";

const navLinks = [
  { name: "Home", href: "/home" },
  { name: "Shop", href: "/shop" },
  { name: "Experiences", href: "/experiences" },
  { name: "Events", href: "/events" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);
  const [communityDropdownClicked, setCommunityDropdownClicked] = useState(false);
  const [playDropdownOpen, setPlayDropdownOpen] = useState(false);
  const [playDropdownClicked, setPlayDropdownClicked] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (communityDropdownClicked) {
        const dropdown = document.getElementById("community-dropdown");
        if (dropdown && !dropdown.contains(event.target)) {
          setCommunityDropdownOpen(false);
          setCommunityDropdownClicked(false);
        }
      }
      if (playDropdownClicked) {
        const dropdown = document.getElementById("play-dropdown");
        if (dropdown && !dropdown.contains(event.target)) {
          setPlayDropdownOpen(false);
          setPlayDropdownClicked(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [communityDropdownClicked, playDropdownClicked]);

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
    `relative text-sm font-light tracking-wide text-white hover:text-gray-900 transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-gray-900 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
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
          className={`flex items-center rounded-2xl border border-white/60 bg-font shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 text-bg ${
            scrolled ? "py-0" : "py-1 md:py-1.5"
          }`}
        >
          {/* Logo Div */}
          <div className="flex items-center justify-center m-0 p-0 pl-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo3.png"
                alt="JoyJuncture logo"
                width={60}
                height={60}
                priority
                className="h-22 w-22 object-contain"
              />
            </Link>
          </div>

          {/* Rest of Content */}
          <div className="flex items-center flex-1 gap-5 px-6 md:px-10">
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
              <div
                id="community-dropdown"
                className="relative group"
                onMouseEnter={() => {
                  if (!communityDropdownClicked) setCommunityDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  if (!communityDropdownClicked)
                    setCommunityDropdownOpen(false);
                }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const newClickedState = !communityDropdownClicked;
                    setCommunityDropdownClicked(newClickedState);
                    setCommunityDropdownOpen(newClickedState);
                  }}
                  className={linkClasses("/community")}
                >
                  Community
                </button>
                <div
                  className={`absolute left-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-md transition-opacity duration-200 ${
                    communityDropdownOpen
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                  onMouseEnter={() => setCommunityDropdownOpen(true)}
                  onMouseLeave={() => {
                    if (!communityDropdownClicked)
                      setCommunityDropdownOpen(false);
                  }}
                >
                  <div className="py-2">
                    <Link
                      href="/about-us"
                      onClick={() => {
                        setCommunityDropdownOpen(false);
                        setCommunityDropdownClicked(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-slate-100"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/community/blog"
                      onClick={() => {
                        setCommunityDropdownOpen(false);
                        setCommunityDropdownClicked(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-slate-100"
                    >
                      Blogs
                    </Link>
                  </div>
                </div>
              </div>

              {/* Play dropdown */}
              <div
                id="play-dropdown"
                className="relative group"
                onMouseEnter={() => {
                  if (!playDropdownClicked) setPlayDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  if (!playDropdownClicked) setPlayDropdownOpen(false);
                }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const newClickedState = !playDropdownClicked;
                    setPlayDropdownClicked(newClickedState);
                    setPlayDropdownOpen(newClickedState);
                  }}
                  className={linkClasses("/play")}
                >
                  Play
                </button>
                <div
                  className={`absolute left-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-md transition-opacity duration-200 ${
                    playDropdownOpen
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                  onMouseEnter={() => setPlayDropdownOpen(true)}
                  onMouseLeave={() => {
                    if (!playDropdownClicked) setPlayDropdownOpen(false);
                  }}
                >
                  <div className="py-2">
                    <Link
                      href="/play"
                      onClick={() => {
                        setPlayDropdownOpen(false);
                        setPlayDropdownClicked(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-slate-100"
                    >
                      Play Hub
                    </Link>
                    <Link
                      href="/games"
                      onClick={() => {
                        setPlayDropdownOpen(false);
                        setPlayDropdownClicked(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-slate-100"
                    >
                      Games
                    </Link>
                    <Link
                      href="/sudoku"
                      onClick={() => {
                        setPlayDropdownOpen(false);
                        setPlayDropdownClicked(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-slate-100"
                    >
                      Sudoku
                    </Link>
                    <Link
                      href="/riddles"
                      onClick={() => {
                        setPlayDropdownOpen(false);
                        setPlayDropdownClicked(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-slate-100"
                    >
                      Riddles
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
                    className="rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-100"
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
      </div>
    </header>
  );
};

export default Navbar;
