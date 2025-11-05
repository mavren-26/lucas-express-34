import express from "express";
const app = express();
app.use(express.json());

const validateUser = (req, res, next) => {
  const { name, email, age } = req.body;
  if (!name || !email || !age) {
    return res.status(400).json({ error: "Missing user fields" });
  }
  next();
};

app.post("/user", validateUser, (req, res) => {
  res.json({ success: "User validated!", user: req.body });
});

app.listen(5000);
