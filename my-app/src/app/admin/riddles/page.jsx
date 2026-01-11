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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading riddles...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">
                Riddle Management
              </h1>
              <p className="text-gray-600 mt-1">Manage all riddles from here</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddRandomRiddle}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center gap-2"
              >
                🎲 Add Random Riddle
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
              >
                ➕ Create New Riddle
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-600 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Visible Riddles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Visible to Users ({visibleRiddles.length})
          </h2>
          <div className="grid gap-4">
            {visibleRiddles.map((riddle) => (
              <div
                key={riddle.id}
                className="bg-white p-6 rounded-lg shadow-sm border-2 border-green-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {riddle.question}
                    </p>
                    <p className="font-semibold text-gray-700 mb-2">
                      Answer: {riddle.solution}
                    </p>
                    <p className="text-sm text-gray-600">
                      Coins: {riddle.coins} | Riddle #{riddle.riddleNo || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(riddle)}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm"
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
                      className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 text-sm"
                    >
                      Hide
                    </button>
                    <button
                      onClick={() => handleDelete(riddle.id)}
                      className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {visibleRiddles.length === 0 && (
              <p className="text-center py-8 text-gray-500">
                No visible riddles yet
              </p>
            )}
          </div>
        </div>

        {/* Invisible Riddles */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Hidden Riddles ({invisibleRiddles.length})
          </h2>
          <div className="grid gap-4">
            {invisibleRiddles.map((riddle) => (
              <div
                key={riddle.id}
                className="bg-white p-6 rounded-lg shadow-sm border-2 border-orange-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {riddle.question}
                    </p>
                    <p className="text-green-600 font-semibold mb-2">
                      Answer: {riddle.solution}
                    </p>
                    <p className="text-sm text-gray-500">
                      Coins: {riddle.coins} | Riddle #{riddle.riddleNo || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(riddle)}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm"
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
                      className="px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 text-sm"
                    >
                      Show
                    </button>
                    <button
                      onClick={() => handleDelete(riddle.id)}
                      className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 text-sm"
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
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Create New Riddle
            </h2>
            <form onSubmit={handleCreateRiddle}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solution (Answer)
                </label>
                <input
                  type="text"
                  value={formData.solution}
                  onChange={(e) =>
                    setFormData({ ...formData, solution: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Edit Riddle
            </h2>
            <form onSubmit={handleUpdateRiddle}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solution (Answer)
                </label>
                <input
                  type="text"
                  value={formData.solution}
                  onChange={(e) =>
                    setFormData({ ...formData, solution: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
