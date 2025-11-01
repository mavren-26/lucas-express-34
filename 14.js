const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todoDB");

const TodoSchema = new mongoose.Schema({ task: String });
const Todo = mongoose.model("Todo", TodoSchema);

const app = express();
app.use(express.json());

app.post("/add", async (req, res) => {
  const todo = new Todo({ task: req.body.task });
  await todo.save();
  res.send("Task added");
});

app.get("/tasks", async (req, res) => {
  const tasks = await Todo.find();
  res.json(tasks);
});

app.listen(5000, () => console.log("Server running on port 5000"));
