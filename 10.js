const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// 🗂 Create uploads folder if not exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ⚙️ Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Rename file to something like profile_1234.png
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `profile_${uniqueSuffix}${ext}`);
  },
});

// 🧠 File Filter Function (validation)
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"));
  }
}

// 🧱 Initialize Multer with storage, filter, and size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// 🚀 POST /upload route
app.post("/upload", upload.single("profile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  res.json({
    message: "Upload successful",
    filename: req.file.filename,
  });
});

// ⚠️ Global Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Max 2MB allowed." });
    }
  } else if (err) {
    // Custom errors (invalid file type, etc.)
    return res.status(400).json({ message: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
