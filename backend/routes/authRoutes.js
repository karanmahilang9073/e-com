import express from "express";
import { register, registerAdmin, login, getMe, updateProfile, deleteAccount } from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.get("/me", isAuthenticated, getMe);
router.put("/profile", isAuthenticated, updateProfile);
router.delete("/account", isAuthenticated, deleteAccount);

export default router;
