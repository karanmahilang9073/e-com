import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/adminApi.js";
import Toast from "../components/Toast.jsx";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
  });

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllProductsAdmin(token);
      setProducts(data?.data || []);
    } catch (err) {
      setError(err.message || "Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.image) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (editingId) {
        // Update
        await updateProduct(editingId, formData, token);
        setToastMessage("Product updated successfully!");
      } else {
        // Create
        await createProduct(
          { ...formData, price: parseFloat(formData.price) },
          token
        );
        setToastMessage("Product created successfully!");
      }

      setFormData({ name: "", price: "", image: "" });
      setShowForm(false);
      setEditingId(null);
      await fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await deleteProduct(id, token);
        setToastMessage("Product deleted successfully!");
        await fetchProducts();
      } catch (err) {
        setError(err.message || "Failed to delete product");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", price: "", image: "" });
    setShowForm(false);
    setEditingId(null);
    setError("");
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        👨‍💼 Admin Dashboard
      </h2>

      {/* Add Product Button */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-6 py-2 rounded-lg text-white font-semibold ${
            showForm
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {showForm ? "Cancel" : "➕ Add New Product"}
        </button>
        <button
          onClick={() => navigate("/orders-management")}
          className="px-6 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700"
        >
          📦 Order Management
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">
            {editingId ? "Edit Product" : "Add New Product"}
          </h3>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Wireless Headphones"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 2999"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Image URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="e.g., https://..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Save Product"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      {loading && !showForm ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />
    </div>
  );
}
