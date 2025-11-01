const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

const SECRET_KEY = "secret123";

app.post("/login", (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).send("Access Denied");
  try {
    jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.status(403).send("Invalid Token");
  }
};

app.get("/dashboard", verifyToken, (req, res) => {
  res.send("Welcome to the dashboard!");
});

app.listen(7000, () => console.log("Server running on port 7000"));
