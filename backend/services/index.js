const { uploadImages } = require("./aws");
const squareClient = require("./squareClient");
const {
  listItems,
  testSquareApi,
  createCheckout,
  getInventoryCount,
  decrementInventory,
  getInventoryCounts,
  getPricesForItemIds,
} = require("./square");
const verifyRecaptcha = require("./recaptcha");

module.exports = {
  uploadImages,
  listItems,
  testSquareApi,
  createCheckout,
  getInventoryCount,
  decrementInventory,
  getInventoryCounts,
  getPricesForItemIds,
  verifyRecaptcha,
  client: squareClient,
};
