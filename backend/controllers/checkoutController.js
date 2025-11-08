// controllers/checkoutController.js

export const checkout = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    const total = cartItems.reduce(
      (sum, item) => sum + item.productId.price * item.qty,
      0
    );

    // Mock receipt
    const receipt = {
      total,
      timestamp: new Date().toISOString(),
      message: "Checkout successful! (mock payment)",
    };

    res.status(200).json(receipt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
