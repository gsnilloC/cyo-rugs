const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/cyo_rugs"
  );
  //console.log("MongoDB connected");
};

module.exports = connectDB;
