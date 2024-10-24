const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const { uploadImages, uploadMetadata } = require("./api/aws");
const {
  listItems,
  getItemById,
  //testSquareApi,
  createCheckout,
  // testCreateCheckout,
} = require("./api/square");
const crypto = require("crypto");

require("dotenv").config();

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
    const shortTimestamp = Math.floor(Date.now() / 1000); // Seconds since Unix epoch
    const randomString = crypto.randomBytes(3).toString("hex"); // Generate a short random string
    return `${shortTimestamp}-${randomString}`;
  };

  const uniqueIdentifier = generateUniqueIdentifier();

  try {
    const customerData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      description: req.body.description,
    };
    // Upload metadata once
    await uploadMetadata(customerData, uniqueIdentifier);
    // Upload images
    const imageUrls = await uploadImages(req.files, customerData, uniqueIdentifier);

    res.status(200).json({ imageUrls });
  } catch (error) {
    console.error("Error uploading images: ", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
});

app.post("/api/checkout", async (req, res) => {
  const { cartItems } = req.body;
  try {
    const checkoutLink = await createCheckout(cartItems);
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
  //testSquareApi();
  //testCreateCheckout();
  // displayOrders();
});
