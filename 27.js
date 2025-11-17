// app.js
import express from "express";
import multer from "multer";

const app = express();

// In-memory upload tracking
const uploadCounter = new Map();

// Rate limit middleware
function rateLimit(req, res, next) {
    const userId = req.headers['userid'];
    if (!userId) return res.status(400).json({ error: "Missing userId header" });

    const now = Date.now();

    if (!uploadCounter.has(userId)) {
        uploadCounter.set(userId, []);
    }

    const timestamps = uploadCounter.get(userId);

    // Remove uploads older than 1 hour
    const oneHourAgo = now - 60 * 60 * 1000;
    const recent = timestamps.filter(t => t > oneHourAgo);
    uploadCounter.set(userId, recent);

    if (recent.length >= 5) {
        return res.status(429).json({ error: "Upload limit reached (5 per hour)" });
    }

    timestamps.push(now);
    next();
}

// Multer config
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter(req, file, cb) {
        if (!file.mimetype.includes("jpeg") && !file.mimetype.includes("png")) {
            return cb(new Error("Only jpg and png allowed"));
        }
        cb(null, true);
    }
});

app.post("/upload", rateLimit, upload.single("image"), (req, res) => {
    res.json({ message: "File uploaded", file: req.file });
});

app.listen(3000, () => console.log("Server running on port 3000"));
