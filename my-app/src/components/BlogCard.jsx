"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { auth } from "@/lib/firebaseClient";

export default function BlogCard({
  post,
  index,
  hero = false,
  showVotes = true,
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [user, setUser] = useState(null);
  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [downvotes, setDownvotes] = useState(post.downvotes || 0);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setInView(true);
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showVotes) return undefined;
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser && post.id) {
        fetchUserVote(currentUser);
      }
    });
    return () => unsubscribe && unsubscribe();
  }, [post.id, showVotes]);

  useEffect(() => {
    if (!showVotes || !post.id) return;
    async function fetchVoteCounts() {
      try {
        const res = await fetch(`/api/blogs/${post.id}`);
        if (res.ok) {
          const blog = await res.json();
          setUpvotes(blog.upvotes || 0);
          setDownvotes(blog.downvotes || 0);
        }
      } catch (error) {
        console.error("Error fetching vote counts:", error);
      }
    }
    fetchVoteCounts();
  }, [post.id, showVotes]);

  async function fetchUserVote(currentUser) {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/blogs/${post.id}/vote`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUserVote(data.userVote);
    } catch (error) {
      console.error("Error fetching vote:", error);
    }
  }

  async function handleVote(voteType) {
    if (!showVotes) return;
    if (!user) {
      alert("Please log in to vote");
      return;
    }

    if (loading || !post.id) return;
    setLoading(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/blogs/${post.id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType }),
      });

      if (res.ok) {
        const data = await res.json();
        setUpvotes(data.upvotes);
        setDownvotes(data.downvotes);
        setUserVote(data.userVote);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to vote");
    } finally {
      setLoading(false);
    }
  }

  const isEven = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white border-2 border-gray-100 hover:border-[var(--dark-teal)] ${hero ? "p-0" : "p-0"
        }`}
    >
      {hero ? (
        <>
          <div className="w-full">
            <div className="w-full h-64 md:h-80 overflow-hidden relative group">
              <motion.img
                src={post.image}
                alt={post.title || "Image"}
                className="w-full h-full object-cover"
                loading="lazy"
                animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="p-6 md:p-8">
              {post.title && (
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h3>
              )}
              {post.description && (
                <p className="text-gray-600 leading-relaxed">
                  {post.description}
                </p>
              )}
            </div>

            {showVotes && post.id && (
              <div className="absolute right-6 bottom-6 flex items-center gap-3">
                <button
                  onClick={() => handleVote("upvote")}
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
                    } ${userVote === "upvote"
                      ? "bg-[var(--dark-teal)] text-white shadow-lg"
                      : "bg-white text-gray-700 border-2 border-gray-200"
                    }`}
                >
                  <FaThumbsUp />
                  <span>{upvotes}</span>
                </button>

                <button
                  onClick={() => handleVote("downvote")}
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
                    } ${userVote === "downvote"
                      ? "bg-red-500 text-white shadow-lg"
                      : "bg-white text-gray-700 border-2 border-gray-200"
                    }`}
                >
                  <FaThumbsDown />
                  <span>{downvotes}</span>
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          className={`flex flex-col min-h-[400px] ${post.image
            ? "md:flex-row items-stretch gap-0"
            : ""
            } ${post.image && isEven ? "md:flex-row-reverse" : ""}`}
        >
          {/* Image */}
          {post.image && (
            <div className="w-full md:w-2/5 relative overflow-hidden group">
              <motion.img
                src={post.image}
                alt={post.title || "Blog image"}
                className="h-full w-full object-cover"
                style={{ minHeight: "400px" }}
                loading="lazy"
                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--dark-teal)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {post.category && (
                <div className="absolute top-4 left-4">
                  <span className="inline-block rounded-full px-4 py-2 text-sm font-bold bg-white text-[var(--dark-teal)] shadow-lg">
                    {post.category}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className={`${post.image ? "w-full md:w-3/5" : "w-full"} p-8 md:p-10 flex flex-col justify-between min-h-[400px]`}>
            <div>
              {!post.image && post.category && (
                <span className="inline-block rounded-full px-4 py-2 text-sm font-bold bg-[var(--light-orange)] text-[var(--dark-teal)] mb-4">
                  {post.category}
                </span>
              )}

              {post.title && (
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {post.title}
                </h3>
              )}

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {post.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              {/* Read More Link */}
              {post.href && post.href !== "#" && (
                <Link
                  href={post.href}
                  className="group inline-flex items-center gap-2 text-[var(--dark-teal)] font-bold text-lg hover:gap-3 transition-all"
                >
                  Read the full story
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              )}

              {/* Vote Buttons */}
              {showVotes && post.id && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleVote("upvote")}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
                      } ${userVote === "upvote"
                        ? "bg-[var(--dark-teal)] text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <FaThumbsUp />
                    <span>{upvotes}</span>
                  </button>

                  <button
                    onClick={() => handleVote("downvote")}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
                      } ${userVote === "downvote"
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <FaThumbsDown />
                    <span>{downvotes}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.article>
  );
}
