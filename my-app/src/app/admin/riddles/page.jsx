"use client";

import { useState, useEffect } from "react";
import { userFetch } from "@/lib/userFetch";

export default function AdminRiddlesPage() {
  const [riddles, setRiddles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRiddle, setEditingRiddle] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    solution: "",
    coins: 20,
  });

  useEffect(() => {
    fetchRiddles();
  }, []);

  const fetchRiddles = async () => {
    try {
      setLoading(true);
      const res = await userFetch("/api/admin/riddles");
      if (res.ok) {
        const data = await res.json();
        setRiddles(data);
      } else {
        setError("Failed to fetch riddles");
      }
    } catch (err) {
      setError("Error loading riddles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRiddle = async (e) => {
    e.preventDefault();
    try {
      const res = await userFetch("/api/admin/riddles", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          isVisibleToUser: true,
        }),
      });

      if (res.ok) {
        const newRiddle = await res.json();
        setRiddles([newRiddle, ...riddles]);
        setShowCreateModal(false);
        setFormData({ question: "", solution: "", coins: 20 });
      } else {
        alert("Failed to create riddle");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating riddle");
    }
  };

  const handleUpdateRiddle = async (e) => {
    e.preventDefault();
    try {
      const res = await userFetch(`/api/admin/riddles/${editingRiddle.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedRiddle = await res.json();
        setRiddles(
          riddles.map((r) => (r.id === updatedRiddle.id ? updatedRiddle : r))
        );
        setShowEditModal(false);
        setEditingRiddle(null);
        setFormData({ question: "", solution: "", coins: 20 });
      } else {
        alert("Failed to update riddle");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating riddle");
    }
  };

  const handleToggleVisibility = async (riddleId, currentVisibility) => {
    try {
      const res = await userFetch(`/api/admin/riddles/${riddleId}`, {
        method: "PUT",
        body: JSON.stringify({ isVisibleToUser: !currentVisibility }),
      });

      if (res.ok) {
        const updatedRiddle = await res.json();
        setRiddles(riddles.map((r) => (r.id === riddleId ? updatedRiddle : r)));
      } else {
        alert("Failed to toggle visibility");
      }
    } catch (err) {
      console.error(err);
      alert("Error toggling visibility");
    }
  };

  const handleAddRandomRiddle = async () => {
    try {
      const res = await userFetch("/api/admin/riddles/random", {
        method: "POST",
      });

      if (res.ok) {
        const newRiddle = await res.json();
        setRiddles([newRiddle, ...riddles]);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to add random riddle");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding random riddle");
    }
  };

  const handleDelete = async (riddleId) => {
    if (!confirm("Are you sure you want to delete this riddle?")) return;

    try {
      const res = await userFetch(`/api/admin/riddles/${riddleId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRiddles(riddles.filter((r) => r.id !== riddleId));
      } else {
        alert("Failed to delete riddle");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting riddle");
    }
  };

  const openEditModal = (riddle) => {
    setEditingRiddle(riddle);
    setFormData({
      question: riddle.question,
      solution: riddle.solution,
      coins: riddle.coins,
    });
    setShowEditModal(true);
  };

  const visibleRiddles = riddles.filter((r) => r.isVisibleToUser);
  const invisibleRiddles = riddles.filter((r) => !r.isVisibleToUser);

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderBottomColor: "var(--dark-teal)" }}
            ></div>
            <p className="mt-4 text-dark-teal">Loading riddles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-dark-teal">
                Riddle Management
              </h1>
              <p className="text-dark-teal mt-1">
                Manage all riddles from here
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddRandomRiddle}
                className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform"
                style={{
                  backgroundColor: "var(--light-orange)",
                  color: "var(--dark-teal)",
                }}
              >
                🎲 Add Random Riddle
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform"
                style={{
                  backgroundColor: "var(--dark-teal)",
                }}
              >
                ➕ Create New Riddle
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div
            className="mb-6 p-4 rounded-lg"
            style={{
              backgroundColor: "var(--light-orange)",
              color: "var(--dark-teal)",
            }}
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                style={{ color: "var(--dark-teal)" }}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Visible Riddles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-dark-teal mb-4">
            Visible to Users ({visibleRiddles.length})
          </h2>
          <div className="grid gap-4">
            {visibleRiddles.map((riddle) => (
              <div
                key={riddle.id}
                className="bg-white p-6 rounded-lg shadow-sm border-2 border-dark-teal"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-lg font-medium text-dark-teal mb-2">
                      {riddle.question}
                    </p>
                    <p className="font-semibold text-dark-teal mb-2">
                      Answer: {riddle.solution}
                    </p>
                    <p className="text-sm text-dark-teal">
                      Coins: {riddle.coins} | Riddle #{riddle.riddleNo || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(riddle)}
                      className="px-3 py-1 rounded hover:scale-105 transition-transform text-sm"
                      style={{
                        backgroundColor: "var(--light-blue)",
                        color: "var(--dark-teal)",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleToggleVisibility(
                          riddle.id,
                          riddle.isVisibleToUser
                        )
                      }
                      className="px-3 py-1 rounded hover:scale-105 transition-transform text-sm"
                      style={{
                        backgroundColor: "var(--light-orange)",
                        color: "var(--dark-teal)",
                      }}
                    >
                      Hide
                    </button>
                    <button
                      onClick={() => handleDelete(riddle.id)}
                      className="px-3 py-1 rounded hover:scale-105 transition-transform text-sm"
                      style={{
                        backgroundColor: "var(--light-pink)",
                        color: "var(--dark-teal)",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {visibleRiddles.length === 0 && (
              <p className="text-center py-8 text-dark-teal">
                No visible riddles yet
              </p>
            )}
          </div>
        </div>

        {/* Invisible Riddles */}
        <div>
          <h2 className="text-xl font-semibold text-dark-teal mb-4">
            Hidden Riddles ({invisibleRiddles.length})
          </h2>
          <div className="grid gap-4">
            {invisibleRiddles.map((riddle) => (
              <div
                key={riddle.id}
                className="bg-white p-6 rounded-lg shadow-sm border-2 border-dark-teal"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-lg font-medium text-dark-teal mb-2">
                      {riddle.question}
                    </p>
                    <p className="font-semibold text-dark-teal mb-2">
                      Answer: {riddle.solution}
                    </p>
                    <p className="text-sm text-dark-teal">
                      Coins: {riddle.coins} | Riddle #{riddle.riddleNo || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(riddle)}
                      className="px-3 py-1 rounded hover:scale-105 transition-transform text-sm"
                      style={{
                        backgroundColor: "var(--light-blue)",
                        color: "var(--dark-teal)",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleToggleVisibility(
                          riddle.id,
                          riddle.isVisibleToUser
                        )
                      }
                      className="px-3 py-1 rounded hover:scale-105 transition-transform text-sm"
                      style={{
                        backgroundColor: "var(--light-orange)",
                        color: "var(--dark-teal)",
                      }}
                    >
                      Show
                    </button>
                    <button
                      onClick={() => handleDelete(riddle.id)}
                      className="px-3 py-1 rounded hover:scale-105 transition-transform text-sm"
                      style={{
                        backgroundColor: "var(--light-pink)",
                        color: "var(--dark-teal)",
                      }}
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
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-xl border-2 border-dark-teal">
            <h2 className="text-2xl font-bold mb-6 text-dark-teal">
              Create New Riddle
            </h2>
            <form onSubmit={handleCreateRiddle}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-teal mb-2">
                  Question
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-dark-teal rounded-lg focus:ring-2 focus:ring-dark-teal focus:border-dark-teal"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-teal mb-2">
                  Solution (Answer)
                </label>
                <input
                  type="text"
                  value={formData.solution}
                  onChange={(e) =>
                    setFormData({ ...formData, solution: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-dark-teal rounded-lg focus:ring-2 focus:ring-dark-teal focus:border-dark-teal"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-teal mb-2">
                  Coins Reward
                </label>
                <input
                  type="number"
                  value={formData.coins}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coins: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-dark-teal rounded-lg focus:ring-2 focus:ring-dark-teal focus:border-dark-teal"
                  min="1"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ question: "", solution: "", coins: 20 });
                  }}
                  className="px-4 py-2 border-2 border-dark-teal text-dark-teal rounded-lg hover:bg-light-blue transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-lg hover:scale-105 transition-transform"
                  style={{ backgroundColor: "var(--dark-teal)" }}
                >
                  Create Riddle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingRiddle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-xl border-2 border-dark-teal">
            <h2 className="text-2xl font-bold mb-6 text-dark-teal">
              Edit Riddle
            </h2>
            <form onSubmit={handleUpdateRiddle}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-teal mb-2">
                  Question
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-dark-teal rounded-lg focus:ring-2 focus:ring-dark-teal focus:border-dark-teal"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-teal mb-2">
                  Solution (Answer)
                </label>
                <input
                  type="text"
                  value={formData.solution}
                  onChange={(e) =>
                    setFormData({ ...formData, solution: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-dark-teal rounded-lg focus:ring-2 focus:ring-dark-teal focus:border-dark-teal"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-teal mb-2">
                  Coins Reward
                </label>
                <input
                  type="number"
                  value={formData.coins}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coins: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-dark-teal rounded-lg focus:ring-2 focus:ring-dark-teal focus:border-dark-teal"
                  min="1"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingRiddle(null);
                    setFormData({ question: "", solution: "", coins: 20 });
                  }}
                  className="px-4 py-2 border-2 border-dark-teal text-dark-teal rounded-lg hover:bg-light-blue transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-lg hover:scale-105 transition-transform"
                  style={{ backgroundColor: "var(--dark-teal)" }}
                >
                  Update Riddle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
