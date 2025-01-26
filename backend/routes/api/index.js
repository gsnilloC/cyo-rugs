const express = require("express");
const router = express.Router();

const itemsRouter = require("./items");
const ordersRouter = require("./orders");
const inventoryRouter = require("./inventory");
const utilsRouter = require("./utils");
const settingsRouter = require("./settings");
const verifyRouter = require("./verify");

router.use("/items", itemsRouter);
router.use("/orders", ordersRouter);
router.use("/inventory", inventoryRouter);
router.use("/settings", settingsRouter);
router.use("/", utilsRouter);
router.use("/verify", verifyRouter);

module.exports = router;
