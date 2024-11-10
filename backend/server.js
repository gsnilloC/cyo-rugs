const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const { uploadImages, uploadMetadata, listOrders } = require("./api/aws");
const {
  listItems,
  getItemById,
  testSquareApi,
  createCheckout,
  // testCreateCheckout,
} = require("./api/square");

require("dotenv").config();

console.log(process.env.PORT);
const app = express();
const upload = multer();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

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

app.post("/api/upload", upload.array("images", 3), async (req, res) => {
  const generateUniqueIdentifier = () => {
    const shortTimestamp = Math.floor(Date.now() / 1000); 
    return `${shortTimestamp}`;
  };

  const uniqueIdentifier = generateUniqueIdentifier();

  try {
    const customerData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      description: req.body.description,
    };
    await uploadMetadata(customerData, uniqueIdentifier);
    const imageUrls = await uploadImages(
      req.files,
      customerData,
      uniqueIdentifier
    );

    res.status(200).json({ imageUrls });
  } catch (error) {
    console.error("Error uploading images: ", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await listOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
});

app.post("/api/checkout", async (req, res) => {
  const { cartItems } = req.body;
  try {
    const checkoutLink = await createCheckout(cartItems);
    res.json({ checkoutLink });
  } catch (error) {
    console.error("Error during checkout:", error);
    const errorMessage = error.message;

    res.status(500).json({ error: errorMessage });
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
  //testSquareApi();
  //testCreateCheckout();
});
