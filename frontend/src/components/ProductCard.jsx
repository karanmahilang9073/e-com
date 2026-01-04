import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center transition hover:shadow-lg">
      {/* Product Image - Clickable */}
      <Link to={`/product/${product._id}`} className="w-full">
        <img
          src={product.image}
          alt={product.name}
          className="w-40 h-40 object-cover rounded-xl mb-3 hover:opacity-80 transition cursor-pointer"
        />
      </Link>

      {/* Product Name - Clickable */}
      <Link to={`/product/${product._id}`} className="w-full text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-blue-600 transition">
          {product.name}
        </h3>
      </Link>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-2">
        <span className="text-yellow-400">★ {product.rating || 4.5}</span>
        <span className="text-gray-600 text-xs">({product.reviews || 0})</span>
      </div>

      {/* Price */}
      <p className="text-green-600 font-bold mb-2">₹{product.price}</p>

      {/* Stock Status */}
      <p className="text-xs text-gray-600 mb-2">
        {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
      </p>

      {/* View Details Link */}
      <Link
        to={`/product/${product._id}`}
        className="text-blue-600 hover:text-blue-700 text-sm font-semibold mb-2"
      >
        View Details
      </Link>

      {/* Add to Cart Button */}
      <button
        onClick={onAddToCart}
        disabled={product.stock <= 0}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
