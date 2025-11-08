import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { checkoutCart } from "../api/checkoutApi.js";
import ReceiptModal from "../components/ReceiptModal.jsx";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Cart is empty!");
    setLoading(true);

    try {
      const data = await checkoutCart(cart.map((item) => ({
        productId: item,
        qty: item.qty
      })));
      setReceipt(data);
      setShowModal(true);
      clearCart();
    } catch (err) {
      alert("Checkout failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Checkout
      </h2>

      <form onSubmit={handleCheckout} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : `Pay ₹${total}`}
        </button>
      </form>

      {/* Modal */}
      <ReceiptModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        receipt={receipt || { total: total, timestamp: new Date() }}
      />
    </div>
  );
}
