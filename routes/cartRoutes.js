const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { authMiddleware } = require("../middleware/auth.middleware");

// =========================
// 🛒 ADD TO CART (UPSERT)
// =========================
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId, name, price, image, size } = req.body;

    if (!productId || !name || !price) {
      return res.status(400).json({ error: "Missing product data" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: []
      });
    }

    const existing = cart.items.find(
      i => i.productId === productId && i.size === size
    );

    if (existing) {
      existing.qty += 1;
    } else {
      cart.items.push({
        productId,
        name,
        price,
        image,
        size: size || "default",
        qty: 1
      });
    }

    await cart.save();

    res.json({
      success: true,
      cart
    });

  } catch (err) {
    console.error("ADD CART ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// =========================
// 📦 GET CART (SAFE FORMAT)
// =========================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    res.json({
      success: true,
      items: cart ? cart.items : []
    });

  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// =========================
// ❌ REMOVE ITEM
// =========================
router.post("/remove", authMiddleware, async (req, res) => {
  try {
    const { productId, size } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.json({ success: true, items: [] });
    }

    cart.items = cart.items.filter(
      i => !(i.productId === productId && i.size === size)
    );

    await cart.save();

    res.json({
      success: true,
      cart
    });

  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;