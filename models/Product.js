const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  
  // BASIC INFO
  name: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  // 🔥 MULTIPLE IMAGES (IMPORTANT FOR REAL SITE)
  images: [
    {
      type: String
    }
  ],

  // BACKWARD COMPATIBILITY
image: {
  type: String
},

// 🔥 HERO VIDEO 
video: {
  type: String,
  default: ""
},

category: {
  type: String,
  enum: ["anime", "oversized", "trending", "T-shirt"],
  default: "anime"
},

  // 🔥 PRODUCT STORY (your USP)
  story: {
    type: String,
    default: ""
  },

  // 🔥 STOCK CONTROL
  stock: {
    type: Number,
    default: 0
  },

  // 🔥 SIZES (dynamic)
  sizes: {
    type: [String],
    default: ["S", "M", "L", "XL"]
  },

  // 🔥 TAGS (for smart filtering later)
  tags: {
    type: [String],
    default: []
  },

  // 🔥 FEATURE FLAGS
  isTrending: {
    type: Boolean,
    default: false
  },

  isFeatured: {
    type: Boolean,
    default: false
  },

  // 🔥 TIMESTAMPS
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Product", productSchema);