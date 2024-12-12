const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
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

module.exports = {
  pool,
  testConnection,
  listTables,
};
