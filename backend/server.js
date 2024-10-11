const express = require("express");
const cors = require("cors");
const connectDB = require("./db/config");
const path = require("path");
const morgan = require("morgan");
const {
  listItems,
  getItemById,
  testSquareApi,
  createCheckout,
  testCreateCheckout,
} = require("./api/square");

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

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

app.post("/api/checkout", async (req, res) => {
  const { cartItems } = req.body; // Get cart items from the request body
  try {
    const checkoutLink = await createCheckout(cartItems); // Pass cart items to the checkout function
    res.json({ checkoutLink });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ error: "Failed to initiate checkout" });
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
  // testSquareApi();
  //testCreateCheckout();
});
