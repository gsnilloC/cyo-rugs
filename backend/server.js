const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db/config");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use(express.static(path.join(__dirname, "../build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
