const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/cyo_rugs",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log("MongoDB connected");
};

module.exports = connectDB;
