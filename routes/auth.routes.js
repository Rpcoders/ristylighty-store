const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ error: "User exists" });

  const hash = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hash,
    role: "user"
  });

  await user.save();

  res.json({ message: "Registered successfully" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid user" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "secret123",
    { expiresIn: "7d" }
  );

  res.json({ token, role: user.role });
});

module.exports = router;