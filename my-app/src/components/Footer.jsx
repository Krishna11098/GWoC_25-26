<<<<<<< HEAD
"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-2">
                <Heart className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">
                Joy <span className="text-purple-400">Juncture</span>
              </span>
            </div>
            <p className="text-gray-400">
              Creating meaningful connections through events that spread joy and
              build community.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="mb-6 text-lg font-bold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-400" />
                <span className="text-gray-400">hello@joyjuncture.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-purple-400" />
                <span className="text-gray-400">(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-purple-400" />
                <span className="text-gray-400">123 Joy Street, City</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="mb-6 text-lg font-bold">Quick Links</h3>
            <div className="space-y-3">
              {[
                "Upcoming Events",
                "Past Events",
                "Community Partners",
                "Become a Partner",
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-gray-400 transition-colors hover:text-white"
                >
                  {link}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="mb-6 text-lg font-bold">Follow Us</h3>
            <div className="flex gap-4">
              {[
                { icon: <Instagram className="h-6 w-6" />, label: "Instagram" },
                { icon: <Facebook className="h-6 w-6" />, label: "Facebook" },
                { icon: <Twitter className="h-6 w-6" />, label: "Twitter" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="rounded-full bg-gray-800 p-3 transition-colors hover:bg-purple-600"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Subscribe to our newsletter for updates
            </p>
            <div className="mt-4 flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-l-lg bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:outline-none"
              />
              <button className="rounded-r-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-medium">
                Join
              </button>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Joy Juncture. All rights reserved.</p>
=======

export default function Footer() {
  const links = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Experiences", href: "/experiences" },
    { label: "Play", href: "/play" },
    { label: "Events", href: "/events" },
    { label: "Community", href: "/community" },
  ];

  return (
    <footer className="border-t border-gray-200 bg-foreground backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 md:flex-row md:items-start md:justify-between md:py-12">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-sm font-semibold text-gray-900 shadow-sm">
              JJ
            </span>
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              JoyJuncture
            </span>
          </div>
          <p className="max-w-sm text-sm text-gray-600">
            Crafted experiences, joyful connections, and premium play for
            communities everywhere.
          </p>
        </div>

        <div className="grid flex-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-900">Navigate</h3>
            <nav className="flex flex-col gap-2 text-sm text-gray-600">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors duration-200 hover:text-gray-900"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <span>hello@joyjuncture.com</span>
              <span>+1 (555) 123-4567</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-900">Follow</h3>
            <div className="flex gap-3 text-sm text-gray-600">
              <a
                href="#"
                className="transition-colors duration-200 hover:text-gray-900"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="transition-colors duration-200 hover:text-gray-900"
              >
                Instagram
              </a>
              <a
                href="#"
                className="transition-colors duration-200 hover:text-gray-900"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-white/90">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-4 text-xs text-gray-500 md:flex-row md:justify-between">
          <span>
            © {new Date().getFullYear()} JoyJuncture. All rights reserved.
          </span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-700">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-700">
              Terms
            </a>
          </div>
>>>>>>> 8dfdad754552b02a0d2f8c7ab591d3921992848b
        </div>
      </div>
    </footer>
  );
<<<<<<< HEAD
};

export default Footer;
=======
}
>>>>>>> 8dfdad754552b02a0d2f8c7ab591d3921992848b
