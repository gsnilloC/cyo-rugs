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
  testCreateQuickPay,
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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.post("/api/checkout", async (req, res) => {
  const { amount } = req.body; // Get the amount from the request body
  try {
    const checkoutLink = await createCheckout(amount); // Call the createCheckout function
    res.json({ checkoutLink }); // Send the checkout link back to the client
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ error: "Failed to initiate checkout" });
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // testSquareApi();
  // testCreateQuickPay();
});
