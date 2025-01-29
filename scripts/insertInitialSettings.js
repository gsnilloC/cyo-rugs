const { pool } = require("../backend/db/config");

(async () => {
  try {
    const client = await pool.connect();
    await client.query(
      "INSERT INTO settings (is_requests_open) VALUES (TRUE) ON CONFLICT DO NOTHING"
    );
    console.log("Initial settings inserted successfully.");
    client.release();
  } catch (error) {
    console.error("Error inserting initial settings:", error);
  } finally {
    process.exit(0);
  }
})();
