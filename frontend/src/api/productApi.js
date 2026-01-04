import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const getProducts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
    if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);

    const url = `${API_BASE}/products${queryParams ? "?" + queryParams : ""}`;
    console.log("🔗 Fetching from:", url);
    const res = await axios.get(url);
    console.log("📦 Response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};
