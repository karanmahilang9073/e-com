import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:5000/api";

  // Set up axios interceptor to include token in requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      getMe();
    }
  }, []);

  const getMe = async () => {
    try {
      const res = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      setToken(null);
      setUser(null);
    }
  };

  const register = async (name, email, password, confirmPassword, adminSecret = null, isAdmin = false) => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? `${API_BASE}/auth/register-admin` : `${API_BASE}/auth/register`;
      const payload = {
        name,
        email,
        password,
        confirmPassword,
      };
      if (isAdmin && adminSecret) {
        payload.adminSecret = adminSecret;
      }
      const res = await axios.post(endpoint, payload);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true, data: res.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true, data: res.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
