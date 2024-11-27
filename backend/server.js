const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const { uploadImages } = require("./api/aws");
const express = require("express");
const {
  createCheckout,
  decrementInventory,
  getPricesForItemIds,
} = require("./api/square");
const axios = require("axios");
const {
  pool,
  getInventoryItems,
  getInventoryItemById,
  createRequest,
  getRequests,
  updateRequestStatus,
  deleteZeroQuantityItems,
  syncInventoryFromSquare,
  deleteInventoryItem,
  deleteRequestById,
} = require("./db/config");
const { Client, Environment } = require("square");
require("dotenv").config();

const app = express();
const upload = multer();

const client = new Client({
  environment: Environment.Production,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../build")));

// app.use((req, res, next) => {
//   if (req.headers["x-forwarded-proto"] !== "https") {
//     return res.redirect("https://" + req.headers.host + req.url);
//   }
//   next();
// });

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

    const customerData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      description: req.body.description,
    };

    // Upload images to S3
    const imageUrls = await uploadImages(
      req.files,
      customerData,
      Date.now().toString()
    );

    // Store request data in PostgreSQL
    const createdRequest = await createRequest(customerData, imageUrls);

    res.status(200).json({
      request: createdRequest,
      message: "Request submitted successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const requests = await getRequests();
    res.status(200).json(requests);
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

const processedPayments = new Set();

app.post("/webhook/payment", async (req, res) => {
  try {
    const event = req.body;
    console.log("Received payment webhook event:", event.type);

    if (event.type === "payment.updated") {
      const paymentData = event.data.object.payment;
      if (paymentData && paymentData.status === "COMPLETED") {
        const paymentId = paymentData.id;
        if (!processedPayments.has(paymentId)) {
          const orderId = paymentData.order_id;
          if (orderId) {
            await decrementInventory(orderId);
            processedPayments.add(paymentId);
          }
        }
      }
    }

    res.status(200).send("Payment webhook processed successfully");
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    res.status(500).send("Error processing payment webhook");
  }
});

app.post("/webhook/inventory", async (req, res) => {
  try {
    const event = req.body;
    console.log("Received inventory webhook event:", event.type);

    if (event.type === "inventory.count.updated") {
      await handleInventoryUpdate(event.data);
      console.log("Successfully processed inventory update");
    }

    res.status(200).send("Inventory webhook processed successfully");
  } catch (error) {
    console.error("Error processing inventory webhook:", error);
    res.status(500).send("Error processing inventory webhook");
  }
});

// app.post("/webhook/catalog", async (req, res) => {
//   try {
//     const event = req.body;
//     console.log("Received catalog webhook event:", event.type);

//     if (event.type === "catalog.version.updated") {
//       const now = Date.now();

//       // Check if sync is in progress or within cooldown period
//       if (syncInProgress) {
//         console.log("Sync already in progress, skipping");
//         return res.status(200).send("Sync already in progress");
//       }

//       if (now - lastSyncTime < SYNC_COOLDOWN) {
//         console.log("Skipping sync due to cooldown period");
//         return res.status(200).send("Sync skipped (cooldown period)");
//       }

//       try {
//         syncInProgress = true;
//         await syncInventoryFromSquare();
//         lastSyncTime = Date.now();
//         console.log("Successfully synced inventory from Square");
//       } finally {
//         syncInProgress = false;
//       }
//     }

//     res.status(200).send("Catalog webhook processed successfully");
//   } catch (error) {
//     console.error("Error processing catalog webhook:", error);
//     syncInProgress = false; // Make sure to release the lock even if there's an error
//     res.status(500).send("Error processing catalog webhook");
//   }
// });

async function handleInventoryUpdate(event) {
  try {
    if (!event?.object?.inventory_counts?.[0]) {
      console.log("Invalid inventory event data:", event);
      return;
    }

    const inventoryCount = event.object.inventory_counts[0];
    const catalogObjectId = inventoryCount.catalog_object_id;
    const quantity = inventoryCount.quantity;

    const dbClient = await pool.connect();

    try {
      await dbClient.query("BEGIN");

      const updateQuery = `
        UPDATE inventory 
        SET quantity = $1, 
            last_updated = NOW()
        WHERE catalog_object_id = $2
        RETURNING *;
      `;

      const result = await dbClient.query(updateQuery, [
        quantity,
        catalogObjectId,
      ]);

      if (result.rows.length === 0) {
        console.log(
          `New item detected with catalog_object_id: ${catalogObjectId}`
        );

        try {
          const variationResponse =
            await client.catalogApi.retrieveCatalogObject(catalogObjectId);
          const variation = variationResponse.result.object;

          const itemResponse = await client.catalogApi.retrieveCatalogObject(
            variation.itemVariationData.itemId
          );
          const item = itemResponse.result.object;

          const { name, description, imageIds } = item.itemData;
          const priceAmount = Number(
            variation.itemVariationData.priceMoney.amount
          );
          const price = priceAmount / 100;

          const imageUrls =
            imageIds && imageIds.length > 0
              ? await Promise.all(
                  imageIds.map(async (imageId) => {
                    const imageResponse =
                      await client.catalogApi.retrieveCatalogObject(imageId);
                    return imageResponse.result.object.imageData.url;
                  })
                )
              : [];

          const insertQuery = `
            INSERT INTO inventory (
              item_id,
              catalog_object_id,
              name,
              description,
              quantity,
              price,
              image_urls,
              last_updated
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            RETURNING *;
          `;

          await dbClient.query(insertQuery, [
            variation.itemVariationData.itemId,
            catalogObjectId,
            name || "No name available",
            description || "No description available",
            quantity,
            price,
            imageUrls,
          ]);

          console.log(
            `Successfully added new item: ${name} (ID: ${variation.itemVariationData.itemId})`
          );
        } catch (error) {
          if (error.statusCode === 404) {
            console.log(
              `Ignoring 404 error for catalog object ID: ${catalogObjectId}`
            );
            // Skip this item and continue
            await dbClient.query("COMMIT");
            return;
          }
          throw error; // Re-throw other errors
        }
      } else {
        console.log(
          `Successfully updated inventory for item ${result.rows[0].name} (ID: ${result.rows[0].item_id}) to quantity ${quantity}`
        );
      }

      await dbClient.query("COMMIT");
    } catch (error) {
      await dbClient.query("ROLLBACK");
      throw error;
    } finally {
      dbClient.release();
    }
  } catch (error) {
    if (error.statusCode === 404) {
      console.log("Ignoring 404 error for catalog object");
      return;
    }
    console.error("Error in handleInventoryUpdate:", error);
    throw error;
  }
}

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
    return response.data.success;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

app.patch("/api/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      !["Received", "In Progress", "Preparing for Shipping", "Done"].includes(
        status
      )
    ) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedRequest = await updateRequestStatus(id, status);

    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: "Failed to update request status" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.delete("/api/inventory/cleanup", async (req, res) => {
  try {
    const result = await deleteZeroQuantityItems();
    res.status(200).json({
      message: `Deleted ${result.rowCount} items with zero quantity.`,
    });
  } catch (error) {
    console.error("Error deleting items with zero quantity:", error);
    res
      .status(500)
      .json({ error: "Failed to delete items with zero quantity" });
  }
});

app.post("/api/update-prices", async (req, res) => {
  try {
    // Fetch all item IDs from the database
    const client = await pool.connect();
    const result = await client.query("SELECT item_id FROM inventory");
    const itemIds = result.rows.map((row) => row.item_id);

    // Get the latest prices from Square
    const prices = await getPricesForItemIds(itemIds);

    // Update prices in the database
    await client.query("BEGIN");
    for (const { id, price } of prices) {
      const updateQuery = `
        UPDATE inventory
        SET price = $1
        WHERE item_id = $2;
      `;
      await client.query(updateQuery, [price, id]);
    }
    await client.query("COMMIT");

    res.status(200).json({ message: "Prices updated successfully" });
  } catch (error) {
    console.error("Error updating prices:", error);
    res.status(500).json({ error: "Failed to update prices" });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteRequestById(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ error: "Failed to delete request" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
