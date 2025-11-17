// otp-auth.js
import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

// In-memory stores
const otpStore = new Map();
const sessionStore = new Map();

// Send OTP
app.post("/auth/send-otp", (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(phone, {
        otp,
        expires: Date.now() - 0 + 2 * 60 * 1000 // 2 minutes
    });

    console.log(`OTP for ${phone}: ${otp}`);
    return res.json({ message: "OTP sent" });
});

// Verify OTP
app.post("/auth/verify-otp", (req, res) => {
    const { phone, otp } = req.body;
    const record = otpStore.get(phone);

    if (!record) return res.status(400).json({ error: "Send OTP first" });
    if (Date.now() > record.expires) return res.status(400).json({ error: "OTP expired" });
    if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

    const token = crypto.randomBytes(16).toString("hex");

    sessionStore.set(token, {
        phone,
        expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    });

    return res.json({ token });
});

// Middleware to protect routes
function auth(req, res, next) {
    const token = req.headers['authorization'];
    const session = sessionStore.get(token);

    if (!session || Date.now() > session.expires) {
        return res.status(401).json({ error: "Session expired or invalid" });
    }

    req.phone = session.phone;
    next();
}

app.get("/profile", auth, (req, res) => {
    res.json({ message: "Profile data", phone: req.phone });
});

app.listen(3000, () => console.log("Server running on port 3000"));
