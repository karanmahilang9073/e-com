import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(isAuthenticated, isAdmin);

// Product management
router.post("/products", createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
