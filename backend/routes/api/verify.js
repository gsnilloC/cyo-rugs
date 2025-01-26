const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

const storedHashedPassword = process.env.HASHED_PASSWORD; // Store the hashed password in an environment variable

router.post("/verify-password", async (req, res) => {
  const { password } = req.body;

  const isMatch = await bcrypt.compare(password, storedHashedPassword);

  if (isMatch) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

module.exports = router;
