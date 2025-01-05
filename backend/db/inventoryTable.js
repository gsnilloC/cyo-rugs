const { pool } = require("./config");
const squareClient = require("../services/squareClient");

async function createInventoryTable() {
  try {
    const client = await pool.connect();
    await client.query(`
       CREATE TABLE IF NOT EXISTS inventory (
    item_id TEXT PRIMARY KEY,
    catalog_object_id TEXT,
    name TEXT,
    description TEXT,
    price NUMERIC,
    quantity INTEGER,
    image_urls TEXT[], -- Array to store multiple image URLs
    v_ids TEXT[],      -- Array to store variation IDs
    v_names TEXT[],    -- Array to store variation names
    v_quantities INTEGER[], -- Array to store variation quantities
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
      `);
    console.log("Inventory table created or already exists");
    client.release();
  } catch (err) {
    console.error("Error creating inventory table:", err.stack);
    throw err;
  }
}

async function getInventoryItems() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(`
        SELECT * FROM inventory
        ORDER BY last_updated DESC;
      `);
    return result.rows;
  } catch (err) {
    console.error("Error getting inventory items:", err.stack);
    throw err;
  } finally {
    if (client) {
      client.release(true);
    }
  }
}

async function getInventoryItemById(itemId) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `
        SELECT * FROM inventory
        WHERE item_id = $1;
      `,
      [itemId]
    );
    client.release();

    if (result.rows.length === 0) {
      return null;
    }

    const item = result.rows[0];

    return item;
  } catch (err) {
    console.error("Error getting inventory item:", err.stack);
    throw err;
  }
}

async function deleteTable(tableName) {
  try {
    const client = await pool.connect();
    await client.query(`
        DROP TABLE IF EXISTS ${tableName} CASCADE;
      `);
    console.log(`Table '${tableName}' deleted successfully`);
    client.release();
  } catch (err) {
    console.error(`Error deleting table '${tableName}':`, err.stack);
    throw err;
  }
}

const getImageUrls = async (imageIds) => {
  const imageUrls = await Promise.all(
    imageIds.map(async (imageId) => {
      const imageResponse = await squareClient.catalogApi.retrieveCatalogObject(
        imageId
      );
      return imageResponse.result.object.imageData.url;
    })
  );
  return imageUrls;
};

async function handleInventoryUpdate(event) {
  try {
    if (!squareClient || !squareClient.catalogApi) {
      throw new Error("Square client is not properly initialized");
    }

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
      const variationResponse =
        await squareClient.catalogApi.retrieveCatalogObject(variationId);
      const variation = variationResponse.result.object;
      const itemId = variation.itemVariationData.itemId;

      // Get the current item data from database
      const getItemQuery = `
        SELECT * FROM inventory WHERE item_id = $1;
      `;
      const itemResult = await dbClient.query(getItemQuery, [itemId]);

      if (itemResult.rows.length === 0) {
        // Handle new item case
        const itemResponse =
          await squareClient.catalogApi.retrieveCatalogObject(itemId);
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
            await squareClient.inventoryApi.retrieveInventoryCount(v.id);
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

async function deleteZeroQuantityItems() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const deleteQuery = `
      DELETE FROM inventory 
      WHERE NOT EXISTS (
        SELECT 1
        FROM unnest(v_quantities) AS qty
        WHERE qty > 0
      )
      RETURNING *;
    `;
    const result = await client.query(deleteQuery);
    await client.query("COMMIT");
    console.log(`Deleted ${result.rowCount} items with zero quantity`);
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting items with zero quantity:", error);
    throw error;
  } finally {
    client.release();
  }
}

async function deleteInventoryItemByName(itemName) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const deleteQuery = `
      DELETE FROM inventory 
      WHERE name = $1
      RETURNING name;
    `;

    const result = await client.query(deleteQuery, [itemName]);

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      console.log(`No item found with name: ${itemName}`);
      return false;
    }

    const deletedItemName = result.rows[0].name;
    await client.query("COMMIT");

    console.log(`Successfully deleted item: ${deletedItemName}`);
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting inventory item by name:", error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  createInventoryTable,
  getInventoryItems,
  getInventoryItemById,
  deleteTable,
  handleInventoryUpdate,
  deleteInventoryItem,
  deleteZeroQuantityItems,
  deleteInventoryItemByName,
};
