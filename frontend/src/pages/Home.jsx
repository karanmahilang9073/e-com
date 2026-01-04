import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/productApi.js";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import Toast from "../components/Toast.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  // Get search query from URL
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        console.log("🔎 Current searchQuery from URL:", searchQuery);
        const filters = {
          search: searchQuery || undefined,
        };
        console.log("📋 Filters being sent:", filters);
        const data = await getProducts(filters);
        console.log("✅ API Response received:", data);
        // Handle response - check if it has a data property or is an array
        const productsList = Array.isArray(data) ? data : (data?.data || []);
        console.log("📦 Products extracted:", productsList.length, "items");
        setProducts(productsList);
      } catch (err) {
        const errorMsg = err.message || "Failed to load products. Please try again.";
        setError(errorMsg);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  const handleAddToCart = (product) => {
    try {
      // Check stock before adding
      if (product.stock <= 0) {
        setToastMessage(`❌ ${product.name} is out of stock!`);
        return;
      }
      addToCart(product);
      setToastMessage(`✅ ${product.name} added to cart!`);
    } catch (err) {
      setToastMessage("❌ Error adding to cart!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        🛍️ Products
      </h2>

      {/* Results info */}
      {!loading && !error && (
        <p className="text-gray-600 text-sm mb-4">
          {searchQuery && `Searching for "${searchQuery}" - `}
          Found {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Products Grid */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading products...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center mt-10">
          <p className="font-semibold">Error Loading Products</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          {searchQuery ? "No products found for your search" : "No products available"}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}
