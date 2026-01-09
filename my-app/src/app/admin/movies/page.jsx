"use client";

import { useState, useEffect } from "react";
import { userFetch } from "@/lib/userFetch";
import Modal from "@/components/Modal";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    clueType: "emoji",
    clueData: "",
    answer: "",
    category: "Hollywood",
    difficulty: "medium",
    hints: "",
    coins: 20,
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  // Modal handling now done inside Modal component

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await userFetch("/api/admin/movies");
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
      } else {
        setError("Failed to fetch movies");
      }
    } catch (err) {
      setError("Error loading movies");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        hints:
          typeof formData.hints === "string"
            ? formData.hints
                .split(",")
                .map((h) => h.trim())
                .filter(Boolean)
            : [],
        isVisibleToUser: true,
      };
      const res = await userFetch("/api/admin/movies", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newMovie = await res.json();
        setMovies([newMovie, ...movies]);
        setShowCreateModal(false);
        setFormData({
          clueType: "emoji",
          clueData: "",
          answer: "",
          category: "Hollywood",
          difficulty: "medium",
          hints: "",
          coins: 20,
        });
      } else {
        alert("Failed to create movie");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating movie");
    }
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        hints:
          typeof formData.hints === "string"
            ? formData.hints
                .split(",")
                .map((h) => h.trim())
                .filter(Boolean)
            : formData.hints,
      };

      const res = await userFetch(`/api/admin/movies/${editingMovie.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        setMovies(movies.map((m) => (m.id === updated.id ? updated : m)));
        setShowEditModal(false);
        setEditingMovie(null);
        setFormData({
          clueType: "emoji",
          clueData: "",
          answer: "",
          category: "Hollywood",
          difficulty: "medium",
          hints: "",
          coins: 20,
        });
      } else {
        alert("Failed to update movie");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating movie");
    }
  };

  const handleToggleVisibility = async (movieId, currentVisibility) => {
    try {
      const res = await userFetch(`/api/admin/movies/${movieId}`, {
        method: "PUT",
        body: JSON.stringify({ isVisibleToUser: !currentVisibility }),
      });

      if (res.ok) {
        const updated = await res.json();
        setMovies(movies.map((m) => (m.id === movieId ? updated : m)));
      } else {
        alert("Failed to toggle visibility");
      }
    } catch (err) {
      console.error(err);
      alert("Error toggling visibility");
    }
  };

  const handleAddRandomMovie = async () => {
    try {
      const res = await userFetch("/api/admin/movies/random", { method: "POST" });
      if (res.ok) {
        const newMovie = await res.json();
        setMovies([newMovie, ...movies]);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to add random movie");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding random movie");
    }
  };

  const handleDelete = async (movieId) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    try {
      const res = await userFetch(`/api/admin/movies/${movieId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMovies(movies.filter((m) => m.id !== movieId));
      } else {
        alert("Failed to delete movie");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting movie");
    }
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setFormData({
      clueType: movie.clueType || "emoji",
      clueData: movie.clueData || "",
      answer: movie.answer || "",
      category: movie.category || "",
      difficulty: movie.difficulty || "medium",
      hints: Array.isArray(movie.hints) ? movie.hints.join(", ") : "",
      coins: movie.coins || 20,
    });
    setShowEditModal(true);
  };

  const visibleMovies = movies.filter((m) => m.isVisibleToUser);
  const invisibleMovies = movies.filter((m) => !m.isVisibleToUser);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] p-8">
        <div className="max-w-6xl mx-auto">
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Movies</h1>
          <div className="flex gap-3">
            <button
              onClick={handleAddRandomMovie}
              className="px-4 py-2 bg-[var(--orange)] rounded-lg"
            >
              Add Random Movie
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[var(--green)] rounded-lg"
            >
              Create New Movie
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-[var(--pink)]/20 border border-[var(--pink)] rounded-lg">
            {error}
          </div>
        )}

        {/* Visible Movies */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Visible to Users ({visibleMovies.length})
          </h2>
          <div className="grid gap-4">
            {visibleMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-[var(--bg)] p-6 rounded-lg shadow-sm border-2 border-[var(--green)]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-sm uppercase tracking-wide opacity-70">
                      {movie.category} • {movie.difficulty}
                    </p>
                    <p className="text-lg font-medium mb-2">
                      Clue ({movie.clueType}): {movie.clueData}
                    </p>
                    <p className="font-semibold mb-2">
                      Answer: {movie.answer}
                    </p>
                    {Array.isArray(movie.hints) && movie.hints.length > 0 && (
                      <p className="text-sm opacity-80 mb-2">
                        Hints: {movie.hints.join(", ")}
                      </p>
                    )}
                    <p className="text-sm">
                      Coins: {movie.coins} | Movie #{movie.movieNo || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(movie)}
                      className="px-3 py-1 bg-[var(--orange)] rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleToggleVisibility(movie.id, movie.isVisibleToUser)
                      }
                      className="px-3 py-1 bg-[var(--green)] rounded text-sm"
                    >
                      Hide
                    </button>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="px-3 py-1 bg-[var(--pink)] rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {visibleMovies.length === 0 && (
              <p className="text-center py-8">No visible movies yet</p>
            )}
          </div>
        </div>

        {/* Invisible Movies */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Hidden Movies ({invisibleMovies.length})
          </h2>
          <div className="grid gap-4">
            {invisibleMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-[var(--bg)] p-6 rounded-lg shadow-sm border-2 border-[var(--orange)]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-sm uppercase tracking-wide opacity-70">
                      {movie.category} • {movie.difficulty}
                    </p>
                    <p className="text-lg font-medium mb-2">
                      Clue ({movie.clueType}): {movie.clueData}
                    </p>
                    <p className="text-[var(--green)] font-semibold mb-2">
                      Answer: {movie.answer}
                    </p>
                    {Array.isArray(movie.hints) && movie.hints.length > 0 && (
                      <p className="text-sm opacity-80 mb-2">
                        Hints: {movie.hints.join(", ")}
                      </p>
                    )}
                    <p className="text-sm text-[var(--font)]/70">
                      Coins: {movie.coins} | Movie #{movie.movieNo || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(movie)}
                      className="px-3 py-1 bg-[var(--orange)] rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleToggleVisibility(movie.id, movie.isVisibleToUser)
                      }
                      className="px-3 py-1 bg-[var(--green)] rounded text-sm"
                    >
                      Show
                    </button>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="px-3 py-1 bg-[var(--pink)] rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        open={showCreateModal}
        title="Create New Movie"
        onClose={() => {
          setShowCreateModal(false);
          setFormData({
            clueType: "emoji",
            clueData: "",
            answer: "",
            category: "Hollywood",
            difficulty: "medium",
            hints: "",
            coins: 20,
          });
        }}
      >
        <form onSubmit={handleCreateMovie}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Clue Type</label>
                  <select
                    value={formData.clueType}
                    onChange={(e) => setFormData({ ...formData, clueType: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--green)] rounded-lg bg-[var(--bg)]"
                  >
                    <option value="emoji">Emoji</option>
                    <option value="dialogue">Dialogue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--green)] rounded-lg bg-[var(--bg)]"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Clue Data</label>
                <textarea
                  value={formData.clueData}
                  onChange={(e) => setFormData({ ...formData, clueData: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--green)] rounded-lg focus:ring-2 focus:ring-[var(--orange)] bg-[var(--bg)]"
                  rows="3"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Answer</label>
                <input
                  type="text"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--green)] rounded-lg bg-[var(--bg)]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--green)] rounded-lg bg-[var(--bg)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Coins Reward</label>
                  <input
                    type="number"
                    value={formData.coins}
                    onChange={(e) => setFormData({ ...formData, coins: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-[var(--green)] rounded-lg bg-[var(--bg)]"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Hints (comma separated)</label>
                <input
                  type="text"
                  value={formData.hints}
                  onChange={(e) => setFormData({ ...formData, hints: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--green)] rounded-lg bg-[var(--bg)]"
                  placeholder="e.g. Space, Nolan, Time"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      clueType: "emoji",
                      clueData: "",
                      answer: "",
                      category: "Hollywood",
                      difficulty: "medium",
                      hints: "",
                      coins: 20,
                    });
                  }}
                  className="px-4 py-2 bg-[var(--pink)] text-[var(--font)] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--green)] text-[var(--font)] rounded-lg"
                >
                  Create Movie
                </button>
              </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={showEditModal && !!editingMovie}
        title="Edit Movie"
        onClose={() => {
          setShowEditModal(false);
          setEditingMovie(null);
          setFormData({
            clueType: "emoji",
            clueData: "",
            answer: "",
            category: "Hollywood",
            difficulty: "medium",
            hints: "",
            coins: 20,
          });
        }}
      >
        <form onSubmit={handleUpdateMovie}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Clue Type</label>
                  <select
                    value={formData.clueType}
                    onChange={(e) => setFormData({ ...formData, clueType: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--green)] rounded-lg bg-[var(--bg)]"
                  >
                    <option value="emoji">Emoji</option>
                    <option value="dialogue">Dialogue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--green)] rounded-lg bg-[var(--bg)]"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Clue Data</label>
                <textarea
                  value={formData.clueData}
                  onChange={(e) => setFormData({ ...formData, clueData: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--green)] rounded-lg bg-[var(--bg)]"
                  rows="3"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Answer</label>
                <input
                  type="text"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--green)] rounded-lg bg-[var(--bg)]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--green)] rounded-lg bg-[var(--bg)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Coins Reward</label>
                  <input
                    type="number"
                    value={formData.coins}
                    onChange={(e) => setFormData({ ...formData, coins: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-[var(--green)] rounded-lg bg-[var(--bg)]"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Hints (comma separated)</label>
                <input
                  type="text"
                  value={formData.hints}
                  onChange={(e) => setFormData({ ...formData, hints: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--green)] rounded-lg bg-[var(--bg)]"
                  placeholder="e.g. Space, Nolan, Time"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMovie(null);
                    setFormData({
                      clueType: "emoji",
                      clueData: "",
                      answer: "",
                      category: "Hollywood",
                      difficulty: "medium",
                      hints: "",
                      coins: 20,
                    });
                  }}
                  className="px-4 py-2 bg-[var(--pink)] text-[var(--font)] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--green)] text-[var(--font)] rounded-lg"
                >
                  Update Movie
                </button>
              </div>
        </form>
      </Modal>
    </div>
  );
}
