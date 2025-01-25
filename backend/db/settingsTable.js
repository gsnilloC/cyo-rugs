const { pool } = require("./config");

async function createSettingsTable() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        is_requests_open BOOLEAN DEFAULT TRUE
      );
    `);
    console.log("Settings table created or already exists");
    client.release();
  } catch (err) {
    console.error("Error creating settings table:", err.stack);
    throw err;
  }
}

async function updateRequestsStatus(isOpen) {
  try {
    const client = await pool.connect();
    await client.query("UPDATE settings SET is_requests_open = $1", [isOpen]);
    client.release();
  } catch (err) {
    console.error("Error updating requests status:", err.stack);
    throw err;
  }
}

async function getRequestsStatus() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT is_requests_open FROM settings LIMIT 1"
    );
    client.release();
    return result.rows[0].is_requests_open;
  } catch (err) {
    console.error("Error fetching requests status:", err.stack);
    throw err;
  }
}

module.exports = {
  createSettingsTable,
  updateRequestsStatus,
  getRequestsStatus,
};
