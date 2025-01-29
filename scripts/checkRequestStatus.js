const { pool } = require("../backend/db/config");

(async () => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT is_requests_open FROM settings LIMIT 1"
    );
    client.release();

    if (result.rows.length > 0) {
      const isRequestsOpen = result.rows[0].is_requests_open;
      console.log(
        `Requests are currently ${isRequestsOpen ? "open" : "closed"}.`
      );
    } else {
      console.log("No settings found in the database.");
    }
  } catch (error) {
    console.error("Error checking requests status:", error);
  } finally {
    process.exit(0);
  }
})();
