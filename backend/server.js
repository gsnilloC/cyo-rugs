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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
