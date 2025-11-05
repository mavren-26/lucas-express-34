const express = require("express");
const app = express();

const requestCounts = {};

function rateLimiter(req, res, next) {
  const ip = req.ip;
  const currentTime = Date.now();

  if (!requestCounts[ip]) {
    requestCounts[ip] = [];
  }

  // Filter out requests older than 1 minute
  requestCounts[ip] = requestCounts[ip].filter(
    (timestamp) => currentTime - timestamp < 60 * 1000
  );

  if (requestCounts[ip].length >= 5) {
    return res.status(429).json({ message: "Too many requests. Try again later." });
  }

  requestCounts[ip].push(currentTime);
  next();
}

app.use(rateLimiter);

app.get("/", (req, res) => {
  res.send("Request successful!");
});

app.listen(3000, () => console.log("Server running on port 3000"));
