/**
 * Test Express App Setup
 * This creates an Express app instance for testing without starting a server
 */

const cors = require("cors");
const express = require("express");
const apiRouter = require("../../../backend/routes/api");

const createTestApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  
  // Routes
  app.use("/api", apiRouter);

  return app;
};

module.exports = createTestApp;

