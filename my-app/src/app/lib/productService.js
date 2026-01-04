// Client-side service that calls API endpoints
const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      console.log("Fetching products from /api/products...");
      const response = await fetch("/api/products");
      
      if (!response.ok) {
        const error = await response.json();
        console.error("API Error:", error);
        throw new Error("Failed to fetch products: " + (error.error || response.statusText));
      }
      
      const data = await response.json();
      console.log("Products fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  // Get single product by ID
  getProductById: async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error("Failed to create product");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (productId, updates) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update product");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
};

export default productService;
