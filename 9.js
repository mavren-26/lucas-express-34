const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const PORT = 5000;
const SECRET_KEY = "supersecretkey"; // 🔐 In real apps, store this in .env file

// 🧠 Fake user (you can replace this with DB data)
const USER = {
  username: "admin",
  password: "12345"
};

// 🪪 Route 1: Login and Generate JWT
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    // Generate JWT token (expires in 1 hour)
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
});

// 🧱 Middleware to Verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expected format: "Bearer <token>"

  if (!token) {
    return res.status(403).json({ error: "Access denied. Invalid or missing token." });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Access denied. Invalid or expired token." });
    }
    req.user = user;
    next();
  });
}

// 🔒 Route 2: Protected Dashboard
app.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.username}!`,
    data: "Here’s some protected content 🧠"
  });
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
