"use client";

import { useState, useEffect } from "react";
import productService from "@/app/lib/productService";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    regularPrice: 0,
    description: "",
    longDescription: "",
    category: "",
    ageGroup: "",
    numberOfPlayers: "",
    stockAvailable: 0,
    isFeatured: false,
    coinsReward: 0,
    howToPlay: [],
    keyFeatures: [],
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      regularPrice: 0,
      description: "",
      longDescription: "",
      category: "",
      ageGroup: "",
      numberOfPlayers: "",
      stockAvailable: 0,
      isFeatured: false,
      coinsReward: 0,
      howToPlay: [],
      keyFeatures: [],
    });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name || "",
      price: product.price || 0,
      regularPrice: product.regularPrice || 0,
      description: product.description || "",
      longDescription: product.longDescription || "",
      category: product.category || "",
      ageGroup: product.ageGroup || "",
      numberOfPlayers: product.numberOfPlayers || "",
      stockAvailable: product.stockAvailable || 0,
      isFeatured: product.isFeatured || false,
      coinsReward: product.coinsReward || 0,
      howToPlay: product.howToPlay || [],
      keyFeatures: product.keyFeatures || [],
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct, formData);
        alert("Product updated successfully!");
      } else {
        await productService.createProduct(formData);
        alert("Product created successfully!");
      }

      resetForm();
      setShowAddModal(false);
      await loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product: " + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      setSubmitLoading(true);
      await productService.deleteProduct(productId);
      alert("Product deleted successfully!");
      setDeleteConfirm(null);
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product: " + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛍️ Products Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ Add New Product
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <p className="text-gray-500 mb-6">
            Get started by adding your first product!
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-3">{product.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <p className="font-bold text-lg text-green-600">
                        ₹{product.price}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Regular Price:</span>
                      <p className="font-bold text-lg">₹{product.regularPrice}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Stock:</span>
                      <p className="font-bold text-lg">{product.stockAvailable}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <p className="font-bold">{product.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Age Group:</span>
                      <p className="font-bold">{product.ageGroup}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Players:</span>
                      <p className="font-bold">{product.numberOfPlayers}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Coins Reward:</span>
                      <p className="font-bold text-yellow-600">
                        {product.coinsReward}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Featured:</span>
                      <p className="font-bold">
                        {product.isFeatured ? "✅ Yes" : "❌ No"}
                      </p>
                    </div>
                  </div>

                  {/* How to Play Section */}
                  {product.howToPlay && product.howToPlay.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        📋 How to Play:
                      </h4>
                      <div className="space-y-2">
                        {product.howToPlay.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex gap-2 text-sm text-gray-700"
                          >
                            <span className="text-lg">{step.emoji}</span>
                            <div>
                              <p className="font-semibold">{step.title}</p>
                              <p className="text-gray-600">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Features Section */}
                  {product.keyFeatures && product.keyFeatures.length > 0 && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">
                        ⭐ Key Features:
                      </h4>
                      <ul className="space-y-1">
                        {product.keyFeatures.map((feature, idx) => (
                          <li key={idx} className="flex gap-2 text-sm">
                            <span className="text-green-600">✓</span>
                            <div>
                              <p className="font-semibold text-gray-700">
                                {feature.title}
                              </p>
                              <p className="text-gray-600">
                                {feature.description}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(product.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  🗑️ Delete
                </button>
              </div>

              {/* Delete Confirmation */}
              {deleteConfirm === product.id && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-700 font-semibold mb-3">
                    Are you sure you want to delete "{product.name}"?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={submitLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {submitLoading ? "Deleting..." : "Yes, Delete"}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Buzzed – The Drinking Card Game"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Sale Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Regular Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="regularPrice"
                    value={formData.regularPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Short Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Brief description for product listing"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Long Description
                </label>
                <textarea
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Detailed description"
                />
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., Party & Drinking Games"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Age Group
                  </label>
                  <input
                    type="text"
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., 21+"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Number of Players
                  </label>
                  <input
                    type="text"
                    name="numberOfPlayers"
                    value={formData.numberOfPlayers}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., 3-20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Stock Available
                  </label>
                  <input
                    type="number"
                    name="stockAvailable"
                    value={formData.stockAvailable}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Coins Reward
                  </label>
                  <input
                    type="number"
                    name="coinsReward"
                    value={formData.coinsReward}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Featured Product</span>
                  </label>
                </div>
              </div>

              {/* How to Play Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-bold mb-3">📋 How to Play Steps</h3>
                {formData.howToPlay && formData.howToPlay.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {formData.howToPlay.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-xs font-semibold text-gray-600">
                                  Emoji
                                </label>
                                <input
                                  type="text"
                                  maxLength="2"
                                  value={step.emoji || ""}
                                  onChange={(e) => {
                                    const updated = [...formData.howToPlay];
                                    updated[idx].emoji = e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      howToPlay: updated,
                                    }));
                                  }}
                                  className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                  placeholder="🎯"
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="text-xs font-semibold text-gray-600">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={step.title || ""}
                                  onChange={(e) => {
                                    const updated = [...formData.howToPlay];
                                    updated[idx].title = e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      howToPlay: updated,
                                    }));
                                  }}
                                  className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                  placeholder="Step title"
                                />
                              </div>
                            </div>
                            <div className="mt-2">
                              <label className="text-xs font-semibold text-gray-600">
                                Description
                              </label>
                              <textarea
                                value={step.description || ""}
                                onChange={(e) => {
                                  const updated = [...formData.howToPlay];
                                  updated[idx].description = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    howToPlay: updated,
                                  }));
                                }}
                                rows="2"
                                className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Step description"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.howToPlay.filter(
                                (_, i) => i !== idx
                              );
                              setFormData((prev) => ({
                                ...prev,
                                howToPlay: updated,
                              }));
                            }}
                            className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      howToPlay: [
                        ...prev.howToPlay,
                        { emoji: "🎯", title: "", description: "" },
                      ],
                    }));
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  ➕ Add Step
                </button>
              </div>

              {/* Key Features Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-bold mb-3">⭐ Key Features</h3>
                {formData.keyFeatures && formData.keyFeatures.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {formData.keyFeatures.map((feature, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-green-50 rounded-lg border border-green-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="mb-2">
                              <label className="text-xs font-semibold text-gray-600">
                                Title
                              </label>
                              <input
                                type="text"
                                value={feature.title || ""}
                                onChange={(e) => {
                                  const updated = [...formData.keyFeatures];
                                  updated[idx].title = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    keyFeatures: updated,
                                  }));
                                }}
                                className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Feature title"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-600">
                                Description
                              </label>
                              <textarea
                                value={feature.description || ""}
                                onChange={(e) => {
                                  const updated = [...formData.keyFeatures];
                                  updated[idx].description = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    keyFeatures: updated,
                                  }));
                                }}
                                rows="2"
                                className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Feature description"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.keyFeatures.filter(
                                (_, i) => i !== idx
                              );
                              setFormData((prev) => ({
                                ...prev,
                                keyFeatures: updated,
                              }));
                            }}
                            className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      keyFeatures: [
                        ...prev.keyFeatures,
                        { title: "", description: "" },
                      ],
                    }));
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  ➕ Add Feature
                </button>
              </div>

              <div className="border-t pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
                >
                  {submitLoading
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
