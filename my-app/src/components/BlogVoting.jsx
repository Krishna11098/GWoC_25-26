"use client";

import { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { auth } from '@/lib/firebaseClient';

export default function BlogVoting({ blogId, initialUpvotes = 0, initialDownvotes = 0 }) {
  const [user, setUser] = useState(null);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState(null); // 'upvote', 'downvote', or null
  const [loading, setLoading] = useState(false);

  // Listen for auth state changes and fetch vote data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserVote(currentUser);
      }
    });
    return () => unsubscribe();
  }, [blogId]);

  // Fetch vote counts from the blog data
  useEffect(() => {
    async function fetchVoteCounts() {
      try {
        const res = await fetch(`/api/blogs/${blogId}`);
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
  }, [blogId]);

  async function fetchUserVote(currentUser) {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/blogs/${blogId}/vote`, {
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
    if (!user) {
      alert('Please log in to vote');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/blogs/${blogId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        alert(error.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-4 py-4 border-t border-b border-slate-200">
      <button
        onClick={() => handleVote('upvote')}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          userVote === 'upvote'
            ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
            : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 border-2 border-transparent'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <FaThumbsUp className="text-lg" />
        <span className="font-semibold">{upvotes}</span>
      </button>

      <button
        onClick={() => handleVote('downvote')}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          userVote === 'downvote'
            ? 'bg-red-100 text-red-700 border-2 border-red-500'
            : 'bg-slate-100 text-slate-700 hover:bg-red-50 border-2 border-transparent'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <FaThumbsDown className="text-lg" />
        <span className="font-semibold">{downvotes}</span>
      </button>

      {!user && (
        <span className="text-sm text-slate-500 ml-2">
          Log in to vote
        </span>
      )}
    </div>
  );
}
