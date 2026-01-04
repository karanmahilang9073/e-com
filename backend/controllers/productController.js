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

    console.log("📊 Total products in DB:", allProducts.length);
    console.log("🔍 Query parameters received:", req.query);

    // Get query parameters for search and filter
    const { search, minPrice, maxPrice, sortBy } = req.query;

    let filteredProducts = [...allProducts];

    // Search by name or category
    if (search && search.trim() !== "") {
      console.log(`🔎 Searching for: "${search}"`);
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
      console.log(`✅ Search for "${search}" found ${filteredProducts.length} products`);
    } else {
      console.log("⚠️ No search query provided, returning all products");
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= min && product.price <= max
      );
    }

    // Sort products
    if (sortBy === "price-low") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json({
      success: true,
      data: filteredProducts,
      count: filteredProducts.length,
      total: allProducts.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: "Product not found" },
      });
    }

    console.log(`✅ Product fetched: ${product.name}`);

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
