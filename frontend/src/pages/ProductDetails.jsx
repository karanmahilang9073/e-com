import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data.data);
      console.log("✅ Product fetched:", res.data.data);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load product details" });
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const quantityNum = parseInt(quantity);

    // Check stock before adding
    if (quantityNum > product.stock) {
      setMessage({ 
        type: "error", 
        text: `❌ Out of Stock! Only ${product.stock} available.` 
      });
      return;
    }

    try {
      // Add to backend cart
      const response = await axios.post("http://localhost:5000/api/cart", {
        productId: product._id,
        qty: quantityNum,
      });

      console.log("✅ Added to cart response:", response.data);

      // Refresh product to get updated stock
      await fetchProduct();

      // Also add to context for UI updates
      for (let i = 0; i < quantityNum; i++) {
        addToCart(product);
      }

      setMessage({ type: "success", text: `✅ Added ${quantityNum} item(s) to cart! Stock remaining: ${response.data.data?.stock || product.stock - quantityNum}` });
      setQuantity(1);
      
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 4000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      console.error("❌ Error adding to cart:", errorMsg);
      setMessage({ type: "error", text: `❌ ${errorMsg}` });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Back to Products
        </button>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg font-semibold text-lg shadow-lg animate-pulse ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border-2 border-green-500"
                : "bg-red-100 text-red-800 border-2 border-red-500"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-6">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-sm max-h-96 object-cover rounded-lg"
              />
            </div>

            {/* Product Information */}
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {product.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Product ID: <span className="font-mono">{product._id}</span>
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-yellow-400 text-xl">★ {product.rating}</span>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold text-green-600">₹{product.price}</p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <span
                  className={`inline-block px-4 py-2 rounded-full font-semibold ${
                    inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {inStock ? `✓ In Stock (${product.stock} available)` : "Out of Stock"}
                </span>
              </div>

              {/* Specifications */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Brand</p>
                    <p className="font-semibold text-gray-900">{product.specifications.brand}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Color</p>
                    <p className="font-semibold text-gray-900">{product.specifications.color}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Weight</p>
                    <p className="font-semibold text-gray-900">{product.specifications.weight}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Warranty</p>
                    <p className="font-semibold text-gray-900">{product.specifications.warranty}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features && product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500 font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add to Cart Section */}
              <div className="border-t pt-6">
                <div className="flex gap-4 items-center mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity (Max: {product.stock})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val <= product.stock && val >= 1) {
                          setQuantity(e.target.value);
                        }
                      }}
                      disabled={!inStock}
                      className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || parseInt(quantity) > product.stock}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition mb-3 ${
                    inStock
                      ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {inStock ? "🛒 Add to Cart" : "Out of Stock"}
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-gray-700 border-2 border-gray-300 hover:border-gray-400 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
