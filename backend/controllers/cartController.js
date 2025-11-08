import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get all cart items + total
export const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find().populate("productId");

    const total = cartItems.reduce(
      (sum, item) => sum + item.productId.price * item.qty,
      0
    );

    res.json({ cartItems, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if already in cart
    const existing = await Cart.findOne({ productId });
    if (existing) {
      existing.qty += qty || 1;
      await existing.save();
      return res.json(existing);
    }

    // Else create new item
    const newItem = await Cart.create({ productId, qty });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.json({ message: "Item removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
