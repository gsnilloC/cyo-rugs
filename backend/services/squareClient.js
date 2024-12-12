require("dotenv").config();
const { Client } = require("square");

if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error("SQUARE_ACCESS_TOKEN is not set in environment variables");
}

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: "production",
});

// Verify client initialization
squareClient.catalogApi
  .listCatalog()
  .then(() => console.log("Square client initialized successfully"))
  .catch((err) => console.error("Failed to initialize Square client:", err));

module.exports = squareClient;
