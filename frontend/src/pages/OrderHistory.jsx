import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data.data);
      console.log("✅ Orders fetched:", res.data.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || "Failed to load orders";
      setMessage({ type: "error", text: errorMsg });
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`);
      setMessage({ type: "success", text: res.data.message });
      fetchOrders();
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || "Failed to cancel order";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "Processing":
        return "⚙️";
      case "Shipped":
        return "🚚";
      case "Delivered":
        return "✅";
      case "Cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📦 Order History</h1>
          <p className="text-gray-600">View and manage your orders</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg font-semibold ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* No Orders */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div
                  onClick={() =>
                    setExpandedOrder(expandedOrder === order._id ? null : order._id)
                  }
                  className="p-6 cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        Order ID: <span className="font-mono font-semibold">{order._id}</span>
                      </p>
                      <p className="text-gray-600 text-sm">
                        📅 {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">₹{order.total}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""} •{" "}
                    {order.items.reduce((sum, item) => sum + item.qty, 0)} qty
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                {expandedOrder === order._id && (
                  <div className="border-t p-6 bg-gray-50">
                    {/* Items */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center bg-white p-3 rounded"
                          >
                            <div>
                              <p className="font-semibold text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.qty} × ₹{item.price}
                              </p>
                            </div>
                            <p className="font-bold text-gray-900">
                              ₹{item.price * item.qty}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                      <div className="bg-white p-3 rounded text-gray-700 text-sm">
                        <p className="font-semibold">{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                        </p>
                        <p>📧 {order.shippingAddress.email}</p>
                        <p>📱 {order.shippingAddress.phone}</p>
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="bg-white p-4 rounded mb-6">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">₹{order.total}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Payment: {order.paymentMethod}
                      </p>
                    </div>

                    {/* Cancel Button */}
                    {["Pending", "Processing"].includes(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        ❌ Cancel Order
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="mt-8 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Back to Profile
        </button>
      </div>
    </div>
  );
}
