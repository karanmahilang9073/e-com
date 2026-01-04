import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.js";

export const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("Please login to access this resource", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
