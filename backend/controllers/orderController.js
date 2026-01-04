import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { AppError, catchAsyncErrors } from "../middleware/errorHandler.js";

// Get user's orders
export const getUserOrders = catchAsyncErrors(async (req, res, next) => {
  const userId = req.userId;

  const orders = await Order.find({ userId })
    .populate("items.productId")
    .sort({ createdAt: -1 });

  console.log(`✅ Fetched ${orders.length} orders for user ${userId}`);

  res.status(200).json({
    success: true,
    data: orders,
    count: orders.length,
  });
});

// Get single order details
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.userId;

  const order = await Order.findById(orderId).populate("items.productId");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Verify order belongs to user
  if (order.userId.toString() !== userId) {
    return next(new AppError("You don't have permission to view this order", 403));
  }

  console.log(`✅ Order details fetched: ${orderId}`);

  res.status(200).json({
    success: true,
    data: order,
  });
});

// Get all orders (Admin only)
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .populate("items.productId")
    .sort({ createdAt: -1 });

  console.log(`✅ Admin fetched ${orders.length} orders`);

  res.status(200).json({
    success: true,
    data: orders,
    count: orders.length,
  });
});

// Update order status (Admin only)
export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    return next(new AppError("Please provide a status", 400));
  }

  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return next(new AppError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`, 400));
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status, updatedAt: Date.now() },
    { new: true }
  ).populate("items.productId");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  console.log(`✅ Order ${orderId} status updated to ${status}`);

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    data: order,
  });
});

// Create order from checkout
export const createOrder = catchAsyncErrors(async (req, res, next) => {
  const userId = req.userId;
  const { cartItems, shippingAddress, paymentMethod } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  if (!shippingAddress) {
    return next(new AppError("Please provide shipping address", 400));
  }

  // Calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + item.productId.price * item.qty,
    0
  );

  // Prepare order items
  const orderItems = cartItems.map((item) => ({
    productId: item.productId._id,
    name: item.productId.name,
    price: item.productId.price,
    qty: item.qty,
  }));

  // Create order
  const order = await Order.create({
    userId,
    items: orderItems,
    total,
    shippingAddress,
    paymentMethod: paymentMethod || "Credit Card",
    status: "Pending",
  });

  console.log(`✅ Order created: ${order._id} for user ${userId}`);

  // Clear cart after successful order
  await Cart.deleteMany({});
  console.log(`✅ Cart cleared for user ${userId}`);

  res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    data: order,
  });
});

// Cancel order
export const cancelOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.userId;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Verify ownership
  if (order.userId.toString() !== userId) {
    return next(new AppError("You don't have permission to cancel this order", 403));
  }

  // Can only cancel pending or processing orders
  if (!["Pending", "Processing"].includes(order.status)) {
    return next(
      new AppError(
        `Cannot cancel ${order.status} orders. Only Pending or Processing orders can be cancelled.`,
        400
      )
    );
  }

  order.status = "Cancelled";
  order.updatedAt = Date.now();
  await order.save();

  console.log(`✅ Order ${orderId} cancelled by user ${userId}`);

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: order,
  });
});
