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

async function createRequestsTable() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        description TEXT NOT NULL,
        image_urls TEXT[],
        status TEXT DEFAULT 'Received' CHECK (status IN ('Received', 'In Progress', 'Preparing for Shipping', 'Done')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Requests table created or already exists");
    client.release();
  } catch (err) {
    console.error("Error creating requests table:", err.stack);
    throw err;
  }
}

async function createRequest(requestData, imageUrls) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `
      INSERT INTO requests (name, phone, email, description, image_urls, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [
        requestData.name,
        requestData.phone,
        requestData.email,
        requestData.description,
        imageUrls,
        "Received",
      ]
    );
    client.release();
    return result.rows[0];
  } catch (err) {
    console.error("Error creating request:", err.stack);
    throw err;
  }
}

const getRequests = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM requests");
    return result.rows; // Should return an array
  } catch (err) {
    console.error("Error fetching requests:", err);
    throw err;
  } finally {
    client.release();
  }
};

async function updateRequestStatus(id, status) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `
      UPDATE requests 
      SET status = $1 
      WHERE id = $2 
      RETURNING *;
      `,
      [status, id]
    );
    client.release();
    return result.rows[0];
  } catch (err) {
    console.error("Error updating request status:", err.stack);
    throw err;
  }
}

module.exports = {
  pool,
  testConnection,
  listTables,
  createInventoryTable,
  createRequestsTable,
  getInventoryItems,
  getInventoryItemById,
  createRequest,
  getRequests,
  updateRequestStatus,
};
