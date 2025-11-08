import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const checkoutCart = async (cartItems) => {
  const res = await axios.post(`${API_BASE}/checkout`, { cartItems });
  return res.data;
};
