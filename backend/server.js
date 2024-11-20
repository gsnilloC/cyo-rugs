const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const { uploadImages, uploadMetadata, listOrders } = require("./api/aws");
const express = require("express");
const {
  listItems,
  getItemById,
  createCheckout,
  getInventoryCount,
  decrementInventory,
} = require("./api/square");
const rateLimit = require("express-rate-limit");
const axios = require("axios");

require("dotenv").config();

console.log(process.env.PORT);
const app = express();
const upload = multer();

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // limit each IP to 5 requests per windowMs
  message:
    "Too many upload requests from this IP, please try again after an hour",
});

// // Force HTTPS in production
// app.use((req, res, next) => {
//   // Check if the request is over HTTP
//   if (req.headers["x-forwarded-proto"] !== "https") {
//     // Redirect to HTTPS version
//     return res.redirect("https://" + req.headers.host + req.url);
//   }
//   next();
// });

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

app.post("/api/upload", upload.array("images"), async (req, res) => {
  try {
    const recaptchaToken = req.body.recaptchaToken;
    const isHuman = await verifyRecaptcha(recaptchaToken);

    if (!isHuman) {
      console.log("reCAPTCHA verification failed");
      return res.status(400).json({
        error: "reCAPTCHA verification failed. Please try again.",
      });
    }

    console.log("reCAPTCHA verification successful");

    const generateUniqueIdentifier = () => {
      const shortTimestamp = Math.floor(Date.now() / 1000);
      return `${shortTimestamp}`;
    };

    const uniqueIdentifier = generateUniqueIdentifier();

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
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
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

app.get("/api/inventory/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const inventoryCount = await getInventoryCount(id);
    res.json({ inventoryCount });
  } catch (error) {
    console.error("Error retrieving inventory count:", error);
    res.status(500).json({ error: "Failed to retrieve inventory count" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const processedPayments = new Set();

app.post("/webhook", async (req, res) => {
  console.log("in webhook");
  const event = req.body;
  console.log("Received event:");

  const paymentData = event.data.object.payment;
  console.log("Payment data:");

  switch (event.type) {
    case "payment.updated":
      console.log("Processing payment.updated event");

      if (paymentData && paymentData.status === "COMPLETED") {
        console.log("Payment was completed!");
        const paymentId = paymentData.id;

        if (!processedPayments.has(paymentId)) {
          const orderId = paymentData.order_id;

          if (orderId) {
            await decrementInventory(orderId);
            processedPayments.add(paymentId);
          } else {
            console.log("No order_id found in payment data.");
          }
        } else {
          console.log("Payment already processed, skipping...");
        }
      } else {
        console.log("Payment not completed or status missing");
      }
      break;

    default:
      console.warn("Unhandled event type:", event.type);
  }

  res.status(200).send("Event received");
});

async function verifyRecaptcha(token) {
  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    console.log("reCAPTCHA verification response:", response.data);
    return response.data.success;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
