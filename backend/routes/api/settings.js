const express = require("express");
const router = express.Router();
const {
  updateRequestsStatus,
  getRequestsStatus,
} = require("../../db/settingsTable");

router.patch("/requests-status", async (req, res) => {
  try {
    const { isOpen } = req.body;
    console.log("Status in api: " + req.body);
    await updateRequestsStatus(isOpen);
    res.status(200).json({ message: "Requests status updated successfully" });
  } catch (error) {
    console.error("Error updating requests status:", error);
    res.status(500).json({ error: "Failed to update requests status" });
  }
});

router.get("/requests-status", async (req, res) => {
  try {
    const status = await getRequestsStatus();
    res.status(200).json({ is_requests_open: status });
  } catch (error) {
    console.error("Error fetching requests status:", error);
    res.status(500).json({ error: "Failed to fetch requests status" });
  }
});

module.exports = router;
