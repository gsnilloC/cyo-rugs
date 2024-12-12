const { handleInventoryUpdate } = require("../../db");

const handleInventoryWebhook = async (req, res) => {
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
};

module.exports = handleInventoryWebhook;
