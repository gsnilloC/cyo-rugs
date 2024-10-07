const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./db/config");
const path = require("path");
const morgan = require("morgan");
const { listItems, getItemById, testSquareApi } = require("./api/square");
const { testSquareApi, listItems } = require("./api/square"); // Import the test function
const axios = require("axios"); // Import axios

require("dotenv").config();

const app = express();
app.use(morgan("dev"));

const app = express();

// Use morgan for logging requests in the terminal
app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

// Check for dotenv loading errors
const result = require("dotenv").config();
if (result.error) {
  throw result.error;
}

// connectDB();

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

app.get("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await getItemById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("Error retrieving item:", error);
    res.status(500).json({ error: "Failed to retrieve item" });
  }
});

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

// // Test API function
// const testApi = async () => {
//   try {
//     const response = await axios.get("http://localhost:3000/api/items");
//     console.log("API Response:", response.data);
//   } catch (error) {
//     console.error("Error testing API:", error);
//   }
// };

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  testSquareApi(); // Call the test function when the server starts
  // testApi(); // Call the test API function when the server starts
});
