const { pool } = require("./config");

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

async function deleteRequestById(id) {
  try {
    const client = await pool.connect();
    const result = await client.query("DELETE FROM requests WHERE id = $1", [
      id,
    ]);
    client.release();
    return result;
  } catch (err) {
    console.error("Error deleting request:", err.stack);
    throw err;
  }
}

module.exports = {
  createRequestsTable,
  createRequest,
  getRequests,
  updateRequestStatus,
  deleteRequestById,
};
