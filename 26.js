const express = require("express");
const app = express();

const products = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`
}));

app.get("/products", (req, res) => {
  let { page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const start = (page - 1) * limit;
  const end = page * limit;

  const paginatedData = products.slice(start, end);

  res.json({
    currentPage: page,
    totalItems: products.length,
    totalPages: Math.ceil(products.length / limit),
    data: paginatedData
  });
});

app.listen(3000, () => console.log("Server running on 3000"));
