const express = require("express");
const router = express.Router();
const {
  getRequests,
  updateRequestStatus,
  deleteRequestById,
} = require("../../db");

router.get("/", async (req, res) => {
  try {
    const requests = await getRequests();
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
});

router.patch("/:id/status", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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

module.exports = router;
