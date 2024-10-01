const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db/config");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../build")));

// Define a route for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// Handle any other routes by sending the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
