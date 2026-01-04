import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { AppError, catchAsyncErrors } from "../middleware/errorHandler.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// Register
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return next(new AppError("Please provide all required fields", 400));
  }

  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already registered", 409));
  }

  // Create regular user
  const user = await User.create({ name, email, password, role: "user" });

  console.log(`✅ User registered: ${name} (${email}) - Role: user`);

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Register as Admin with Secret Key
export const registerAdmin = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, confirmPassword, adminSecret } = req.body;

  const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin123";

  // Check admin secret
  if (!adminSecret || adminSecret !== ADMIN_SECRET) {
    return next(new AppError("Invalid admin secret key", 401));
  }

  if (!name || !email || !password || !confirmPassword) {
    return next(new AppError("Please provide all required fields", 400));
  }

  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already registered", 409));
  }

  // Create admin user
  const user = await User.create({ name, email, password, role: "admin" });

  console.log(`🔐 Admin registered: ${name} (${email}) - Role: admin`);

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    message: "Admin account created successfully!",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Login
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // Find user and select password (since we set select: false in schema)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Get current user
export const getMe = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// Update user profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.userId).select("+password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // If updating password, verify current password
  if (newPassword) {
    if (!password) {
      return next(new AppError("Please provide current password", 400));
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError("Current password is incorrect", 401));
    }

    if (newPassword !== confirmPassword) {
      return next(new AppError("New passwords do not match", 400));
    }

    if (newPassword.length < 6) {
      return next(new AppError("New password must be at least 6 characters", 400));
    }

    user.password = newPassword;
  }

  // Update name and email
  if (name) user.name = name;
  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== req.userId) {
      return next(new AppError("Email already in use", 409));
    }
    user.email = email;
  }

  await user.save();

  console.log(`✅ User profile updated: ${user.email}`);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// Delete user account
export const deleteAccount = catchAsyncErrors(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new AppError("Please provide password to delete account", 400));
  }

  const user = await User.findById(req.userId).select("+password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new AppError("Incorrect password. Account not deleted", 401));
  }

  const userName = user.name;
  const userEmail = user.email;

  // Delete user
  await User.findByIdAndDelete(req.userId);

  console.log(`🗑️  User account deleted: ${userEmail} (${userName})`);

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});
