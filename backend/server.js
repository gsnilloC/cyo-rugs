const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const express = require("express");
const webhookRouter = require("./routes/webhooks");
const pagesRouter = require("./routes/pages");
const apiRouter = require("./routes/api");

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../build")));
app.use("/webhook", webhookRouter);
app.use("/api", apiRouter);
app.use("/", pagesRouter);

// function requireHTTPS(req, res, next) {
//   if (!req.secure && req.get("x-forwarded-proto") !== "https") {
//     return res.redirect("https://" + req.get("host") + req.url);
//   }
//   next();
// }

// app.use(requireHTTPS);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
