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
  listItems,
} = require("./api/square");
const axios = require("axios");
const {
  pool,
  getInventoryItems,
  getInventoryItemById,
  listTables,
  createRequest,
  getRequests,
  updateRequestStatus,
  createInventoryTable,
  deleteZeroQuantityItems,
  syncInventoryFromSquare,
  deleteInventoryItem,
  deleteRequestById,
  deleteTable,
  testInventoryAccess,
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
      catalogObjectId: item.catalog_object_id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      quantity: item.quantity,
      imageUrls: item.image_urls || [],
      v_quantities: item.v_quantities || [],
    }));

    console.log(formattedItems);
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
      quantity: item.quantity,
      v_ids: item.v_ids || [],
      v_names: item.v_names || [],
      v_quantities: item.v_quantities || [],
      lastUpdated: item.last_updated,
    };

    console.log(formattedItem);
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

    // Only process successful payments that are COMPLETED
    if (
      event.type === "payment.updated" &&
      event.data?.object?.payment?.status === "COMPLETED" &&
      !event.data?.object?.payment?.refunded
    ) {
      const orderId = event.data.object.payment.orderId;
      if (orderId) {
        await decrementInventory(orderId);
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

const getImageUrls = async (imageIds) => {
  const imageUrls = await Promise.all(
    imageIds.map(async (imageId) => {
      const imageResponse = await client.catalogApi.retrieveCatalogObject(
        imageId
      );
      return imageResponse.result.object.imageData.url;
    })
  );
  return imageUrls;
};

async function handleInventoryUpdate(event) {
  try {
    if (!event?.object?.inventory_counts?.[0]) {
      console.log("Invalid inventory event data:", event);
      return;
    }

    const inventoryCount = event.object.inventory_counts[0];
    const variationId = inventoryCount.catalog_object_id;
    const newQuantity = inventoryCount.quantity;

    const dbClient = await pool.connect();

    try {
      await dbClient.query("BEGIN");

      // First, get the item details from Square
      const variationResponse = await client.catalogApi.retrieveCatalogObject(
        variationId
      );
      const variation = variationResponse.result.object;
      const itemId = variation.itemVariationData.itemId;

      // Get the current item data from database
      const getItemQuery = `
        SELECT * FROM inventory WHERE item_id = $1;
      `;
      const itemResult = await dbClient.query(getItemQuery, [itemId]);

      if (itemResult.rows.length === 0) {
        // Handle new item case
        const itemResponse = await client.catalogApi.retrieveCatalogObject(
          itemId
        );
        const item = itemResponse.result.object;
        const { name, description, variations } = item.itemData;

        // Format variations
        const v_ids = [];
        const v_names = [];
        const v_quantities = [];

        for (const v of variations) {
          v_ids.push(v.id);
          v_names.push(v.itemVariationData.name);
          // Get quantity for each variation
          const vInventoryResponse =
            await client.inventoryApi.retrieveInventoryCount(v.id);
          const vQuantity =
            vInventoryResponse.result.counts?.[0]?.quantity || "0";
          v_quantities.push(parseInt(vQuantity));
        }

        const insertQuery = `
          INSERT INTO inventory (
            item_id,
            catalog_object_id,
            name,
            description,
            price,
            quantity,
            image_urls,
            v_ids,
            v_names,
            v_quantities,
            last_updated
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW());
        `;

        // Get the price from the first variation
        const basePrice = variations[0]?.itemVariationData?.priceMoney?.amount
          ? Number(variations[0].itemVariationData.priceMoney.amount) / 100
          : 0;

        // Calculate total quantity across all variations
        const totalQuantity = v_quantities.reduce((sum, qty) => sum + qty, 0);

        // Get image URLs if available
        const imageUrls = item.itemData.imageIds
          ? await getImageUrls(item.itemData.imageIds)
          : [];

        await dbClient.query(insertQuery, [
          itemId,
          item.id, // catalog_object_id
          name,
          description,
          basePrice,
          totalQuantity,
          imageUrls,
          v_ids,
          v_names,
          v_quantities,
        ]);
      } else {
        // Update existing item's variation quantity
        const currentItem = itemResult.rows[0];
        const variationIndex = currentItem.v_ids.indexOf(variationId);

        if (variationIndex === -1) {
          throw new Error(
            `Variation ${variationId} not found in item ${itemId}`
          );
        }

        const newQuantities = [...currentItem.v_quantities];
        newQuantities[variationIndex] = parseInt(newQuantity);

        const updateQuery = `
          UPDATE inventory 
          SET v_quantities = $1, 
              last_updated = NOW()
          WHERE item_id = $2;
        `;

        await dbClient.query(updateQuery, [newQuantities, itemId]);
      }

      await dbClient.query("COMMIT");
    } catch (error) {
      await dbClient.query("ROLLBACK");
      throw error;
    } finally {
      dbClient.release();
    }
  } catch (error) {
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

// async function syncInventoryFromSquare() {
//   const client = await pool.connect();
//   try {
//     const items = await listItems();

//     await client.query("BEGIN");

//     for (const item of items) {
//       const { id, name, description, variations } = item;

//       const v_ids = variations.map(v => v.v_id);
//       const v_names = variations.map(v => v.v_name);
//       const v_quantities = await Promise.all(
//         v_ids.map(async (vid) => {
//           const response = await client.inventoryApi.retrieveInventoryCount(vid);
//           return parseInt(response.result.counts?.[0]?.quantity || "0");
//         })
//       );

//       const upsertQuery = `
//         INSERT INTO inventory (
//           item_id,
//           name,
//           description,
//           v_ids,
//           v_names,
//           v_quantities,
//           last_updated
//         )
//         VALUES ($1, $2, $3, $4, $5, $6, NOW())
//         ON CONFLICT (item_id)
//         DO UPDATE SET
//           name = EXCLUDED.name,
//           description = EXCLUDED.description,
//           v_ids = EXCLUDED.v_ids,
//           v_names = EXCLUDED.v_names,
//           v_quantities = EXCLUDED.v_quantities,
//           last_updated = NOW();
//       `;

//       await client.query(upsertQuery, [
//         id,
//         name || "No name available",
//         description || "No description available",
//         v_ids,
//         v_names,
//         v_quantities
//       ]);
//     }

//     await client.query("COMMIT");
//   } catch (error) {
//     await client.query("ROLLBACK");
//     throw error;
//   } finally {
//     client.release();
//   }
// }

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// async function showAllInventory() {
//   try {
//     const client = await pool.connect();
//     const result = await client.query(`
//       SELECT
//         name,
//         description,
//         v_names,
//         v_quantities,
//         last_updated
//       FROM inventory
//       ORDER BY name ASC;
//     `);

//     console.log("\n=== Current Inventory ===");
//     result.rows.forEach((item) => {
//       console.log(`\nProduct: ${item.name}`);
//       console.log(`Description: ${item.description}`);
//       console.log("Variations:");
//       item.v_names.forEach((name, index) => {
//         console.log(`  - ${name}: ${item.v_quantities[index]} units`);
//       });
//       console.log(`Last Updated: ${item.last_updated}`);
//       console.log("------------------------");
//     });

//     client.release();
//     return result.rows;
//   } catch (err) {
//     console.error("Error showing inventory:", err.stack);
//     throw err;
//   }
// }

// showAllInventory();
