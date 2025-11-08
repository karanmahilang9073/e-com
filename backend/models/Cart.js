import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  qty: { type: Number, required: true, default: 1 },
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
