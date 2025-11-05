import express from "express";
const app = express();

const checkApiKey = (req, res, next) => {
  if (req.headers["x-api-key"] !== "12345") {
    return res.status(403).json({ error: "Invalid API key" });
  }
  next();
};

const checkRole = (req, res, next) => {
  const role = req.headers["x-role"];
  if (role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

app.get("/secure", checkApiKey, checkRole, (req, res) => {
  res.send("Access granted ✅");
});

app.listen(5000);
