"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { auth } from '@/lib/firebaseClient';

export default function BlogCard({ post, index, hero = false, showVotes = true }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [user, setUser] = useState(null);
  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [downvotes, setDownvotes] = useState(post.downvotes || 0);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Listen for auth state changes (only when votes are shown)
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

  // Fetch vote counts from the blog data (only when votes are shown)
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
        console.error('Error fetching vote counts:', error);
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
      console.error('Error fetching vote:', error);
    }
  }

  async function handleVote(voteType) {
    if (!showVotes) return;
    if (!user) {
      alert('Please log in to vote');
      return;
    }

    if (loading || !post.id) return;
    setLoading(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/blogs/${post.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('BlogCard: Vote successful:', { upvotes: data.upvotes, downvotes: data.downvotes });
        setUpvotes(data.upvotes);
        setDownvotes(data.downvotes);
        setUserVote(data.userVote);
      } else {
        const error = await res.json();
        console.error('BlogCard: Vote failed:', error);
        alert(error.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote');
    } finally {
      setLoading(false);
    }
  }

  const isEven = index % 2 === 1; // 0-based: even-indexed visually right image

  return (
    <article
      ref={ref}
      className={`relative rounded-3xl bg-white/90 border border-slate-200 shadow-sm transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${hero ? 'p-0 pb-6 md:pb-8 overflow-hidden' : 'p-4 md:p-6'}`}
    >
      {hero ? (
        <>
          <div className="w-full">
            <div className="w-full h-64 md:h-80 overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.title || 'Image'} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="p-4 md:p-5">
              {post.title && <h3 className="text-xl md:text-2xl font-bold text-slate-900">{post.title}</h3>}
              {post.description && <p className="mt-2 text-slate-700 text-sm">{post.description}</p>}
            </div>

            {/* Votes positioned bottom-right */}
            {showVotes && post.id && (
              <div className="absolute right-4 bottom-4 flex items-center gap-3">
                <button
                  onClick={() => handleVote('upvote')}
                  disabled={loading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    userVote === 'upvote'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-500'
                      : 'bg-white/90 text-slate-700 hover:bg-emerald-50 border border-transparent'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <FaThumbsUp className="text-sm" />
                  <span className="font-semibold text-sm">{upvotes}</span>
                </button>

                <button
                  onClick={() => handleVote('downvote')}
                  disabled={loading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    userVote === 'downvote'
                      ? 'bg-red-100 text-red-700 border border-red-500'
                      : 'bg-white/90 text-slate-700 hover:bg-red-50 border border-transparent'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <FaThumbsDown className="text-sm" />
                  <span className="font-semibold text-sm">{downvotes}</span>
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          className={`flex flex-col ${post.image ? 'md:flex-row items-start md:items-center gap-6 md:gap-10' : ''} ${
            post.image && isEven ? 'md:flex-row-reverse' : ''
          }`}
        >
          {/* Image - only show if exists */}
          {post.image && (
            <div className="w-full md:w-1/2">
              <div className="aspect-video rounded-3xl overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.title || 'Blog image'} className="h-full w-full object-cover" loading="lazy" />
              </div>
            </div>
          )}

          {/* Content */}
          <div className={post.image ? 'w-full md:w-1/2' : 'w-full'}>
            {post.category && (
              <span className="inline-block rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {post.category}
              </span>
            )}
            {post.title && (
              <h3 className={`text-2xl md:text-3xl font-bold text-slate-900 ${post.category ? 'mt-3' : ''}`}>
                {post.title}
              </h3>
            )}
            <p className={`text-slate-700 ${post.title ? 'mt-2' : ''}`}>{post.description}</p>

            {/* Vote Buttons */}
            {showVotes && post.id && (
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => handleVote('upvote')}
                  disabled={loading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    userVote === 'upvote'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-500'
                      : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 border border-transparent'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <FaThumbsUp className="text-sm" />
                  <span className="font-semibold text-sm">{upvotes}</span>
                </button>

                <button
                  onClick={() => handleVote('downvote')}
                  disabled={loading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    userVote === 'downvote'
                      ? 'bg-red-100 text-red-700 border border-red-500'
                      : 'bg-slate-100 text-slate-700 hover:bg-red-50 border border-transparent'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <FaThumbsDown className="text-sm" />
                  <span className="font-semibold text-sm">{downvotes}</span>
                </button>
              </div>
            )}

            {post.href && post.href !== '#' && (
              <Link href={post.href} className="mt-3 inline-block text-emerald-600 hover:text-emerald-700 font-medium">
                Read the full story
              </Link>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
