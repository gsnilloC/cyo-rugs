const express = require("express");
const router = express.Router();
const {
  pool,
  getInventoryItemById,
  deleteZeroQuantityItems,
} = require("../../db");
const { getPricesForItemIds } = require("../../services");

router.get("/:id", async (req, res) => {
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

router.delete("/cleanup", async (req, res) => {
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

router.post("/update-prices", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT item_id FROM inventory");
    const itemIds = result.rows.map((row) => row.item_id);

    const prices = await getPricesForItemIds(itemIds);

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

module.exports = router;
