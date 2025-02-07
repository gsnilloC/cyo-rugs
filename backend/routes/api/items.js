const express = require("express");
const router = express.Router();
const { getInventoryItems, getInventoryItemById } = require("../../db");

// GET /api/items
router.get("/", async (req, res) => {
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

    res.json(formattedItems);
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ error: "Failed to retrieve items" });
  }
});

// GET /api/items/:id
router.get("/:id", async (req, res) => {
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

    res.json(formattedItem);
  } catch (error) {
    console.error("Error retrieving item:", error);
    res.status(500).json({ error: "Failed to retrieve item" });
  }
});

router.get("/checkout-success", (req, res) => {
  res.json({ message: "Checkout was successful!"});
})
module.exports = router;
