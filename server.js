const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

/* =========================
   CORE MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FILES (FIXED)
========================= */
app.use(express.static(path.join(__dirname)));
app.use("/images", express.static(path.join(__dirname, "images")));

/* =========================
   ROUTES IMPORT
========================= */
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

/* 🔥 ADD THIS HERE */
const uploadRoutes = require("./routes/upload.routes");

/* =========================
   ROUTES USE
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

/* 🔥 ADD THIS */
app.use("/api/upload", uploadRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

/* =========================
   DEBUG ROUTE LOGGER (IMPORTANT)
========================= */
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

/* =========================
   DATABASE CONNECTION (FIXED FLOW)
========================= */
mongoose.connect("mongodb://127.0.0.1:27017/ristylighty")
  .then(() => {
    console.log("✅ DB connected");

    /* =========================
       SERVER START ONLY AFTER DB
    ========================= */
    const PORT = 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  })
  .catch(err => {
    console.error("❌ DB error:", err);
  });