import express from "express";
import {
  getUserOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
  createOrder,
  cancelOrder,
} from "../controllers/orderController.js";
import { isAuthenticated } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

// Admin routes (MUST come before :orderId routes)
router.get("/admin/all", isAuthenticated, isAdmin, getAllOrders); // Get all orders
router.put("/admin/:orderId/status", isAuthenticated, isAdmin, updateOrderStatus); // Update order status

// User routes
router.post("/", isAuthenticated, createOrder); // Create order from checkout
router.get("/", isAuthenticated, getUserOrders); // Get user's orders
router.get("/:orderId", isAuthenticated, getOrderDetails); // Get order details
router.put("/:orderId/cancel", isAuthenticated, cancelOrder); // Cancel order

export default router;
