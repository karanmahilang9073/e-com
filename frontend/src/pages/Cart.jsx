import React from "react";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { cart, removeFromCart, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500 text-lg">
        🛒 Your cart is empty
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Your Cart
      </h2>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border-b border-gray-200 pb-3"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-700">{item.name}</h3>
                <p className="text-gray-600 text-sm">Qty: {item.qty}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-gray-800 font-medium">₹{item.price * item.qty}</p>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <h3 className="text-xl font-semibold text-gray-800">
          Total: ₹{total}
        </h3>
      </div>
    </div>
  );
}
