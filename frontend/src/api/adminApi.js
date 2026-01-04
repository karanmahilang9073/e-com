import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const getAdminHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Create product
export const createProduct = async (product, token) => {
  try {
    const res = await axios.post(
      `${API_BASE}/admin/products`,
      product,
      getAdminHeaders(token)
    );
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || err;
  }
};

// Get all products (admin view)
export const getAllProductsAdmin = async (token) => {
  try {
    const res = await axios.get(
      `${API_BASE}/admin/products`,
      getAdminHeaders(token)
    );
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || err;
  }
};

// Get single product
export const getProductById = async (id, token) => {
  try {
    const res = await axios.get(
      `${API_BASE}/admin/products/${id}`,
      getAdminHeaders(token)
    );
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || err;
  }
};

// Update product
export const updateProduct = async (id, product, token) => {
  try {
    const res = await axios.put(
      `${API_BASE}/admin/products/${id}`,
      product,
      getAdminHeaders(token)
    );
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || err;
  }
};

// Delete product
export const deleteProduct = async (id, token) => {
  try {
    const res = await axios.delete(
      `${API_BASE}/admin/products/${id}`,
      getAdminHeaders(token)
    );
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || err;
  }
};
