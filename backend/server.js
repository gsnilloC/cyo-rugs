const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db/config");
const path = require("path");
const { testSquareApi } = require("./api/square"); // Import the testSquareApi function
const { listItems } = require("./api/square"); // Import the listItems function
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use(express.static(path.join(__dirname, "../build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.get("/api/items", async (req, res) => {
  try {
    const items = await listItems();
    res.json(items);
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ error: "Failed to retrieve items" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  testSquareApi(); // Call the test function when the server starts
});
