import React, { useEffect, useState } from "react";
import { getProducts } from "../api/productApi.js";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import Toast from "../components/Toast.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const { addToCart } = useCart();
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMessage(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🛍️ Products
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}
