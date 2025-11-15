import express from "express";
const app = express();

const rateLimitStore = {}; // { ip: { count: 0, startTime: timestamp } }

function rateLimiter(req, res, next) {
  const ip = req.ip;
  const currentTime = Date.now();

  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { count: 1, startTime: currentTime };
    return next();
  }

  let userData = rateLimitStore[ip];
  let diff = currentTime - userData.startTime;

  if (diff < 60000) {
    if (userData.count >= 5) {
      return res.status(429).json({ error: "Too many requests" });
    }
    userData.count++;
    return next();
  } else {
    // reset window
    rateLimitStore[ip] = { count: 1, startTime: currentTime };
    return next();
  }
}

app.use("/api", rateLimiter);

app.get("/api/data", (req, res) => {
  res.json({ message: "Success" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
