import Order from "../models/Order.js";
import { AppError, catchAsyncErrors } from "../middleware/errorHandler.js";

// Old checkout endpoint - kept for backward compatibility
export const checkout = catchAsyncErrors(async (req, res, next) => {
  const { cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  // Calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + item.productId.price * item.qty,
    0
  );

  // Mock receipt
  const receipt = {
    success: true,
    total,
    timestamp: new Date().toISOString(),
    message: "Checkout successful! (mock payment)",
  };

  console.log(`✅ Checkout completed. Total: ₹${total}`);

  res.status(200).json(receipt);
});
