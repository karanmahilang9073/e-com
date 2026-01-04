import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "Electronics" },
  stock: { type: Number, default: 50 },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  specifications: {
    brand: { type: String, default: "" },
    color: { type: String, default: "" },
    weight: { type: String, default: "" },
    warranty: { type: String, default: "" },
  },
  features: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
