"use client";

import { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { auth } from "@/lib/firebaseClient";

export default function BlogVoting({
  blogId,
  initialUpvotes = 0,
  initialDownvotes = 0,
}) {
  const [user, setUser] = useState(null);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState(null); // 'upvote', 'downvote', or null
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
        console.error("Error fetching vote counts:", error);
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
      console.error("Error fetching vote:", error);
    }
  }

  async function handleVote(voteType) {
    if (!user) {
      // Encourage login with a gentle message
      setErrorMsg("Please log in to vote");
      return;
    }
    if (loading) return;
    setLoading(true);

    // Optimistic update: calculate new counts locally
    const prev = { upvotes, downvotes, userVote };
    let newUp = upvotes;
    let newDown = downvotes;
    let newUserVote = userVote;

    if (voteType === "upvote") {
      if (userVote === "upvote") {
        newUp = Math.max(0, newUp - 1);
        newUserVote = null;
      } else {
        newUp = newUp + 1;
        if (userVote === "downvote") newDown = Math.max(0, newDown - 1);
        newUserVote = "upvote";
      }
    } else {
      if (userVote === "downvote") {
        newDown = Math.max(0, newDown - 1);
        newUserVote = null;
      } else {
        newDown = newDown + 1;
        if (userVote === "upvote") newUp = Math.max(0, newUp - 1);
        newUserVote = "downvote";
      }
    }

    // Apply optimistic values
    setUpvotes(newUp);
    setDownvotes(newDown);
    setUserVote(newUserVote);

    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/blogs/${blogId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType }),
      });

      if (res.ok) {
        const data = await res.json();
        // reconcile with server response
        setUpvotes(data.upvotes);
        setDownvotes(data.downvotes);
        setUserVote(data.userVote);
        setErrorMsg("");
      } else {
        const error = await res.json();
        setErrorMsg(error.error || "Failed to vote");
        // revert optimistic
        setUpvotes(prev.upvotes);
        setDownvotes(prev.downvotes);
        setUserVote(prev.userVote);
      }
    } catch (error) {
      console.error("Error voting:", error);
      setErrorMsg("Failed to vote");
      setUpvotes(prev.upvotes);
      setDownvotes(prev.downvotes);
      setUserVote(prev.userVote);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
      className="py-4"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleVote("upvote")}
          disabled={loading}
          aria-pressed={userVote === "upvote"}
          title={
            user
              ? userVote === "upvote"
                ? "Remove upvote"
                : "Upvote"
              : "Log in to vote"
          }
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-shadow"
          style={
            userVote === "upvote"
              ? {
                  backgroundColor: "var(--color-green)",
                  color: "var(--color-font)",
                  border: "1px solid var(--color-green)",
                }
              : { backgroundColor: "var(--bg)", color: "var(--color-font)" }
          }
        >
          <FaThumbsUp className="text-lg" />
          <span className="font-semibold">{upvotes}</span>
        </button>

        <button
          onClick={() => handleVote("downvote")}
          disabled={loading}
          aria-pressed={userVote === "downvote"}
          title={
            user
              ? userVote === "downvote"
                ? "Remove downvote"
                : "Downvote"
              : "Log in to vote"
          }
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-shadow"
          style={
            userVote === "downvote"
              ? {
                  backgroundColor: "var(--color-pink)",
                  color: "var(--color-font)",
                  border: "1px solid var(--color-pink)",
                }
              : { backgroundColor: "var(--bg)", color: "var(--color-font)" }
          }
        >
          <FaThumbsDown className="text-lg" />
          <span className="font-semibold">{downvotes}</span>
        </button>

        {!user && (
          <a
            href="/login"
            className="text-sm ml-2"
            style={{ color: "var(--color-font)" }}
          >
            Log in to vote
          </a>
        )}

        {errorMsg && (
          <div
            className="ml-auto text-sm"
            style={{ color: "var(--color-pink)" }}
          >
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
