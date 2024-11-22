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
const axios = require("axios");
const {
  pool,
  testConnection,
  listTables,
  createInventoryTable,
  getInventoryItems,
  getInventoryItemById,
} = require("./db/config");

require("dotenv").config();

console.log(process.env.PORT);
const app = express();
const upload = multer();

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

// Add this utility function for delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Add this retry wrapper function
async function withRetry(operation, maxAttempts = 3, initialDelay = 1000) {
  let attempt = 1;
  let lastError;

  while (attempt <= maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (error.status === 429 && attempt < maxAttempts) {
        const waitTime = initialDelay * Math.pow(2, attempt - 1); // exponential backoff
        console.log(
          `Rate limited. Retrying in ${waitTime}ms (attempt ${attempt}/${maxAttempts})`
        );
        await delay(waitTime);
        attempt++;
      } else {
        throw error;
      }
    }
  }
  throw lastError;
}

async function syncInventoryFromSquare() {
  console.log("Starting inventory sync from Square...");
  try {
    // Fetch all items from Square
    const items = await listItems();
    console.log(`Found ${items.length} items in Square`);

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      for (const item of items) {
        // Get inventory count for each item
        const quantity = await getInventoryCount(item.id);
        console.log(
          `Processing item: ${item.name} (ID: ${item.id}) - Quantity: ${quantity}`
        );

        // Insert or update the item in the database
        await client.query(
          `
          INSERT INTO inventory (item_id, name, description, quantity, price, image_urls, last_updated)
          VALUES ($1, $2, $3, $4, $5, $6, NOW())
          ON CONFLICT (item_id)
          DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            quantity = EXCLUDED.quantity,
            price = EXCLUDED.price,
            image_urls = EXCLUDED.image_urls,
            last_updated = NOW();
          `,
          [
            item.id,
            item.name,
            item.description,
            quantity,
            item.price,
            item.imageUrls,
          ]
        );
      }

      await client.query("COMMIT");
      console.log("Inventory sync completed successfully");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error syncing inventory:", error);
    throw error;
  }
}

// Modify the items endpoint to use retry logic
app.get("/api/items", async (req, res) => {
  try {
    const items = await getInventoryItems();
    const formattedItems = items.map((item) => ({
      id: item.item_id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      imageUrls: item.image_urls || [],
    }));
    res.json(formattedItems);
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ error: "Failed to retrieve items" });
  }
});

app.get("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await getInventoryItemById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    const formattedItem = {
      id: item.item_id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      imageUrls: item.image_urls || [],
    };
    res.json(formattedItem);
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

// Modify the inventory endpoint to use retry logic
app.get("/api/inventory/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await getInventoryItemById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ inventoryCount: item.quantity });
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

// async function testInventoryAccess() {
//   try {
//     console.log("Creating inventory table if it doesn't exist...");
//     await createInventoryTable();

//     console.log("\nFetching inventory items...");
//     const items = await getInventoryItems();

//     if (items.length === 0) {
//       console.log("No items found in inventory table.");
//     } else {
//       console.log("\nInventory Items:");
//       items.forEach((item) => {
//         console.log("\n------------------------");
//         console.log(`ID: ${item.item_id}`);
//         console.log(`Name: ${item.name}`);
//         console.log(`Description: ${item.description}`);
//         console.log(`Quantity: ${item.quantity}`);
//         console.log(`Price: $${item.price}`);
//         console.log(`Last Updated: ${item.last_updated}`);
//         console.log(
//           `Image URLs: ${item.image_urls ? item.image_urls.join(", ") : "None"}`
//         );
//       });
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     await pool.end();
//   }
// }

// createInventoryTable();
// listTables();
// testInventoryAccess();
//syncInventoryFromSquare();
