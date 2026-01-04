import Product from "../models/Product.js";
import { AppError, catchAsyncErrors } from "../middleware/errorHandler.js";

// Create product
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return next(new AppError("Please provide name, price, and image", 400));
  }

  if (typeof price !== "number" || price <= 0) {
    return next(new AppError("Price must be a positive number", 400));
  }

  const product = await Product.create({ name, price, image });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

// Get all products (for admin)
export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    data: products,
    count: products.length,
  });
});

// Get single product
export const getProductById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// Update product
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (name) product.name = name;
  if (price) {
    if (typeof price !== "number" || price <= 0) {
      return next(new AppError("Price must be a positive number", 400));
    }
    product.price = price;
  }
  if (image) product.image = image;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

// Delete product
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: product,
  });
});
