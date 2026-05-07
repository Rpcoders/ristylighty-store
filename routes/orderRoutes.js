const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { authMiddleware } = require("../middleware/auth.middleware");

// CREATE ORDER (CHECKOUT)
router.post("/create", authMiddleware, async (req, res) => {

  const cart = await Cart.findOne({ userId: req.user.id });

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let total = 0;
  cart.items.forEach(item => {
    total += item.price * item.qty;
  });

  const order = new Order({
    userId: req.user.id,
    items: cart.items,
    totalAmount: total
  });

  await order.save();

  // clear cart after order
  cart.items = [];
  await cart.save();

  res.json({
    message: "Order placed successfully",
    order
  });
});

// GET USER ORDERS
router.get("/", authMiddleware, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

module.exports = router;