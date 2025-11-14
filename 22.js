const express = require("express");
const app = express();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token !== "SECRET123") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

app.get("/public", (req, res) => {
  res.json({ message: "Welcome to the public API" });
});

app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    user: "John Doe",
    role: "admin",
    lastLogin: "USA – California – 10:30AM"
  });
});

app.listen(4000, () => console.log("Server running on port 4000"));
