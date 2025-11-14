const express = require("express");
const app = express();

app.use(express.json());

let movies = [
  { id: 1, title: "Inception", year: 2010, rating: 9 },
  { id: 2, title: "The Social Network", year: 2010, rating: 8 }
];

// GET all movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// POST add a movie
app.post("/movies", (req, res) => {
  const { title, year, rating } = req.body;

  if (!title || year < 1900 || year > 2025 || rating < 1 || rating > 10) {
    return res.status(400).json({ error: "Invalid movie data" });
  }

  const newMovie = {
    id: Date.now(),
    title,
    year,
    rating
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// DELETE movie by ID
app.delete("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  movies = movies.filter((m) => m.id !== id);
  res.json({ message: "Movie deleted" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
