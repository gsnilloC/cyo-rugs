const express = require("express");
const router = express.Router();

const itemsRouter = require("./items");
const ordersRouter = require("./orders");
const inventoryRouter = require("./inventory");
const utilsRouter = require("./utils");

router.use("/items", itemsRouter);
router.use("/orders", ordersRouter);
router.use("/inventory", inventoryRouter);
router.use("/", utilsRouter);

module.exports = router;
