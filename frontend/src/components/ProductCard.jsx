import React from "react";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center transition hover:shadow-lg">
      <img
        src={product.image}
        alt={product.name}
        className="w-40 h-40 object-cover rounded-xl mb-3"
      />
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
      <p className="text-gray-600 mb-2">₹{product.price}</p>
      <button
        onClick={onAddToCart}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
