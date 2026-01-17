"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SoftWaveBackground from "@/components/SoftWaveBackground";
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
  MessageCircle,
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
      <main className="min-h-screen relative">
        <SoftWaveBackground height="400px" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="inline-flex flex-col items-center gap-2"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
                <span style={{ color: "var(--black)" }}>Explore</span>{" "}
                <span
                  className="relative inline-block drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
                  style={{ color: "var(--dark-teal)" }}
                >
                  Experiences
                </span>
              </h1>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-2 rounded-full mt-6 shadow-md"
                style={{ backgroundColor: "var(--dark-teal)" }}
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 text-lg md:text-xl font-medium"
              style={{ color: "var(--dark-teal)" }}
            >
              Curated live experiences, games and engagement formats designed to
              create unforgettable moments
            </motion.p>
          </motion.div>

          {/* Categories Grid */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mb-12"
            >
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold"
                style={{ color: "var(--dark-teal)" }}
              >
                Explore by Theme
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Link
                  href="/experiences/events"
                  className="group flex items-center gap-2 text-lg font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: "var(--dark-teal)" }}
                >
                  See all
                  <ArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={20}
                  />
                </Link>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
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
                      <div
                        className={`
                        relative overflow-hidden rounded-3xl border-2
                        shadow-lg hover:shadow-2xl transition-all duration-500 h-80 w-full flex flex-col
                        ${hoveredCard === category.id ? "scale-105" : ""}
                      `}
                        style={{
                          backgroundColor: [
                            "var(--light-blue)",
                            "var(--light-orange)",
                            "var(--light-pink)",
                          ][index % 3],
                          borderColor:
                            hoveredCard === category.id
                              ? "var(--dark-teal)"
                              : "transparent",
                        }}
                      >
                        {/* Content */}
                        <div className="relative p-6 flex flex-col h-full justify-between">
                          {/* Icon */}
                          <div
                            className={`
                            w-16 h-16 rounded-2xl
                            flex items-center justify-center mb-4 shadow-lg
                            group-hover:scale-110 transition-transform duration-500
                          `}
                            style={{ backgroundColor: "var(--dark-teal)" }}
                          >
                            <IconComponent className="text-white" size={28} />
                          </div>

                          {/* Title */}
                          <h3
                            className="text-xl font-bold mb-2 transition-colors"
                            style={{ color: "var(--dark-teal)" }}
                          >
                            {category.label}
                          </h3>

                          {/* Description */}
                          <p
                            className="text-lg leading-snug flex-1"
                            style={{ color: "var(--font)" }}
                          >
                            {category.description}
                          </p>

                          {/* Arrow */}
                          <div
                            className="flex items-center font-semibold group-hover:gap-3 gap-2 transition-all"
                            style={{ color: "var(--dark-teal)" }}
                          >
                            <span>Explore</span>
                            <ArrowRight
                              className="group-hover:translate-x-2 transition-transform"
                              size={20}
                            />
                          </div>
                        </div>
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl p-12 md:p-16 shadow-2xl"
            style={{
              backgroundColor: "var(--bg)",
              border: "2px solid var(--light-blue)",
            }}
          >
            {/* Decorative elements */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-32 translate-x-32"
              style={{ backgroundColor: "var(--light-orange)", opacity: 0.1 }}
            ></div>
            <div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-24 -translate-x-24"
              style={{ backgroundColor: "var(--light-pink)", opacity: 0.1 }}
            ></div>

            <div className="relative z-10">
              <div className="flex items-start gap-6 mb-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "var(--dark-teal)" }}
                >
                  <Sparkles className="text-white" size={32} />
                </div>
                <div>
                  <h2
                    className="text-4xl md:text-5xl font-bold mb-4"
                    style={{ color: "var(--dark-teal)" }}
                  >
                    Want to Create Custom Experiences?
                  </h2>
                  <p
                    className="text-xl leading-relaxed"
                    style={{ color: "var(--font)" }}
                  >
                    Personalized, beautiful moments tailored to your vision with
                    JoyJuncture.
                  </p>
                </div>
              </div>

              <p
                className="text-lg mb-10 leading-relaxed max-w-4xl"
                style={{ color: "var(--font)" }}
              >
                Whether it's a private celebration, corporate team-building,
                wedding, or a unique gathering, our expert team designs
                unforgettable moments. Contact us to bring your vision to life
                with our curated experiences, games, and entertainment.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="mailto:contact@joyjuncture.com"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="group px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
                  style={{
                    backgroundColor: "var(--dark-teal)",
                    color: "white",
                  }}
                >
                  <Mail size={20} />
                  Email Us
                  <ArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </motion.a>
                <motion.a
                  href="tel:+91-XXXXXXXXXX"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="group px-8 py-4 border-2 rounded-xl font-bold hover:opacity-90 transition-all duration-300 flex items-center gap-3"
                  style={{
                    borderColor: "var(--light-blue)",
                    backgroundColor: "transparent",
                    color: "var(--dark-teal)",
                  }}
                >
                  <Phone size={20} />
                  Call Us
                  <ArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </motion.a>
                <motion.a
                  href="/contact"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="group px-8 py-4 border-2 rounded-xl font-bold hover:opacity-90 transition-all duration-300 flex items-center gap-3"
                  style={{
                    borderColor: "var(--light-orange)",
                    backgroundColor: "transparent",
                    color: "var(--dark-teal)",
                  }}
                >
                  <MessageCircle size={20} />
                  Get In Touch
                  <ArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
