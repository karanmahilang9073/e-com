import Product from "../models/Product.js";
import { products } from "../mockData.js";

// Controller to fetch products from DB (and seed if empty)
export const getProducts = async (req, res) => {
  try {
    let allProducts = await Product.find();

    // If DB empty → seed mock data
    if (allProducts.length === 0) {
      await Product.insertMany(products);
      allProducts = await Product.find();
      console.log("✅ Mock products inserted!");
    }

    res.json(allProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
