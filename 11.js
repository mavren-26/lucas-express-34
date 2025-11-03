const express = require("express");
const app = express();

const PORT = 5000;

// 🧠 In-memory store to track requests per IP
// Structure: { "ip": { count: number, startTime: timestamp } }
const requestCounts = new Map();

// ⏱ Constants
const WINDOW_SIZE = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_REQUESTS = 100;

// 🚀 Rate Limiter Middleware
function rateLimiter(req, res, next) {
  const ip = req.ip; // Identify user by IP address
  const currentTime = Date.now();

  if (!requestCounts.has(ip)) {
    // First request by this IP
    requestCounts.set(ip, { count: 1, startTime: currentTime });
    return next();
  }

  const userData = requestCounts.get(ip);

  // If window has expired → reset the counter
  if (currentTime - userData.startTime > WINDOW_SIZE) {
    requestCounts.set(ip, { count: 1, startTime: currentTime });
    return next();
  }

  // If user still within time window
  if (userData.count < MAX_REQUESTS) {
    userData.count++;
    requestCounts.set(ip, userData);
    return next();
  }

  // 🚫 Limit exceeded
  const retryAfter = Math.ceil(
    (WINDOW_SIZE - (currentTime - userData.startTime)) / 1000
  );
  res.setHeader("Retry-After", retryAfter);
  return res
    .status(429)
    .json({ message: "Rate limit exceeded. Try again after 15 minutes." });
}

// Apply middleware globally
app.use(rateLimiter);

// 🧩 Sample routes
app.get("/", (req, res) => {
  res.send("Welcome to the API 🚀");
});

app.get("/data", (req, res) => {
  res.json({ message: "Here’s your data!" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
