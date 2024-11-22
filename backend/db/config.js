const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  allowExitOnIdle: false,
  keepAlive: true,
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT NOW()");
    console.log("Database connected successfully at:", res.rows[0].now);
    client.release();
  } catch (err) {
    console.error("Database connection error:", err.stack);
    process.exit(-1);
  }
}

async function listTables() {
  try {
    const client = await pool.connect();
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log(
      "Database tables:",
      res.rows.map((row) => row.table_name)
    );
    client.release();
    return res.rows;
  } catch (err) {
    console.error("Error listing tables:", err.stack);
    throw err;
  }
}

async function createInventoryTable() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        item_id TEXT PRIMARY KEY,
        catalog_object_id TEXT,
        name TEXT NOT NULL,
        description TEXT,
        quantity INTEGER DEFAULT 0,
        price DECIMAL(10,2) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        image_urls TEXT[]
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
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT * FROM inventory
      ORDER BY last_updated DESC;
    `);
    client.release();
    return result.rows;
  } catch (err) {
    console.error("Error getting inventory items:", err.stack);
    throw err;
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
    return result.rows[0];
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

module.exports = {
  pool,
  testConnection,
  listTables,
  createInventoryTable,
  getInventoryItems,
  getInventoryItemById,
};
