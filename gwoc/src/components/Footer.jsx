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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
