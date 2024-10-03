const express = require("express");
const morgan = require("morgan");

const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db/config");
const path = require("path");
const { listItems } = require("./api/square");

const app = express();

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

connectDB();

app.use(express.static(path.join(__dirname, "../build")));

app.get("/api/items", async (req, res) => {
  try {
    const items = await listItems();
    res.json(items);
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ error: "Failed to retrieve items" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
