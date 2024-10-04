const express = require("express");
const cors = require("cors");
const connectDB = require("./db/config");
const path = require("path");
const morgan = require("morgan");
const { listItems, testSquareApi } = require("./api/square");
require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Check for dotenv loading errors
const result = require("dotenv").config();
if (result.error) {
  throw result.error;
}

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

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  //testSquareApi();
});
