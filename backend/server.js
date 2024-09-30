const express = require("express");
const cors = require("cors");
require("dotenv").config();
//const connectDB = require("./db/config");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
//connectDB();

// Routes
// Add your routes here

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
