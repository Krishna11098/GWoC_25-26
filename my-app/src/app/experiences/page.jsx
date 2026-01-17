"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Cake,
  Building2,
  Package,
  FerrisWheel,
  Heart,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Mail,
  Phone,
  MessageCircle
} from "lucide-react";

const CATEGORIES = [
  {
    id: "private_birthdays",
    label: "Private Birthdays",
    icon: Cake,
    colorVar: "--color-pink",
    bgColor: "from-pink-400 to-rose-500",
    description: "Unforgettable birthday celebrations tailored just for you",
  },
  {
    id: "corporate_events",
    label: "Corporate Events",
    icon: Building2,
    colorVar: "--color-green",
    bgColor: "from-emerald-400 to-teal-500",
    description: "Professional team building and corporate experiences",
  },
  {
    id: "monthly_kits",
    label: "Monthly Kits",
    icon: Package,
    colorVar: "--color-orange",
    bgColor: "from-orange-400 to-amber-500",
    description: "Curated monthly activity kits delivered to your door",
  },
  {
    id: "carnivals",
    label: "Carnivals",
    icon: FerrisWheel,
    colorVar: "--color-pink",
    bgColor: "from-purple-400 to-pink-500",
    description: "Vibrant carnival experiences with games and entertainment",
  },
  {
    id: "weddings",
    label: "Weddings",
    icon: Heart,
    colorVar: "--color-green",
    bgColor: "from-rose-400 to-red-500",
    description: "Magical wedding celebrations and special moments",
  },
  {
    id: "workshops",
    label: "Workshops",
    icon: GraduationCap,
    colorVar: "--color-blue",
    bgColor: "from-blue-400 to-indigo-500",
    description: "Interactive learning experiences and skill workshops",
  },
];

export default function ExperiencesLanding() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-[#f5f5f0] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="text-gray-800">Our</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--dark-teal)] to-[var(--green)]">
                Experiences
              </span>
            </h1>
            <div className="flex justify-center mb-6">
              <div className="h-2 w-24 bg-gradient-to-r from-[var(--orange)] to-[var(--pink)] rounded-full"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Curated live experiences, games and engagement formats designed to create unforgettable moments
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                Explore by Theme
              </h2>
              <Link
                href="/experiences/events"
                className="group flex items-center gap-2 text-lg font-semibold text-[var(--dark-teal)] hover:text-[var(--green)] transition-colors"
              >
                See all
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {CATEGORIES.map((category, index) => {
                const IconComponent = category.icon;

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onMouseEnter={() => setHoveredCard(category.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Link
                      href={`/experiences/events?category=${category.id}`}
                      className="block group"
                    >
                      <div className={`
                        relative overflow-hidden rounded-3xl bg-white border-2 border-gray-200
                        shadow-lg hover:shadow-2xl transition-all duration-500 h-full
                        ${hoveredCard === category.id ? 'scale-105 border-[var(--dark-teal)]' : ''}
                      `}>
                        {/* Gradient Background */}
                        <div className={`
                          absolute inset-0 bg-gradient-to-br ${category.bgColor} opacity-10
                          group-hover:opacity-20 transition-opacity duration-500
                        `}></div>

                        {/* Content */}
                        <div className="relative p-8 flex flex-col h-full min-h-[280px]">
                          {/* Icon */}
                          <div className={`
                            w-20 h-20 rounded-2xl bg-gradient-to-br ${category.bgColor}
                            flex items-center justify-center mb-6 shadow-lg
                            group-hover:scale-110 transition-transform duration-500
                          `}>
                            <IconComponent className="text-white" size={36} />
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[var(--dark-teal)] transition-colors">
                            {category.label}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                            {category.description}
                          </p>

                          {/* Arrow */}
                          <div className="flex items-center text-[var(--dark-teal)] font-semibold group-hover:gap-3 gap-2 transition-all">
                            <span>Explore</span>
                            <ArrowRight
                              className="group-hover:translate-x-2 transition-transform"
                              size={20}
                            />
                          </div>
                        </div>

                        {/* Decorative corner */}
                        <div className={`
                          absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.bgColor}
                          opacity-5 rounded-bl-full transform translate-x-16 -translate-y-16
                          group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500
                        `}></div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Custom Experiences CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--dark-teal)] to-[var(--green)] p-12 md:p-16 shadow-2xl"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

            <div className="relative z-10">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-white" size={32} />
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Want to Create Custom Experiences?
                  </h2>
                  <p className="text-xl text-white/90 leading-relaxed">
                    Personalized, beautiful moments tailored to your vision with JoyJuncture.
                  </p>
                </div>
              </div>

              <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-4xl">
                Whether it's a private celebration, corporate team-building, wedding, or a unique gathering,
                our expert team designs unforgettable moments. Contact us to bring your vision to life with
                our curated experiences, games, and entertainment.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:contact@joyjuncture.com"
                  className="group px-8 py-4 bg-white text-[var(--dark-teal)] rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
                >
                  <Mail size={20} />
                  Email Us
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </a>
                <a
                  href="tel:+91-XXXXXXXXXX"
                  className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
                >
                  <Phone size={20} />
                  Call Us
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </a>
                <a
                  href="/contact"
                  className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
                >
                  <MessageCircle size={20} />
                  Get In Touch
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
      <Footer />
    </>
  );
}
