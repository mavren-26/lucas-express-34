const express = require("express");
const app = express();
app.use(express.json());

let users = [];

app.post("/users", (req, res) => {
  users.push(req.body);
  res.status(201).send("User added");
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  users[id] = req.body;
  res.send("User updated");
});

app.delete("/users/:id", (req, res) => {
  users.splice(req.params.id, 1);
  res.send("User deleted");
});

app.listen(3000, () => console.log("Server running on port 3000"));
