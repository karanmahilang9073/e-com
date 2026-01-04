import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { useCart } from "./context/CartContext.jsx";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Profile from "./pages/Profile.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import OrderManagement from "./pages/OrderManagement.jsx";

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("🔍 Search submitted with query:", searchQuery);
    if (searchQuery.trim()) {
      const encodedQuery = encodeURIComponent(searchQuery);
      console.log("📍 Navigating to:", `/?search=${encodedQuery}`);
      navigate(`/?search=${encodedQuery}`);
      // Don't clear searchQuery here - keep it in state
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-gray-900 text-white p-4">
        <div className="flex justify-between items-center gap-4">
          {/* Left: Logo and Links */}
          <div className="flex gap-6 items-center">
            <Link to="/" className="hover:text-blue-400 font-semibold whitespace-nowrap">
              🛍️ Products
            </Link>
            {isAuthenticated && (
              <>
                <div className="relative">
                  <Link to="/cart" className="hover:text-blue-400 whitespace-nowrap flex items-center gap-2">
                    🛒 Cart
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
                <Link to="/checkout" className="hover:text-blue-400 whitespace-nowrap">
                  💳 Checkout
                </Link>
              </>
            )}
          </div>

          {/* Center: Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-lg text-gray-900 bg-white border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </form>

          {/* Right: Auth Links */}
          <div className="flex gap-4 items-center whitespace-nowrap">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
                  >
                    👨‍💼 Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-sm"
                >
                  👤 Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Page Content */}
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={isAuthenticated ? <Cart /> : <Login />} />
          <Route
            path="/checkout"
            element={isAuthenticated ? <Checkout /> : <Login />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Login />}
          />
          <Route
            path="/orders"
            element={isAuthenticated ? <OrderHistory /> : <Login />}
          />
          <Route
            path="/admin"
            element={isAuthenticated && user?.role === "admin" ? <AdminDashboard /> : <Home />}
          />
          <Route
            path="/orders-management"
            element={isAuthenticated && user?.role === "admin" ? <OrderManagement /> : <Home />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
