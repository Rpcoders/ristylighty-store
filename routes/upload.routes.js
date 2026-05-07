const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ ensure folder exists
const uploadPath = path.join(__dirname, "../images");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const cleanName = file.originalname.replace(/\s+/g, "-");
    const uniqueName = Date.now() + "-" + cleanName;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// upload API
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    imageUrl: "/images/" + req.file.filename
  });
});

module.exports = router;