const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// ✅ GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADD PRODUCT
router.post("/", async (req, res) => {
  try {
    const { name, price, image, category } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const product = new Product({
      name,
      price,
      image,
      category
    });

    await product.save();

    res.json({ message: "Product added", product });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE PRODUCT
router.put("/:id", async (req, res) => {
  try {
    const { name, price, image, category } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, image, category },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Updated", product: updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE PRODUCT (future use)
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;