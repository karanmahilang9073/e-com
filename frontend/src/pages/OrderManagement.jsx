import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/orders/admin/all");
      setOrders(res.data.data);
      console.log("✅ All orders fetched:", res.data.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || "Failed to load orders";
      setMessage({ type: "error", text: errorMsg });
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        { status: newStatus }
      );
      setMessage({ type: "success", text: res.data.message });
      setSelectedStatus({});
      fetchAllOrders();
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || "Failed to update status";
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

  const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📦 Order Management</h1>
          <p className="text-gray-600">Manage all customer orders</p>
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

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-600 text-sm font-semibold">Pending</p>
            <p className="text-3xl font-bold text-yellow-700">
              {orders.filter((o) => o.status === "Pending").length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-600 text-sm font-semibold">Processing</p>
            <p className="text-3xl font-bold text-blue-700">
              {orders.filter((o) => o.status === "Processing").length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-purple-600 text-sm font-semibold">Shipped</p>
            <p className="text-3xl font-bold text-purple-700">
              {orders.filter((o) => o.status === "Shipped").length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm font-semibold">Delivered</p>
            <p className="text-3xl font-bold text-green-700">
              {orders.filter((o) => o.status === "Delivered").length}
            </p>
          </div>
        </div>

        {/* No Orders */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders</h2>
            <p className="text-gray-600">No orders have been placed yet</p>
          </div>
        ) : (
          /* Orders Table */
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-3">
                        <p className="font-mono text-sm font-semibold text-gray-900">
                          {order._id.substring(0, 8)}...
                        </p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="font-semibold text-gray-900">{order.userId.name}</p>
                        <p className="text-sm text-gray-600">{order.userId.email}</p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-gray-900">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="font-bold text-green-600">₹{order.total}</p>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setExpandedOrder(
                                expandedOrder === order._id ? null : order._id
                              )
                            }
                            className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                          >
                            {expandedOrder === order._id ? "Hide" : "View"}
                          </button>
                          <select
                            value={selectedStatus[order._id] || order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="text-sm px-2 py-1 border border-gray-300 rounded"
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expanded Order Details */}
            {expandedOrder && (
              <div className="border-t p-6 bg-gray-50">
                {(() => {
                  const order = orders.find((o) => o._id === expandedOrder);
                  return (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Items */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="bg-white p-2 rounded text-sm">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-gray-600">
                                  {item.qty} × ₹{item.price} = ₹{item.price * item.qty}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Shipping Address
                          </h4>
                          <div className="bg-white p-3 rounded text-sm text-gray-700">
                            <p className="font-semibold">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.zipCode}
                            </p>
                            <p>{order.shippingAddress.email}</p>
                            <p>{order.shippingAddress.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate("/admin")}
          className="mt-8 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Back to Admin
        </button>
      </div>
    </div>
  );
}
