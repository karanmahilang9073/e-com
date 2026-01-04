import { AppError } from "./errorHandler.js";
import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return next(new AppError("Please login first", 401));
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (user.role !== "admin") {
      return next(new AppError("You don't have permission to access this resource", 403));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError("Error checking admin status", 500));
  }
};
