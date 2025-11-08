import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";

function App() {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-center gap-6">
        <Link to="/" className="hover:text-blue-400">Products</Link>
        <Link to="/cart" className="hover:text-blue-400">Cart</Link>
        <Link to="/checkout" className="hover:text-blue-400">Checkout</Link>
      </nav>

      {/* Main Page Content */}
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
