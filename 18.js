import express from "express";
const app = express();

const fakeApiCall = () =>
  new Promise((resolve, reject) => {
    Math.random() > 0.7 ? resolve("✅ Success!") : reject("❌ Failed!");
  });

const fetchWithRetry = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await fakeApiCall();
      return result;
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
};

app.get("/retry", async (req, res) => {
  try {
    const data = await fetchWithRetry();
    res.json({ message: data });
  } catch {
    res.status(500).json({ error: "API failed after 3 retries" });
  }
});

app.listen(5000);
