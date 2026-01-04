import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    deletePassword: "",
  });

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isAdmin = user?.role === "admin";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        email: formData.email,
      };

      // Only include password if user is changing it
      if (formData.newPassword) {
        if (!formData.password) {
          setMessage({ type: "error", text: "Please provide current password to change password" });
          setLoading(false);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: "error", text: "New passwords do not match" });
          setLoading(false);
          return;
        }
        payload.password = formData.password;
        payload.newPassword = formData.newPassword;
        payload.confirmPassword = formData.confirmPassword;
      }

      const res = await axios.put("http://localhost:5000/api/auth/profile", payload);

      setMessage({ type: "success", text: "Profile updated successfully! ✅" });
      setFormData({
        ...formData,
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsEditing(false);

      // Refresh user data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!formData.deletePassword) {
      setMessage({ type: "error", text: "Please provide your password to confirm deletion" });
      return;
    }

    try {
      setLoading(true);
      await axios.delete("http://localhost:5000/api/auth/account", {
        data: { password: formData.deletePassword },
      });

      setMessage({ type: "success", text: "Account deleted successfully. Logging out..." });
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isAdmin ? "👨‍💼 Admin Profile" : "👤 User Profile"}
          </h1>
          <p className="text-gray-600">
            {isAdmin
              ? "View and manage your admin account information"
              : "View and manage your account information"}
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-3xl">
              {isAdmin ? "👨‍💼" : "👤"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p
                className={`text-sm font-semibold mt-1 px-3 py-1 rounded-full w-fit ${
                  isAdmin
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {isAdmin ? "🔐 Admin" : "👥 Regular User"}
              </p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600 block mb-2">
                📧 Email Address
              </label>
              <p className="text-lg text-gray-900">{user?.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600 block mb-2">
                🎯 Account Type
              </label>
              <p className="text-lg text-gray-900 capitalize">
                {isAdmin ? "Administrator" : "Customer"}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600 block mb-2">
                📅 Member Since
              </label>
              <p className="text-lg text-gray-900">{formatDate(user?.createdAt)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8 flex-wrap">
            {!isAdmin && (
              <button
                onClick={() => navigate("/orders")}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                📦 Order History
              </button>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {isEditing ? "❌ Cancel" : "✏️ Edit Profile"}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              🚪 Logout
            </button>
            <button
              onClick={() => setDeleteConfirm(!deleteConfirm)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {deleteConfirm ? "❌ Cancel Delete" : "🗑️ Delete Account"}
            </button>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Change Password Section */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Change Password (Optional)
                </h4>

                {/* Current Password */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Leave blank if not changing password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* New Password */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Leave blank if not changing password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Leave blank if not changing password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                {loading ? "Saving..." : "💾 Save Changes"}
              </button>
            </form>
          </div>
        )}

        {/* Delete Account Confirmation */}
        {deleteConfirm && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-red-900 mb-4">
              ⚠️ Delete Account Permanently
            </h3>
            <p className="text-red-700 mb-6">
              This action is permanent and cannot be undone. All your account data will be
              deleted. Please confirm by entering your password.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-red-900 mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                name="deletePassword"
                value={formData.deletePassword}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {loading ? "Deleting..." : "🗑️ Permanently Delete Account"}
            </button>
          </div>
        )}

        {/* Admin Features */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🛠️ Admin Features</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Manage products (Create, Edit, Delete)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>View all products in the system</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Access admin dashboard</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Manage inventory</span>
              </li>
            </ul>
            <div className="mt-6">
              <a
                href="/admin"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Go to Admin Dashboard →
              </a>
            </div>
          </div>
        )}

        {/* User Features */}
        {!isAdmin && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🛍️ Your Features</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Browse and search products</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Add items to shopping cart</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Checkout and place orders</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>View order receipts</span>
              </li>
            </ul>
            <div className="mt-6">
              <a
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Continue Shopping →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
