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
  getInventoryCounts,
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

const { Client, Environment } = require("square");
require("dotenv").config();

const app = express();
const upload = multer();

const client = new Client({
  environment: Environment.Production,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
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

async function syncInventoryFromSquare() {
  console.log("Starting inventory sync from Square...");
  const client = await pool.connect();

  try {
    // Get current items from database for comparison
    const currentItems = await client.query(
      "SELECT item_id, last_updated FROM inventory"
    );
    const currentItemsMap = new Map(
      currentItems.rows.map((item) => [item.item_id, item])
    );

    // Get items from Square
    const items = await listItems();
    console.log(`Found ${items.length} items in Square`);

    await client.query("BEGIN");

    // Track processed items to identify deletions
    const processedItemIds = new Set();

    for (const item of items) {
      processedItemIds.add(item.id);
      const quantity = await getInventoryCounts(item.id);

      // Check if item needs updating
      const currentItem = currentItemsMap.get(item.id);
      if (!currentItem) {
        console.log(`Adding new item: ${item.name} (ID: ${item.id})`);
      } else {
        console.log(`Updating existing item: ${item.name} (ID: ${item.id})`);
      }

      await client.query(
        `
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
        ON CONFLICT (item_id)
        DO UPDATE SET
          catalog_object_id = EXCLUDED.catalog_object_id,
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          quantity = EXCLUDED.quantity,
          price = EXCLUDED.price,
          image_urls = EXCLUDED.image_urls,
          last_updated = NOW();
        `,
        [
          item.id,
          item.catalog_object_id,
          item.name,
          item.description,
          quantity,
          item.price,
          item.imageUrls,
        ]
      );
    }

    // Remove items that no longer exist in Square
    const itemsToDelete = [...currentItemsMap.keys()].filter(
      (id) => !processedItemIds.has(id)
    );

    if (itemsToDelete.length > 0) {
      console.log(`Removing ${itemsToDelete.length} deleted items`);
      await client.query(`DELETE FROM inventory WHERE item_id = ANY($1)`, [
        itemsToDelete,
      ]);
    }

    await client.query("COMMIT");
    console.log("Inventory sync completed successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error syncing inventory:", error);
    throw error;
  } finally {
    client.release();
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

const SYNC_COOLDOWN = 60000; // 1 minute
let lastSyncTime = 0;
let syncInProgress = false;

app.post("/webhook/catalog", async (req, res) => {
  try {
    const event = req.body;
    console.log("Received catalog webhook event:", event.type);

    if (event.type === "catalog.version.updated") {
      const now = Date.now();

      // Check if sync is in progress or within cooldown period
      if (syncInProgress) {
        console.log("Sync already in progress, skipping");
        return res.status(200).send("Sync already in progress");
      }

      if (now - lastSyncTime < SYNC_COOLDOWN) {
        console.log("Skipping sync due to cooldown period");
        return res.status(200).send("Sync skipped (cooldown period)");
      }

      try {
        syncInProgress = true;
        await syncInventoryFromSquare();
        lastSyncTime = Date.now();
        console.log("Successfully synced inventory from Square");
      } finally {
        syncInProgress = false;
      }
    }

    res.status(200).send("Catalog webhook processed successfully");
  } catch (error) {
    console.error("Error processing catalog webhook:", error);
    syncInProgress = false; // Make sure to release the lock even if there's an error
    res.status(500).send("Error processing catalog webhook");
  }
});

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

async function testInventoryAccess() {
  try {
    console.log("Creating inventory table if it doesn't exist...");
    await createInventoryTable();

    console.log("\nFetching inventory items...");
    const items = await getInventoryItems();

    if (items.length === 0) {
      console.log("No items found in inventory table.");
    } else {
      console.log("\nInventory Items:");
      items.forEach((item) => {
        console.log("\n------------------------");
        console.log(`ID: ${item.item_id}`);
        console.log(`Name: ${item.name}`);
        console.log(`Description: ${item.description}`);
        console.log(`Quantity: ${item.quantity}`);
        console.log(`Price: $${item.price}`);
        console.log(`Last Updated: ${item.last_updated}`);
        console.log(
          `Image URLs: ${item.image_urls ? item.image_urls.join(", ") : "None"}`
        );
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteInventoryItem(itemId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const deleteQuery = `
      DELETE FROM inventory 
      WHERE item_id = $1
      RETURNING name;
    `;

    const result = await client.query(deleteQuery, [itemId]);

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      console.log(`No item found with item_id: ${itemId}`);
      return false;
    }

    const itemName = result.rows[0].name;
    await client.query("COMMIT");

    console.log(`Successfully deleted item: ${itemName} (ID: ${itemId})`);
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting inventory item:", error);
    throw error;
  } finally {
    client.release();
  }
}

//deleteInventoryItem("QGATGG6URFOLPC3QCWGQ3NAA");

//createInventoryTable();
// listTables();
// syncInventoryFromSquare();
// testInventoryAccess();
