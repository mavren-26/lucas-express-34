const express = require("express");
const app = express();

let cache = {};

app.get("/data", async (req, res) => {
  if (cache["info"]) {
    console.log("From Cache");
    return res.json({ data: cache["info"] });
  }

  // Simulate API call
  const data = { users: ["Ankur", "Rishika", "Aayush"], timestamp: Date.now() };

  cache["info"] = data;
  console.log("From API");
  res.json({ data });
});

app.listen(3000, () => console.log("Server running on port 3000"));
