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

    // Validate inputs
    if (!productId || !qty) {
      return res.status(400).json({ 
        error: "Please provide productId and qty" 
      });
    }

    if (qty <= 0) {
      return res.status(400).json({ 
        error: "Quantity must be greater than 0" 
      });
    }

    console.log("🛒 Adding to cart - ProductID:", productId, "Qty:", qty);

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.log("❌ Product not found:", productId);
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("✅ Product found:", product.name, "Stock:", product.stock);

    // Check if enough stock available
    if (product.stock < qty) {
      console.log("❌ Insufficient stock. Available:", product.stock, "Requested:", qty);
      return res.status(400).json({ 
        error: `Out of Stock! Only ${product.stock} available.` 
      });
    }

    // Decrease product stock
    product.stock -= qty;
    await product.save();
    console.log("📉 Stock decreased. New stock:", product.stock);

    // Check if already in cart
    const existing = await Cart.findOne({ productId });
    if (existing) {
      existing.qty += qty || 1;
      await existing.save();
      console.log("✅ Updated existing cart item. New qty:", existing.qty);
      return res.json({ 
        success: true, 
        data: existing,
        message: `Item quantity updated. Stock remaining: ${product.stock}`
      });
    }

    // Else create new item
    const newItem = await Cart.create({ productId, qty });
    console.log("✅ Created new cart item:", newItem);
    res.status(201).json({ 
      success: true, 
      data: newItem,
      message: `Added to cart. Stock remaining: ${product.stock}`
    });
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
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
