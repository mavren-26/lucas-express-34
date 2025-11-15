import express from "express";
import multer from "multer";

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("INVALID_TYPE"), false);
  }
}

const upload = multer({ storage, fileFilter });

app.post("/upload", (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err && err.message === "INVALID_TYPE") {
      return res.status(400).json({ error: "Invalid file type" });
    }

    if (err) return res.status(500).json({ error: "Upload failed" });

    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    res.json({
      success: true,
      filename: req.file.filename,
    });
  });
});

app.listen(3000, () => console.log("Server running on 3000"));
