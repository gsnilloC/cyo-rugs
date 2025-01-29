const { pool } = require("../backend/db/config");

async function changeRequestStatus(isOpen) {
  try {
    const client = await pool.connect();
    await client.query("UPDATE settings SET is_requests_open = $1", [isOpen]);
    console.log(`Request status changed to ${isOpen ? "open" : "closed"}.`);
    client.release();
  } catch (error) {
    console.error("Error changing request status:", error.stack);
  } finally {
    process.exit(0);
  }
}

// Change the status by passing true (open) or false (closed)
const newStatus = process.argv[2] === "open";
changeRequestStatus(newStatus);
