const express = require("express");
const app = express();

function logMiddleware(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const timeTaken = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${timeTaken}ms`);
  });

  next();
}

app.use(logMiddleware);

app.get("/profile", (req, res) => {
  setTimeout(() => {  // simulate work
    res.send({ message: "Profile data" });
  }, 50);
});

app.post("/login", (req, res) => {
  res.send({ message: "Logged in!" });
});

app.listen(3000, () => console.log("Server started on 3000"));
